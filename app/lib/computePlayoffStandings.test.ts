import { describe, expect, it } from "vitest";
import { Participant } from "../types/participant";
import { Playoff } from "../types/playoff";
import { computePlayoffStandings } from "./computePlayoffStandings";
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

// Plays every ready match, always advancing the lower id (better seed)
function playThrough(playoff: Playoff): Playoff {
  let current = playoff;
  let progressed = true;
  while (progressed) {
    progressed = false;
    for (const match of current.matches) {
      if (
        match.winnerId === null &&
        match.firstId !== null &&
        match.secondId !== null
      ) {
        current = setPlayoffWinner(
          current,
          match.id,
          Math.min(match.firstId, match.secondId),
        );
        progressed = true;
      }
    }
  }
  return current;
}

describe("computePlayoffStandings", () => {
  it("returns nothing until the final is decided", () => {
    let playoff = generatePlayoff(makeSeededField(4));
    expect(computePlayoffStandings(playoff)).toEqual([]);

    playoff = setPlayoffWinner(playoff, playoff.matches[0].id, 1);
    expect(computePlayoffStandings(playoff)).toEqual([]);
  });

  it("shares third place between semifinal losers", () => {
    const playoff = playThrough(generatePlayoff(makeSeededField(4)));

    const standings = computePlayoffStandings(playoff);

    expect(standings.map((row) => ({ id: row.id, place: row.place }))).toEqual([
      { id: 1, place: 1 },
      { id: 2, place: 2 },
      { id: 3, place: 3 },
      { id: 4, place: 3 },
    ]);
  });

  it("places everyone in a field with byes, ranking early losers by seed", () => {
    const playoff = playThrough(generatePlayoff(makeSeededField(6)));

    const standings = computePlayoffStandings(playoff);

    expect(standings.map((row) => ({ id: row.id, place: row.place }))).toEqual([
      { id: 1, place: 1 },
      { id: 2, place: 2 },
      { id: 3, place: 3 },
      { id: 4, place: 3 },
      { id: 5, place: 5 },
      { id: 6, place: 6 },
    ]);
  });

  it("gives quarterfinal losers distinct places 5-8 per FIE ranking", () => {
    const playoff = playThrough(generatePlayoff(makeSeededField(8)));

    const standings = computePlayoffStandings(playoff);

    expect(standings.map((row) => ({ id: row.id, place: row.place }))).toEqual([
      { id: 1, place: 1 },
      { id: 2, place: 2 },
      { id: 3, place: 3 },
      { id: 4, place: 3 },
      { id: 5, place: 5 },
      { id: 6, place: 6 },
      { id: 7, place: 7 },
      { id: 8, place: 8 },
    ]);
  });

  it("includes names, years and clubs for display", () => {
    const playoff = playThrough(generatePlayoff(makeSeededField(2)));

    expect(computePlayoffStandings(playoff)).toEqual([
      { id: 1, place: 1, name: "P1", year: 2000, club: "Club1" },
      { id: 2, place: 2, name: "P2", year: 2000, club: "Club2" },
    ]);
  });
});
