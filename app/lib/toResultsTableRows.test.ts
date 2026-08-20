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
      makeParticipant(7, { index: 12 }),
      makeParticipant(3, { index: -4 }),
    ];

    const rows = toResultsTableRows(participants);

    expect(rows).toEqual([
      { id: 7, place: 1, name: "P7", club: "Club7", index: "12" },
      { id: 3, place: 2, name: "P3", club: "Club3", index: "-4" },
    ]);
  });

  it("falls back to zero for a missing index", () => {
    const rows = toResultsTableRows([makeParticipant(1)]);

    expect(rows[0].index).toBe("0");
  });

  it("returns an empty array for no participants", () => {
    expect(toResultsTableRows([])).toEqual([]);
  });
});
