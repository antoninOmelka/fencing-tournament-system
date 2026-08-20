import { describe, expect, it } from "vitest";
import { Participant } from "../types/participant";
import { distributeIntoGroups } from "./distributeIntoGroups";

function makeParticipant(
  id: number,
  ranking: number,
  club = `Club${id}`,
): Participant {
  return { id, name: `P${id}`, year: 2000, club, ranking };
}

describe("distributeIntoGroups", () => {
  it("returns an empty array for no participants", () => {
    expect(distributeIntoGroups([])).toEqual([]);
  });

  it("puts a small field into a single group", () => {
    const participants = [1, 2, 3, 4].map((id) => makeParticipant(id, id));

    const groups = distributeIntoGroups(participants);

    expect(groups).toHaveLength(1);
    expect(groups[0].participants).toHaveLength(4);
    expect(groups[0].results).toEqual([
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
      ["", "", "", ""],
    ]);
    expect(groups[0].matches).toHaveLength(6); // C(4,2)
  });

  it("sorts participants by ranking and assigns groupRanking within each group", () => {
    const participants = [
      makeParticipant(1, 30),
      makeParticipant(2, 10),
      makeParticipant(3, 20),
    ];

    const [group] = distributeIntoGroups(participants);

    expect(
      group.participants.map((participant) => participant.ranking),
    ).toEqual([10, 20, 30]);
    expect(
      group.participants.map((participant) => participant.groupRanking),
    ).toEqual([1, 2, 3]);
  });

  it("splits twelve participants into two groups of six", () => {
    const participants = Array.from({ length: 12 }, (_, index) =>
      makeParticipant(index + 1, index + 1),
    );

    const groups = distributeIntoGroups(participants);

    expect(groups).toHaveLength(2);
    expect(groups.map((group) => group.participants.length)).toEqual([6, 6]);
    expect(groups.map((group) => group.id)).toEqual([1, 2]);
  });

  it("balances group sizes for a field that does not divide evenly", () => {
    const participants = Array.from({ length: 13 }, (_, index) =>
      makeParticipant(index + 1, index + 1),
    );

    const groups = distributeIntoGroups(participants);

    const sizes = groups
      .map((group) => group.participants.length)
      .sort((a, b) => b - a);
    expect(sizes).toEqual([7, 6]);
  });

  it("fills two full groups of seven for fourteen participants", () => {
    const participants = Array.from({ length: 14 }, (_, index) =>
      makeParticipant(index + 1, index + 1),
    );

    const groups = distributeIntoGroups(participants);

    const sizes = groups.map((group) => group.participants.length);
    expect(sizes).toEqual([7, 7]);
  });

  it("splits twenty-one participants into three groups of seven instead of four groups", () => {
    const participants = Array.from({ length: 21 }, (_, index) =>
      makeParticipant(index + 1, index + 1),
    );

    const groups = distributeIntoGroups(participants);

    const sizes = groups.map((group) => group.participants.length);
    expect(sizes).toEqual([7, 7, 7]);
  });

  it("uses the fewest groups that fit the maximum size, balanced within one", () => {
    for (let count = 2; count <= 40; count++) {
      const participants = Array.from({ length: count }, (_, index) =>
        makeParticipant(index + 1, index + 1),
      );

      const sizes = distributeIntoGroups(participants).map(
        (group) => group.participants.length,
      );

      expect(sizes).toHaveLength(Math.ceil(count / 7));
      expect(Math.max(...sizes)).toBeLessThanOrEqual(7);
      expect(Math.max(...sizes) - Math.min(...sizes)).toBeLessThanOrEqual(1);
      expect(sizes.reduce((sum, size) => sum + size, 0)).toBe(count);
    }
  });

  it("assigns every participant a draw number forming a permutation of 1..n", () => {
    const participants = Array.from({ length: 13 }, (_, index) =>
      makeParticipant(index + 1, index + 1),
    );

    const groups = distributeIntoGroups(participants);

    const drawNumbers = groups
      .flatMap((group) => group.participants)
      .map((participant) => participant.drawNumber);
    expect([...drawNumbers].sort((a, b) => Number(a) - Number(b))).toEqual(
      Array.from({ length: 13 }, (_, index) => index + 1),
    );
  });

  it("spreads clubmates across groups", () => {
    const participants = Array.from({ length: 12 }, (_, index) =>
      makeParticipant(index + 1, index + 1, index % 2 === 0 ? "A" : "B"),
    );

    const groups = distributeIntoGroups(participants);

    groups.forEach((group) => {
      const clubACount = group.participants.filter(
        (participant) => participant.club === "A",
      ).length;
      expect(clubACount).toBe(3);
    });
  });
});
