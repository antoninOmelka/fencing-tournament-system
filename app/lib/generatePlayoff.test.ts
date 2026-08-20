import { describe, expect, it } from "vitest";
import { Participant } from "../types/participant";
import { generatePlayoff } from "./generatePlayoff";

// Participant id equals the seed (index + 1), which keeps assertions readable
function makeSeededField(count: number): Participant[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `P${index + 1}`,
    year: 2000,
    club: `Club${index + 1}`,
    ranking: index + 1,
  }));
}

describe("generatePlayoff", () => {
  it("returns no matches for fewer than two participants", () => {
    expect(generatePlayoff([]).matches).toEqual([]);
    expect(generatePlayoff(makeSeededField(1)).matches).toEqual([]);
  });

  it("generates a single final for two participants", () => {
    const playoff = generatePlayoff(makeSeededField(2));

    expect(playoff.matches).toHaveLength(1);
    expect(playoff.matches[0]).toMatchObject({
      round: 1,
      slot: 0,
      firstId: 1,
      secondId: 2,
      winnerId: null,
    });
  });

  it("pairs a full field of eight in the standard bracket order", () => {
    const playoff = generatePlayoff(makeSeededField(8));

    const firstRound = playoff.matches.filter((match) => match.round === 1);
    expect(
      firstRound.map((match) => [match.firstId, match.secondId]),
    ).toEqual([
      [1, 8],
      [4, 5],
      [2, 7],
      [3, 6],
    ]);
    expect(playoff.matches).toHaveLength(7);
    expect(firstRound.every((match) => match.winnerId === null)).toBe(true);
  });

  it("gives byes to the top seeds and advances them immediately", () => {
    const playoff = generatePlayoff(makeSeededField(6));

    const firstRound = playoff.matches.filter((match) => match.round === 1);
    const byeMatches = firstRound.filter((match) => match.secondId === null);
    expect(byeMatches.map((match) => match.firstId).sort()).toEqual([1, 2]);
    expect(byeMatches.every((match) => match.winnerId === match.firstId)).toBe(
      true,
    );

    const semifinals = playoff.matches.filter((match) => match.round === 2);
    expect(semifinals.map((match) => [match.firstId, match.secondId])).toEqual(
      [
        [1, null],
        [2, null],
      ],
    );
  });

  it("builds a sound bracket for any field size from 2 to 33", () => {
    for (let count = 2; count <= 33; count++) {
      const playoff = generatePlayoff(makeSeededField(count));
      const bracketSize = 2 ** Math.ceil(Math.log2(count));

      expect(playoff.matches).toHaveLength(bracketSize - 1);

      const firstRound = playoff.matches.filter((match) => match.round === 1);
      expect(firstRound).toHaveLength(bracketSize / 2);

      // every fully populated first-round pair of seeds sums to bracketSize + 1
      firstRound.forEach((match) => {
        if (match.firstId !== null && match.secondId !== null) {
          expect(match.firstId + match.secondId).toBe(bracketSize + 1);
        }
      });

      // every participant appears exactly once in round 1
      const seenIds = firstRound
        .flatMap((match) => [match.firstId, match.secondId])
        .filter((id) => id !== null);
      expect(seenIds.length).toBe(count);
      expect(new Set(seenIds).size).toBe(count);

      // byes go to the best seeds
      const byeCount = bracketSize - count;
      const byeIds = firstRound
        .filter((match) => match.firstId === null || match.secondId === null)
        .map((match) => (match.firstId === null ? match.secondId : match.firstId));
      expect(byeIds).toHaveLength(byeCount);
      expect([...byeIds].sort((a, b) => Number(a) - Number(b))).toEqual(
        Array.from({ length: byeCount }, (_, index) => index + 1),
      );
    }
  });
});
