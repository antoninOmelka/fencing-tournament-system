import { describe, expect, it } from "vitest";
import { Participant } from "../types/participant";
import { generatePlayoff } from "./generatePlayoff";
import { setPlayoffWinner } from "./setPlayoffWinner";
import { toPlayoffView } from "./toPlayoffView";

function makeSeededField(count: number): Participant[] {
  return Array.from({ length: count }, (_, index) => ({
    id: index + 1,
    name: `P${index + 1}`,
    year: 2000,
    club: `Club${index + 1}`,
    ranking: index + 1,
  }));
}

describe("toPlayoffView", () => {
  it("labels rounds by their stage", () => {
    const view = toPlayoffView(generatePlayoff(makeSeededField(16)));

    expect(view.rounds.map((round) => round.title)).toEqual([
      "Table of 16",
      "Quarterfinal",
      "Semifinal",
      "Final",
    ]);
  });

  it("shows names with seeds, byes and TBD slots", () => {
    const view = toPlayoffView(generatePlayoff(makeSeededField(6)));

    const [quarterfinals, semifinals] = view.rounds;

    expect(quarterfinals.matches[0].first).toMatchObject({
      participantId: 1,
      seed: 1,
      label: "P1",
      isWinner: true, // advanced by bye
    });
    expect(quarterfinals.matches[0].second).toMatchObject({
      participantId: null,
      seed: null,
      label: "BYE",
      isWinner: false,
    });
    expect(quarterfinals.matches[0].isSelectable).toBe(false);
    expect(quarterfinals.matches[1].isSelectable).toBe(true);

    expect(semifinals.matches[0].second.label).toBe("TBD");
    expect(semifinals.matches[0].isSelectable).toBe(false);
  });

  it("marks the winner of a decided match", () => {
    let playoff = generatePlayoff(makeSeededField(4));
    const semifinal = playoff.matches[0]; // 1 vs 4
    playoff = setPlayoffWinner(playoff, semifinal.id, 4);

    const view = toPlayoffView(playoff);

    expect(view.rounds[0].matches[0].isDecided).toBe(true);
    expect(view.rounds[0].matches[0].first.isWinner).toBe(false);
    expect(view.rounds[0].matches[0].second.isWinner).toBe(true);
  });
});
