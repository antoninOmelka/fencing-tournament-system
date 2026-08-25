import { describe, expect, it } from "vitest";
import { maxParticipantYear, participantSchema } from "./participantSchema";

const validParticipant = {
  name: "Novak",
  year: 2000,
  club: "Sokol",
  ranking: 5,
};

describe("participantSchema", () => {
  it("accepts a valid participant", () => {
    expect(participantSchema.safeParse(validParticipant).success).toBe(true);
  });

  it("coerces numeric strings for year and ranking", () => {
    const result = participantSchema.safeParse({
      ...validParticipant,
      year: "1997",
      ranking: "42",
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.year).toBe(1997);
      expect(result.data.ranking).toBe(42);
    }
  });

  it.each([
    ["year at lower bound", { year: 1900 }],
    ["year at upper bound", { year: maxParticipantYear }],
    ["ranking at lower bound", { ranking: 1 }],
    ["ranking at upper bound", { ranking: 999 }],
    ["name at max length", { name: "X".repeat(25) }],
  ])("accepts %s", (_label, override) => {
    const result = participantSchema.safeParse({
      ...validParticipant,
      ...override,
    });

    expect(result.success).toBe(true);
  });

  it.each([
    ["empty name", { name: "" }],
    ["name over 25 characters", { name: "X".repeat(26) }],
    ["empty club", { club: "" }],
    ["year before 1900", { year: 1899 }],
    ["year after current year", { year: maxParticipantYear + 1 }],
    ["non-integer year", { year: 2000.5 }],
    ["ranking below 1", { ranking: 0 }],
    ["ranking above 999", { ranking: 1000 }],
    ["non-integer ranking", { ranking: 1.5 }],
    ["non-numeric ranking", { ranking: "abc" }],
  ])("rejects %s", (_label, override) => {
    const result = participantSchema.safeParse({
      ...validParticipant,
      ...override,
    });

    expect(result.success).toBe(false);
  });
});
