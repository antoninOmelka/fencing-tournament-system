import { describe, expect, it } from "vitest";
import { mirrorResultValue } from "./mirrorResultValue";

describe("mirrorResultValue", () => {
  it("pre-fills the opposite letter into an empty mirror", () => {
    expect(mirrorResultValue("V5", "")).toBe("D");
    expect(mirrorResultValue("D3", "")).toBe("V");
  });

  it("keeps a mirror that already has the opposite letter", () => {
    expect(mirrorResultValue("V5", "D")).toBe("D");
    expect(mirrorResultValue("V5", "D3")).toBe("D3");
    expect(mirrorResultValue("D2", "V5")).toBe("V5");
  });

  it("flips a contradicting letter while keeping the score", () => {
    expect(mirrorResultValue("D4", "D2")).toBe("V2");
    expect(mirrorResultValue("V5", "V3")).toBe("D3");
    expect(mirrorResultValue("V5", "V")).toBe("D");
  });

  it("ignores incomplete or invalid values", () => {
    expect(mirrorResultValue("V", "")).toBe("");
    expect(mirrorResultValue("X3", "D5")).toBe("D5");
    expect(mirrorResultValue("", "D5")).toBe("D5");
  });

  it("clears a pre-filled lone letter when the result is cleared", () => {
    expect(mirrorResultValue("", "D")).toBe("");
    expect(mirrorResultValue("", "V")).toBe("");
  });
});
