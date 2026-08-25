export type ParsedResult = {
  isVictory: boolean;
  score: number | null; // null = lone letter, score not entered yet
};

// Parses one FIE result cell. "V" is a victory with the full 5 touches;
// a number is added only when the bout ended short of the full score
// ("V4"), so "V" parses to score 5. "D3" is a defeat with 3 touches;
// a lone "D" is an incomplete pre-fill with no score yet.
export function parseResultValue(value: string): ParsedResult | null {
  const matched = value.match(/^([VD])([0-5])?$/);
  if (!matched) {
    return null;
  }

  const isVictory = matched[1] === "V";
  if (matched[2] === undefined) {
    return { isVictory, score: isVictory ? 5 : null };
  }
  return { isVictory, score: Number(matched[2]) };
}
