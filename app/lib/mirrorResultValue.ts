import { resultSchema } from "./resultSchema";

// Returns what the mirror cell should contain after its counterpart changed
// to `value`. A complete result pre-fills the opposite letter ("V5" -> "D")
// or flips a contradicting letter while keeping the score ("V3" -> "D3").
// Clearing a result removes a pre-filled lone letter again.
export function mirrorResultValue(
  value: string,
  currentMirror: string,
): string {
  if (value === "" && (currentMirror === "V" || currentMirror === "D")) {
    return "";
  }

  if (!resultSchema.safeParse(value).success) {
    return currentMirror; // only a complete result drives the mirror
  }

  const opposite = value.startsWith("V") ? "D" : "V";
  if (currentMirror === "") {
    return opposite;
  }
  if (currentMirror.startsWith(opposite)) {
    return currentMirror;
  }
  return opposite + currentMirror.slice(1);
}
