import { parseResultValue } from "./parseResultValue";

// Returns what the mirror cell should contain after its counterpart changed
// to `value`. A complete result pre-fills the opposite letter ("V" -> "D",
// "D3" -> "V") or flips a contradicting letter while keeping the score
// ("V3" -> "D3"). Clearing a result clears the whole bout — the mirror too,
// so a half-deleted bout can never be saved.
export function mirrorResultValue(
  value: string,
  currentMirror: string,
): string {
  if (value === "") {
    return "";
  }

  const parsed = parseResultValue(value);
  if (!parsed || parsed.score === null) {
    return currentMirror; // only a complete result drives the mirror
  }

  const opposite = parsed.isVictory ? "D" : "V";
  if (currentMirror === "") {
    return opposite;
  }
  if (currentMirror.startsWith(opposite)) {
    return currentMirror;
  }
  return opposite + currentMirror.slice(1);
}
