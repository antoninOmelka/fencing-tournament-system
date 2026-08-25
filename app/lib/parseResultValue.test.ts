import { describe, expect, it } from "vitest";
import { parseResultValue } from "./parseResultValue";

describe("parseResultValue", () => {
  it("parses a plain V as a full-score victory", () => {
    expect(parseResultValue("V")).toEqual({ isVictory: true, score: 5 });
  });

  it("parses a victory short of the full score", () => {
    expect(parseResultValue("V4")).toEqual({ isVictory: true, score: 4 });
    expect(parseResultValue("V0")).toEqual({ isVictory: true, score: 0 });
  });

  it("normalizes an explicit V5 to score 5", () => {
    expect(parseResultValue("V5")).toEqual({ isVictory: true, score: 5 });
  });

  it("parses a defeat with the loser's touches", () => {
    expect(parseResultValue("D3")).toEqual({ isVictory: false, score: 3 });
    expect(parseResultValue("D0")).toEqual({ isVictory: false, score: 0 });
  });

  it("parses a lone D as an incomplete pre-fill", () => {
    expect(parseResultValue("D")).toEqual({ isVictory: false, score: null });
  });

  it.each(["", "v", "d3", "V6", "X3", "5V", "V5 "])(
    "returns null for %j",
    (value) => {
      expect(parseResultValue(value)).toBeNull();
    },
  );
});
