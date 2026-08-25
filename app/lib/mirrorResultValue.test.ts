import { describe, expect, it } from "vitest";
import { mirrorResultValue } from "./mirrorResultValue";

describe("mirrorResultValue", () => {
  it("pre-fills the opposite letter into an empty mirror", () => {
    expect(mirrorResultValue("V", "")).toBe("D");
    expect(mirrorResultValue("V4", "")).toBe("D");
    expect(mirrorResultValue("D3", "")).toBe("V");
  });

  it("keeps a mirror that already has the opposite letter", () => {
    expect(mirrorResultValue("V", "D")).toBe("D");
    expect(mirrorResultValue("V", "D3")).toBe("D3");
    expect(mirrorResultValue("D2", "V4")).toBe("V4");
  });

  it("flips a contradicting letter while keeping the score", () => {
    expect(mirrorResultValue("D4", "D2")).toBe("V2");
    expect(mirrorResultValue("V", "V3")).toBe("D3");
    expect(mirrorResultValue("V4", "V")).toBe("D");
  });

  it("ignores incomplete or invalid values", () => {
    expect(mirrorResultValue("D", "V")).toBe("V");
    expect(mirrorResultValue("X3", "D4")).toBe("D4");
  });

  it("clears the whole bout when the result is cleared", () => {
    expect(mirrorResultValue("", "D")).toBe("");
    expect(mirrorResultValue("", "V")).toBe("");
    expect(mirrorResultValue("", "D3")).toBe("");
    expect(mirrorResultValue("", "V4")).toBe("");
  });
});
