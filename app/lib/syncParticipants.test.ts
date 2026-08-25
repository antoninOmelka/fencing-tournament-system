import { describe, expect, it } from "vitest";
import { Participant } from "../types/participant";
import { syncParticipants } from "./syncParticipants";

function makeParticipant(
  id: number,
  overrides: Partial<Participant> = {},
): Participant {
  return {
    id,
    name: `P${id}`,
    year: 2000,
    club: `Club${id}`,
    ranking: id,
    ...overrides,
  };
}

describe("syncParticipants", () => {
  it("refreshes identity fields from the master list", () => {
    const copies = [makeParticipant(1)];
    const master = [
      makeParticipant(1, {
        name: "Renamed",
        club: "New Club",
        year: 1995,
        ranking: 42,
      }),
    ];

    const synced = syncParticipants(copies, master);

    expect(synced[0].name).toBe("Renamed");
    expect(synced[0].club).toBe("New Club");
    expect(synced[0].year).toBe(1995);
    expect(synced[0].ranking).toBe(42);
  });

  it("keeps tournament-specific fields from the copy", () => {
    const copies = [
      makeParticipant(1, {
        drawNumber: 3,
        groupRanking: 2,
        wins: 4,
        winsRate: 0.8,
        pointsScored: 20,
        pointsReceived: 10,
        index: 10,
      }),
    ];
    const master = [makeParticipant(1, { name: "Renamed" })];

    const synced = syncParticipants(copies, master);

    expect(synced[0]).toMatchObject({
      name: "Renamed",
      drawNumber: 3,
      groupRanking: 2,
      wins: 4,
      winsRate: 0.8,
      pointsScored: 20,
      pointsReceived: 10,
      index: 10,
    });
  });

  it("keeps the copy of a participant deleted from the master list", () => {
    const copies = [makeParticipant(1), makeParticipant(2)];
    const master = [makeParticipant(2, { name: "Still here" })];

    const synced = syncParticipants(copies, master);

    expect(synced[0]).toEqual(copies[0]);
    expect(synced[1].name).toBe("Still here");
  });

  it("preserves the order of copies", () => {
    const copies = [makeParticipant(3), makeParticipant(1), makeParticipant(2)];
    const master = [makeParticipant(1), makeParticipant(2), makeParticipant(3)];

    const synced = syncParticipants(copies, master);

    expect(synced.map((participant) => participant.id)).toEqual([3, 1, 2]);
  });

  it("returns an empty array for no copies", () => {
    expect(syncParticipants([], [makeParticipant(1)])).toEqual([]);
  });
});
