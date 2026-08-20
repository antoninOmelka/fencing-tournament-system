import { describe, expect, it } from "vitest";
import { Participant } from "../types/participant";
import { generateMatches } from "./generateMatches";

function makeParticipant(id: number): Participant {
  return { id, name: `P${id}`, year: 2000, club: "Club", ranking: id };
}

describe("generateMatches", () => {
  it("returns no matches for an empty group", () => {
    expect(generateMatches([])).toEqual([]);
  });

  it("returns no matches for a single participant", () => {
    expect(generateMatches([makeParticipant(1)])).toEqual([]);
  });

  it("returns a single match for two participants", () => {
    const matches = generateMatches([makeParticipant(1), makeParticipant(2)]);

    expect(matches).toEqual([{ firstId: 1, secondId: 2 }]);
  });

  it("pairs every participant with every other exactly once", () => {
    const participants = [1, 2, 3, 4, 5].map(makeParticipant);

    const matches = generateMatches(participants);

    expect(matches).toHaveLength(10); // C(5,2)
    const pairKeys = matches.map((match) =>
      [match.firstId, match.secondId].sort((a, b) => a - b).join("-"),
    );
    expect(new Set(pairKeys).size).toBe(10);
    matches.forEach((match) => {
      expect(match.firstId).not.toBe(match.secondId);
    });
  });

  it("uses participant ids in the generated pairs", () => {
    const participants = [10, 20, 30].map(makeParticipant);

    const matches = generateMatches(participants);

    const usedIds = new Set(
      matches.flatMap((match) => [match.firstId, match.secondId]),
    );
    expect(usedIds).toEqual(new Set([10, 20, 30]));
  });
});
