import { describe, expect, it } from "vitest";
import { Group } from "../types/group";
import { Participant } from "../types/participant";
import { sortParticipantsByResults } from "./sortParticipantsByResults";

function makeParticipant(
  id: number,
  stats: Partial<Participant> = {},
): Participant {
  return {
    id,
    name: `P${id}`,
    year: 2000,
    club: "Club",
    ranking: id,
    wins: 0,
    winsRate: 0,
    pointsScored: 0,
    pointsReceived: 0,
    index: 0,
    ...stats,
  };
}

function makeGroup(id: number, participants: Participant[]): Group {
  return { id, participants, results: [] };
}

describe("sortParticipantsByResults", () => {
  it("flattens participants from all groups", () => {
    const groups = [
      makeGroup(1, [makeParticipant(1), makeParticipant(2)]),
      makeGroup(2, [makeParticipant(3)]),
    ];

    const sorted = sortParticipantsByResults(groups);

    expect(sorted).toHaveLength(3);
    expect(new Set(sorted.map((participant) => participant.id))).toEqual(
      new Set([1, 2, 3]),
    );
  });

  it("sorts by number of wins first", () => {
    const groups = [
      makeGroup(1, [
        makeParticipant(1, { wins: 1, winsRate: 1, index: 20 }),
        makeParticipant(2, { wins: 3, winsRate: 0.5, index: -5 }),
        makeParticipant(3, { wins: 2, winsRate: 0.9, index: 10 }),
      ]),
    ];

    const sorted = sortParticipantsByResults(groups);

    expect(sorted.map((participant) => participant.id)).toEqual([2, 3, 1]);
  });

  it("breaks equal wins by victory rate", () => {
    const groups = [
      makeGroup(1, [
        makeParticipant(1, { wins: 2, winsRate: 0.4 }),
        makeParticipant(2, { wins: 2, winsRate: 0.75 }),
      ]),
    ];

    const sorted = sortParticipantsByResults(groups);

    expect(sorted.map((participant) => participant.id)).toEqual([2, 1]);
  });

  it("breaks equal victory rate by index", () => {
    const groups = [
      makeGroup(1, [
        makeParticipant(1, { wins: 2, winsRate: 0.5, index: -3 }),
        makeParticipant(2, { wins: 2, winsRate: 0.5, index: 4 }),
      ]),
    ];

    const sorted = sortParticipantsByResults(groups);

    expect(sorted.map((participant) => participant.id)).toEqual([2, 1]);
  });

  it("breaks equal index by touches scored", () => {
    const groups = [
      makeGroup(1, [
        makeParticipant(1, {
          wins: 2,
          winsRate: 0.5,
          index: 0,
          pointsScored: 12,
        }),
        makeParticipant(2, {
          wins: 2,
          winsRate: 0.5,
          index: 0,
          pointsScored: 18,
        }),
      ]),
    ];

    const sorted = sortParticipantsByResults(groups);

    expect(sorted.map((participant) => participant.id)).toEqual([2, 1]);
  });

  it("treats participants without recorded stats as having zeros", () => {
    // Freshly generated groups have no stats yet — sorting must still work
    const noStats: Participant = {
      id: 1,
      name: "P1",
      year: 2000,
      club: "Club",
      ranking: 1,
    };
    const groups = [
      makeGroup(1, [noStats, makeParticipant(2, { wins: 1, winsRate: 1 })]),
    ];

    const sorted = sortParticipantsByResults(groups);

    expect(sorted.map((participant) => participant.id)).toEqual([2, 1]);
  });

  it("treats victory rates as equal when they differ under one percent", () => {
    // Rates are compared rounded to whole percent, so the index decides here
    const groups = [
      makeGroup(1, [
        makeParticipant(1, { wins: 2, winsRate: 0.501, index: 5 }),
        makeParticipant(2, { wins: 2, winsRate: 0.504, index: 10 }),
      ]),
    ];

    const sorted = sortParticipantsByResults(groups);

    expect(sorted.map((participant) => participant.id)).toEqual([2, 1]);
  });
});
