import { describe, expect, it } from "vitest";
import { Match } from "../types/match";
import { Participant } from "../types/participant";
import { matchesFromResults } from "./matchesFromResults";

function makeParticipant(id: number): Participant {
  return { id, name: `P${id}`, year: 2000, club: "Club", ranking: id };
}

const participants = [makeParticipant(1), makeParticipant(2)];
const matches: Match[] = [{ firstId: 1, secondId: 2 }];

describe("matchesFromResults", () => {
  it("keeps a match without results bare", () => {
    const results = [
      ["", ""],
      ["", ""],
    ];

    expect(matchesFromResults(participants, matches, results)).toEqual([
      { firstId: 1, secondId: 2 },
    ]);
  });

  it("builds a complete record from both cells", () => {
    const results = [
      ["", "V"],
      ["D3", ""],
    ];

    expect(matchesFromResults(participants, matches, results)).toEqual([
      { firstId: 1, secondId: 2, winnerId: 1, firstScore: 5, secondScore: 3 },
    ]);
  });

  it("records an overtime victory with its score", () => {
    const results = [
      ["", "V4"],
      ["D4", ""],
    ];

    expect(matchesFromResults(participants, matches, results)).toEqual([
      { firstId: 1, secondId: 2, winnerId: 1, firstScore: 4, secondScore: 4 },
    ]);
  });

  it("defaults a missing winner cell to a full-score victory", () => {
    const results = [
      ["", ""],
      ["D2", ""],
    ];

    expect(matchesFromResults(participants, matches, results)).toEqual([
      { firstId: 1, secondId: 2, winnerId: 1, firstScore: 5, secondScore: 2 },
    ]);
  });

  it("leaves the loser score out while the pre-filled D is incomplete", () => {
    const results = [
      ["", "V"],
      ["D", ""],
    ];

    expect(matchesFromResults(participants, matches, results)).toEqual([
      { firstId: 1, secondId: 2, winnerId: 1, firstScore: 5 },
    ]);
  });

  it("legacy: adopts an asymmetric one-sided victory cell", () => {
    const results = [
      ["", "V5"],
      ["", ""],
    ];

    expect(matchesFromResults(participants, matches, results)).toEqual([
      { firstId: 1, secondId: 2, winnerId: 1, firstScore: 5 },
    ]);
  });

  it("legacy: the first participant's cell decides a contradiction", () => {
    const results = [
      ["", "V3"],
      ["V4", ""],
    ];

    expect(matchesFromResults(participants, matches, results)).toEqual([
      { firstId: 1, secondId: 2, winnerId: 1, firstScore: 3, secondScore: 4 },
    ]);
  });

  it("keeps a match bare when a participant is unknown", () => {
    const orphanMatches: Match[] = [{ firstId: 1, secondId: 99 }];
    const results = [
      ["", "V"],
      ["D3", ""],
    ];

    expect(matchesFromResults(participants, orphanMatches, results)).toEqual([
      { firstId: 1, secondId: 99 },
    ]);
  });
});
