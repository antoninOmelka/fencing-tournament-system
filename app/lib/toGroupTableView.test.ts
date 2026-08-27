import { describe, expect, it } from "vitest";
import { Group } from "../types/group";
import { Participant } from "../types/participant";
import { toGroupTableView } from "./toGroupTableView";

function makeParticipant(
  id: number,
  name: string,
  stats: Partial<Participant> = {},
): Participant {
  return { id, name, year: 2000, club: "Club", ranking: id, ...stats };
}

describe("toGroupTableView", () => {
  const group: Group = {
    id: 1,
    participants: [
      makeParticipant(1, "A", {
        groupRanking: 1,
        wins: 1,
        winsRate: 0.5,
        pointsScored: 7,
        pointsReceived: 8,
        index: -1,
      }),
      makeParticipant(2, "B", { groupRanking: 2 }),
    ],
    results: [
      ["", "V5"],
      ["D3", ""],
    ],
    matches: [{ firstId: 1, secondId: 2 }],
  };

  it("marks the diagonal with X and copies entered results", () => {
    const view = toGroupTableView(group);

    expect(view.rows[0].cells).toEqual(["X", "V5"]);
    expect(view.rows[1].cells).toEqual(["D3", "X"]);
  });

  it("formats stats as strings with two-decimal win rate", () => {
    const view = toGroupTableView(group);

    expect(view.rows[0]).toMatchObject({
      wins: "1",
      winsRate: "0.50",
      scored: "7",
      received: "8",
      index: "-1",
    });
  });

  it("falls back to zeros for participants without stats", () => {
    const view = toGroupTableView(group);

    expect(view.rows[1]).toMatchObject({
      wins: "0",
      winsRate: "0.00",
      scored: "0",
      received: "0",
      index: "0",
    });
  });

  it("uses groupRanking for orders and falls back to position", () => {
    const view = toGroupTableView(group);
    expect(view.orders).toEqual([1, 2]);

    const withoutRanking: Group = {
      ...group,
      participants: [makeParticipant(5, "A"), makeParticipant(6, "B")],
    };
    expect(toGroupTableView(withoutRanking).orders).toEqual([1, 2]);
  });

  it("maps matches to participant names and orders", () => {
    const view = toGroupTableView(group);

    expect(view.matches).toEqual([
      {
        firstOrder: 1,
        firstName: "A",
        firstResult: "V5",
        secondOrder: 2,
        secondName: "B",
        secondResult: "D3",
      },
    ]);
  });

  it("leaves match results empty when the bout was not fenced yet", () => {
    const unplayed: Group = {
      ...group,
      results: [
        ["", ""],
        ["", ""],
      ],
    };

    const view = toGroupTableView(unplayed);

    expect(view.matches[0]).toMatchObject({
      firstResult: "",
      secondResult: "",
    });
  });

  it("returns no matches for a group without generated matches", () => {
    const withoutMatches: Group = { ...group, matches: undefined };

    expect(toGroupTableView(withoutMatches).matches).toEqual([]);
  });

  it("drops matches referencing unknown participants", () => {
    const withUnknownMatch: Group = {
      ...group,
      matches: [{ firstId: 1, secondId: 99 }],
    };

    expect(toGroupTableView(withUnknownMatch).matches).toEqual([]);
  });

  it("fills missing result cells with empty strings", () => {
    const withMissingResults: Group = { ...group, results: [] };

    const view = toGroupTableView(withMissingResults);

    expect(view.rows[0].cells).toEqual(["X", ""]);
    expect(view.rows[1].cells).toEqual(["", "X"]);
  });
});
