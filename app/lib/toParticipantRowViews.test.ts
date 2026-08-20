import { describe, expect, it } from "vitest";
import { Participant } from "../types/participant";
import { toParticipantRowViews } from "./toParticipantRowViews";

function makeParticipant(id: number, name: string): Participant {
  return { id, name, year: 2000, club: "Club", ranking: id };
}

describe("toParticipantRowViews", () => {
  it("sorts rows alphabetically by name", () => {
    const participants = [
      makeParticipant(1, "Novak"),
      makeParticipant(2, "Adamec"),
      makeParticipant(3, "Horak"),
    ];

    const rows = toParticipantRowViews(participants);

    expect(rows.map((row) => row.name)).toEqual(["Adamec", "Horak", "Novak"]);
  });

  it("keeps only the view fields", () => {
    const participant: Participant = {
      ...makeParticipant(1, "Novak"),
      wins: 3,
      winsRate: 0.75,
      pointsScored: 20,
      groupRanking: 2,
    };

    const rows = toParticipantRowViews([participant]);

    expect(rows[0]).toEqual({
      id: 1,
      name: "Novak",
      year: 2000,
      club: "Club",
      ranking: 1,
    });
  });

  it("does not mutate the input array", () => {
    const participants = [
      makeParticipant(1, "Novak"),
      makeParticipant(2, "Adamec"),
    ];

    toParticipantRowViews(participants);

    expect(participants.map((participant) => participant.name)).toEqual([
      "Novak",
      "Adamec",
    ]);
  });
});
