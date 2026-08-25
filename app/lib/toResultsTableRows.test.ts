import { describe, expect, it } from "vitest";
import { Participant } from "../types/participant";
import { toResultsTableRows } from "./toResultsTableRows";

function makeParticipant(
  id: number,
  stats: Partial<Participant> = {},
): Participant {
  return {
    id,
    name: `P${id}`,
    year: 2000,
    club: `Club${id}`,
    ranking: id,
    ...stats,
  };
}

describe("toResultsTableRows", () => {
  it("maps participants to rows with places in input order", () => {
    const participants = [
      makeParticipant(7, { index: 12, wins: 5, winsRate: 1 }),
      makeParticipant(3, { index: -4, wins: 2, winsRate: 0.4 }),
    ];

    const rows = toResultsTableRows(participants);

    expect(rows).toEqual([
      {
        id: 7,
        place: 1,
        name: "P7",
        club: "Club7",
        wins: 5,
        winsRate: "1.00",
        index: "12",
      },
      {
        id: 3,
        place: 2,
        name: "P3",
        club: "Club3",
        wins: 2,
        winsRate: "0.40",
        index: "-4",
      },
    ]);
  });

  it("falls back to zero for missing stats", () => {
    const rows = toResultsTableRows([makeParticipant(1)]);

    expect(rows[0].index).toBe("0");
    expect(rows[0].wins).toBe(0);
    expect(rows[0].winsRate).toBe("0.00");
  });

  it("returns an empty array for no participants", () => {
    expect(toResultsTableRows([])).toEqual([]);
  });
});
