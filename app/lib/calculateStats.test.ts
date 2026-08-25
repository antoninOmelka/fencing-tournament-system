import { describe, expect, it } from "vitest";
import { Group } from "../types/group";
import { Match } from "../types/match";
import { Participant } from "../types/participant";
import { calculateStats } from "./calculateStats";

function makeParticipant(id: number, name: string): Participant {
  return { id, name, year: 2000, club: "Club", ranking: id };
}

function makeGroup(participants: Participant[], matches: Match[]): Group {
  return { id: 1, participants, matches };
}

describe("calculateStats", () => {
  it("returns zero stats for a group with no fenced matches", () => {
    const participants = [
      makeParticipant(1, "A"),
      makeParticipant(2, "B"),
      makeParticipant(3, "C"),
    ];
    const matches: Match[] = [
      { firstId: 1, secondId: 2 },
      { firstId: 1, secondId: 3 },
      { firstId: 2, secondId: 3 },
    ];

    const stats = calculateStats(makeGroup(participants, matches));

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
    const matches: Match[] = [
      { firstId: 1, secondId: 2, winnerId: 1, firstScore: 5, secondScore: 3 },
      { firstId: 1, secondId: 3, winnerId: 3, firstScore: 2, secondScore: 5 },
      { firstId: 2, secondId: 3, winnerId: 2, firstScore: 5, secondScore: 4 },
    ];

    const [a, b, c] = calculateStats(makeGroup(participants, matches));

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

  it("counts only fenced matches in a partially played group", () => {
    const participants = [
      makeParticipant(1, "A"),
      makeParticipant(2, "B"),
      makeParticipant(3, "C"),
    ];
    // Only A vs B has been fenced (A wins 5:1)
    const matches: Match[] = [
      { firstId: 1, secondId: 2, winnerId: 1, firstScore: 5, secondScore: 1 },
      { firstId: 1, secondId: 3 },
      { firstId: 2, secondId: 3 },
    ];

    const [a, b, c] = calculateStats(makeGroup(participants, matches));

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

  it("defaults a missing winner score to 5 and a missing loser score to 0", () => {
    const participants = [makeParticipant(1, "A"), makeParticipant(2, "B")];
    const matches: Match[] = [{ firstId: 1, secondId: 2, winnerId: 1 }];

    const [a, b] = calculateStats(makeGroup(participants, matches));

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

  it("counts an overtime victory with the recorded scores", () => {
    const participants = [makeParticipant(1, "A"), makeParticipant(2, "B")];
    // time expired at 4:4, A won on priority — V4 / D4
    const matches: Match[] = [
      { firstId: 1, secondId: 2, winnerId: 1, firstScore: 4, secondScore: 4 },
    ];

    const [a, b] = calculateStats(makeGroup(participants, matches));

    expect(a).toMatchObject({ wins: 1, pointsScored: 4, index: 0 });
    expect(b).toMatchObject({ wins: 0, pointsScored: 4, index: 0 });
  });

  it("skips a match referencing an unknown participant", () => {
    const participants = [makeParticipant(1, "A"), makeParticipant(2, "B")];
    const matches: Match[] = [
      { firstId: 1, secondId: 99, winnerId: 1, firstScore: 5, secondScore: 2 },
    ];

    const [a] = calculateStats(makeGroup(participants, matches));

    expect(a).toMatchObject({ wins: 0, pointsScored: 0 });
  });

  it("preserves participant order and existing fields", () => {
    const participants = [
      { ...makeParticipant(1, "A"), groupRanking: 1 },
      { ...makeParticipant(2, "B"), groupRanking: 2 },
    ];
    const matches: Match[] = [
      { firstId: 1, secondId: 2, winnerId: 1, firstScore: 5, secondScore: 3 },
    ];

    const stats = calculateStats(makeGroup(participants, matches));

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
