import { describe, expect, it } from "vitest";
import {
  formatValidationIssues,
  groupPatchSchema,
  groupSchema,
  matchSchema,
  playoffSchema,
  storedParticipantSchema,
} from "./apiSchemas";

const participant = {
  id: 1,
  name: "Novak",
  year: 2000,
  club: "Sokol",
  ranking: 5,
};

describe("storedParticipantSchema", () => {
  it("accepts a stored participant with tournament fields", () => {
    const result = storedParticipantSchema.safeParse({
      ...participant,
      drawNumber: 3,
      groupRanking: 2,
      wins: 4,
      winsRate: 0.8,
      pointsScored: 20,
      pointsReceived: 10,
      index: 10,
    });

    expect(result.success).toBe(true);
  });

  it("rejects a participant without an id", () => {
    const withoutId = { ...participant, id: undefined };
    expect(storedParticipantSchema.safeParse(withoutId).success).toBe(false);
  });

  it("rejects an invalid winsRate", () => {
    const result = storedParticipantSchema.safeParse({
      ...participant,
      winsRate: 1.5,
    });

    expect(result.success).toBe(false);
  });
});

describe("matchSchema", () => {
  it("accepts a bare match and a complete record", () => {
    expect(matchSchema.safeParse({ firstId: 1, secondId: 2 }).success).toBe(
      true,
    );
    expect(
      matchSchema.safeParse({
        firstId: 1,
        secondId: 2,
        winnerId: 1,
        firstScore: 5,
        secondScore: 3,
      }).success,
    ).toBe(true);
  });

  it("rejects a winner who is not one of the participants", () => {
    const result = matchSchema.safeParse({
      firstId: 1,
      secondId: 2,
      winnerId: 3,
    });

    expect(result.success).toBe(false);
  });

  it("rejects scores without a winner", () => {
    const result = matchSchema.safeParse({
      firstId: 1,
      secondId: 2,
      firstScore: 5,
    });

    expect(result.success).toBe(false);
  });

  it("rejects a score outside 0-5", () => {
    const result = matchSchema.safeParse({
      firstId: 1,
      secondId: 2,
      winnerId: 1,
      firstScore: 6,
    });

    expect(result.success).toBe(false);
  });
});

describe("groupSchema", () => {
  const group = {
    id: 1,
    participants: [participant],
    matches: [{ firstId: 1, secondId: 2 }],
    results: [["", "V"]],
  };

  it("accepts a group", () => {
    expect(groupSchema.safeParse(group).success).toBe(true);
  });

  it("rejects a group with an invalid participant", () => {
    const result = groupSchema.safeParse({
      ...group,
      participants: [{ ...participant, name: "" }],
    });

    expect(result.success).toBe(false);
  });

  it("strips the id from a patch body", () => {
    const result = groupPatchSchema.safeParse(group);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).not.toHaveProperty("id");
    }
  });
});

describe("playoffSchema", () => {
  it("accepts a playoff with byes and undecided matches", () => {
    const result = playoffSchema.safeParse({
      participants: [participant],
      matches: [
        {
          id: 1,
          round: 1,
          slot: 0,
          firstId: 1,
          secondId: null,
          winnerId: null,
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects a playoff match without a round", () => {
    const result = playoffSchema.safeParse({
      participants: [participant],
      matches: [{ id: 1, slot: 0, firstId: 1, secondId: null, winnerId: null }],
    });

    expect(result.success).toBe(false);
  });
});

describe("formatValidationIssues", () => {
  it("joins issue paths and messages into one line", () => {
    const result = groupSchema.safeParse({ id: 1, participants: [{}] });

    expect(result.success).toBe(false);
    if (!result.success) {
      const message = formatValidationIssues(result.error);
      expect(message).toContain("participants.0");
    }
  });
});
