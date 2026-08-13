import { describe, expect, it } from "vitest";
import { Group } from "../types/group";
import { Participant } from "../types/participant";
import { calculateStats } from "./calculateStats";

function makeParticipant(id: number, name: string): Participant {
  return { id, name, year: 2000, club: "Club", ranking: id };
}

function makeGroup(participants: Participant[], results: string[][]): Group {
  return { id: 1, participants, results };
}

describe("calculateStats", () => {
  it("returns zero stats for a group with no entered results", () => {
    const participants = [
      makeParticipant(1, "A"),
      makeParticipant(2, "B"),
      makeParticipant(3, "C"),
    ];
    const results = [
      ["", "", ""],
      ["", "", ""],
      ["", "", ""],
    ];

    const stats = calculateStats(makeGroup(participants, results));

    stats.forEach((participant) => {
      expect(participant.wins).toBe(0);
      expect(participant.winsRate).toBe(0);
      expect(participant.pointsScored).toBe(0);
      expect(participant.pointsReceived).toBe(0);
      expect(participant.index).toBe(0);
    });
  });

  it("calculates stats for a complete round robin of three fencers", () => {
    const participants = [
      makeParticipant(1, "A"),
      makeParticipant(2, "B"),
      makeParticipant(3, "C"),
    ];
    // A beats B 5:3, C beats A 5:2, B beats C 5:4
    const results = [
      ["", "V5", "D2"],
      ["D3", "", "V5"],
      ["V5", "D4", ""],
    ];

    const [a, b, c] = calculateStats(makeGroup(participants, results));

    expect(a).toMatchObject({
      wins: 1,
      winsRate: 0.5,
      pointsScored: 7,
      pointsReceived: 8,
      index: -1,
    });
    expect(b).toMatchObject({
      wins: 1,
      winsRate: 0.5,
      pointsScored: 8,
      pointsReceived: 9,
      index: -1,
    });
    expect(c).toMatchObject({
      wins: 1,
      winsRate: 0.5,
      pointsScored: 9,
      pointsReceived: 7,
      index: 2,
    });
  });

  it("counts only entered matches in a partially filled table", () => {
    const participants = [
      makeParticipant(1, "A"),
      makeParticipant(2, "B"),
      makeParticipant(3, "C"),
    ];
    // Only A vs B has been fenced (A wins 5:1)
    const results = [
      ["", "V5", ""],
      ["D1", "", ""],
      ["", "", ""],
    ];

    const [a, b, c] = calculateStats(makeGroup(participants, results));

    expect(a).toMatchObject({ wins: 1, winsRate: 1, index: 4 });
    expect(b).toMatchObject({ wins: 0, winsRate: 0, index: -4 });
    expect(c).toMatchObject({
      wins: 0,
      winsRate: 0,
      pointsScored: 0,
      pointsReceived: 0,
      index: 0,
    });
  });

  it("treats a missing mirror cell as zero points received", () => {
    const participants = [makeParticipant(1, "A"), makeParticipant(2, "B")];
    // Upper-triangle cell entered, mirror cell not yet filled in
    const results = [
      ["", "V5"],
      ["", ""],
    ];

    const [a, b] = calculateStats(makeGroup(participants, results));

    expect(a).toMatchObject({
      wins: 1,
      pointsScored: 5,
      pointsReceived: 0,
      index: 5,
    });
    expect(b).toMatchObject({
      wins: 0,
      pointsScored: 0,
      pointsReceived: 5,
      index: -5,
    });
  });

  it("preserves participant order and existing fields", () => {
    const participants = [
      { ...makeParticipant(1, "A"), groupRanking: 1 },
      { ...makeParticipant(2, "B"), groupRanking: 2 },
    ];
    const results = [
      ["", "V5"],
      ["D3", ""],
    ];

    const stats = calculateStats(makeGroup(participants, results));

    expect(stats.map((participant) => participant.id)).toEqual([1, 2]);
    expect(stats[0]).toMatchObject({
      name: "A",
      club: "Club",
      groupRanking: 1,
    });
    expect(stats[1]).toMatchObject({
      name: "B",
      club: "Club",
      groupRanking: 2,
    });
  });
});
