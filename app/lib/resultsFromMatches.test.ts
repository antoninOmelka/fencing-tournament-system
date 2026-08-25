import { describe, expect, it } from "vitest";
import { Match } from "../types/match";
import { Participant } from "../types/participant";
import { resultsFromMatches } from "./resultsFromMatches";

function makeParticipant(id: number): Participant {
  return { id, name: `P${id}`, year: 2000, club: "Club", ranking: id };
}

const participants = [
  makeParticipant(1),
  makeParticipant(2),
  makeParticipant(3),
];

describe("resultsFromMatches", () => {
  it("returns an empty matrix when no match was fenced", () => {
    const matches: Match[] = [
      { firstId: 1, secondId: 2 },
      { firstId: 1, secondId: 3 },
    ];

    expect(resultsFromMatches(participants, matches)).toEqual([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
  });

  it("writes a full-score victory as a plain V", () => {
    const matches: Match[] = [
      { firstId: 1, secondId: 2, winnerId: 1, firstScore: 5, secondScore: 3 },
    ];

    const results = resultsFromMatches(participants, matches);

    expect(results[0][1]).toBe("V");
    expect(results[1][0]).toBe("D3");
  });

  it("adds the score to a victory short of 5 touches", () => {
    const matches: Match[] = [
      { firstId: 1, secondId: 2, winnerId: 2, firstScore: 3, secondScore: 4 },
    ];

    const results = resultsFromMatches(participants, matches);

    expect(results[0][1]).toBe("D3");
    expect(results[1][0]).toBe("V4");
  });

  it("shows a lone D for a missing loser score", () => {
    const matches: Match[] = [
      { firstId: 1, secondId: 2, winnerId: 1, firstScore: 5 },
    ];

    const results = resultsFromMatches(participants, matches);

    expect(results[0][1]).toBe("V");
    expect(results[1][0]).toBe("D");
  });

  it("skips matches referencing unknown participants", () => {
    const matches: Match[] = [
      { firstId: 1, secondId: 99, winnerId: 1, firstScore: 5, secondScore: 1 },
    ];

    expect(resultsFromMatches(participants, matches)).toEqual([
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ]);
  });
});
