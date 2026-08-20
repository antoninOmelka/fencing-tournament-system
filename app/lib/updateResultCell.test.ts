import { describe, expect, it } from "vitest";
import { updateResultCell } from "./updateResultCell";

describe("updateResultCell", () => {
  it("updates only the target cell", () => {
    const results = [
      ["", "V5"],
      ["D3", ""],
    ];

    const updated = updateResultCell(results, 1, 0, "D4");

    expect(updated).toEqual([
      ["", "V5"],
      ["D4", ""],
    ]);
  });

  it("does not mutate the original matrix", () => {
    const results = [
      ["", "V5"],
      ["D3", ""],
    ];

    updateResultCell(results, 0, 1, "V4");

    expect(results).toEqual([
      ["", "V5"],
      ["D3", ""],
    ]);
  });

  it("returns new row instances only for the changed row", () => {
    const results = [
      ["", "V5"],
      ["D3", ""],
    ];

    const updated = updateResultCell(results, 0, 1, "V4");

    expect(updated).not.toBe(results);
    expect(updated[0]).not.toBe(results[0]);
    expect(updated[1]).toBe(results[1]);
  });
});
