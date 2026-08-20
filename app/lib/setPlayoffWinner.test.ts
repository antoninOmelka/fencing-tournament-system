import { describe, expect, it } from "vitest";
import { Participant } from "../types/participant";
import { generatePlayoff } from "./generatePlayoff";
import { setPlayoffWinner } from "./setPlayoffWinner";

function makeSeededField(count: number): Participant[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `P${index + 1}`,
    year: 2000,
    club: `Club${index + 1}`,
    ranking: index + 1,
  }));
}

function findMatch(
  playoff: ReturnType<typeof generatePlayoff>,
  round: number,
  slot: number,
) {
  const match = playoff.matches.find(
    (item) => item.round === round && item.slot === slot,
  );
  if (!match) throw new Error(`no match ${round}:${slot}`);
  return match;
}

describe("setPlayoffWinner", () => {
  it("advances the winner into the next round", () => {
    // semifinals for 4: (1 vs 4) and (2 vs 3)
    let playoff = generatePlayoff(makeSeededField(4));
    const semifinal = findMatch(playoff, 1, 0);

    playoff = setPlayoffWinner(playoff, semifinal.id, 4);

    expect(findMatch(playoff, 1, 0).winnerId).toBe(4);
    expect(findMatch(playoff, 2, 0).firstId).toBe(4);
    expect(findMatch(playoff, 2, 0).secondId).toBe(null);
  });

  it("plays a bracket through to a decided final", () => {
    let playoff = generatePlayoff(makeSeededField(4));
    playoff = setPlayoffWinner(playoff, findMatch(playoff, 1, 0).id, 1);
    playoff = setPlayoffWinner(playoff, findMatch(playoff, 1, 1).id, 2);
    playoff = setPlayoffWinner(playoff, findMatch(playoff, 2, 0).id, 2);

    expect(findMatch(playoff, 2, 0)).toMatchObject({
      firstId: 1,
      secondId: 2,
      winnerId: 2,
    });
  });

  it("clears everything downstream when an earlier winner is corrected", () => {
    let playoff = generatePlayoff(makeSeededField(4));
    playoff = setPlayoffWinner(playoff, findMatch(playoff, 1, 0).id, 1);
    playoff = setPlayoffWinner(playoff, findMatch(playoff, 1, 1).id, 2);
    playoff = setPlayoffWinner(playoff, findMatch(playoff, 2, 0).id, 1);

    playoff = setPlayoffWinner(playoff, findMatch(playoff, 1, 0).id, 4);

    expect(findMatch(playoff, 2, 0)).toMatchObject({
      firstId: 4,
      secondId: 2,
      winnerId: null,
    });
  });

  it("keeps unrelated decided matches intact after a correction", () => {
    let playoff = generatePlayoff(makeSeededField(8));
    playoff = setPlayoffWinner(playoff, findMatch(playoff, 1, 0).id, 1);
    playoff = setPlayoffWinner(playoff, findMatch(playoff, 1, 3).id, 3);

    playoff = setPlayoffWinner(playoff, findMatch(playoff, 1, 0).id, 8);

    expect(findMatch(playoff, 1, 3).winnerId).toBe(3);
    expect(findMatch(playoff, 2, 1).firstId).toBe(null);
    expect(findMatch(playoff, 2, 1).secondId).toBe(3);
  });

  it("ignores a winner who is not part of the match", () => {
    const playoff = generatePlayoff(makeSeededField(4));
    const match = findMatch(playoff, 1, 0); // 1 vs 4

    expect(setPlayoffWinner(playoff, match.id, 2)).toBe(playoff);
  });

  it("ignores matches that are not ready yet", () => {
    const playoff = generatePlayoff(makeSeededField(4));
    const final = findMatch(playoff, 2, 0); // both TBD

    expect(setPlayoffWinner(playoff, final.id, 1)).toBe(playoff);
  });

  it("does not mutate the original playoff", () => {
    const playoff = generatePlayoff(makeSeededField(4));
    const before = JSON.parse(JSON.stringify(playoff));

    setPlayoffWinner(playoff, findMatch(playoff, 1, 0).id, 1);

    expect(playoff).toEqual(before);
  });
});
