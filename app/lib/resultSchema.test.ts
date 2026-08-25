import { describe, expect, it } from "vitest";
import { resultSchema } from "./resultSchema";

describe("resultSchema", () => {
  it.each(["V", "V0", "V4", "V5", "D0", "D3", "D4"])("accepts %s", (value) => {
    expect(resultSchema.safeParse(value).success).toBe(true);
  });

  it.each([
    "",
    "v",
    "v5",
    "d3",
    "V6",
    "V10",
    "5V",
    "D",
    "D5",
    "VD",
    "X5",
    "V5 ",
  ])("rejects %j", (value) => {
    expect(resultSchema.safeParse(value).success).toBe(false);
  });
});
