import { Match } from "../types/match";
import { Participant } from "../types/participant";
import { parseResultValue, ParsedResult } from "./parseResultValue";

function sideScore(
  parsed: ParsedResult | null,
  isWinnerSide: boolean,
): number | undefined {
  if (parsed && parsed.score !== null) {
    return parsed.score;
  }
  if (isWinnerSide) {
    return 5; // a missing or lone-"V" winner cell means a full-score victory
  }
  return undefined; // the loser's touches were not entered yet
}

// Rebuilds the match records from the results matrix. The matrix is only an
// edit buffer / display view — the records produced here are the source of
// truth. When the two cells of a bout contradict each other (legacy data),
// the first participant's cell decides the winner.
export function matchesFromResults(
  participants: Participant[],
  matches: Match[],
  results: string[][],
): Match[] {
  const indexById = new Map(
    participants.map((participant, index) => [participant.id, index]),
  );

  return matches.map((match) => {
    const bare: Match = { firstId: match.firstId, secondId: match.secondId };

    const first = indexById.get(match.firstId);
    const second = indexById.get(match.secondId);
    if (first === undefined || second === undefined) {
      return bare;
    }

    const firstCell = (results[first] && results[first][second]) || "";
    const secondCell = (results[second] && results[second][first]) || "";
    const firstResult = parseResultValue(firstCell);
    const secondResult = parseResultValue(secondCell);

    let winnerId;
    if (firstResult && firstResult.isVictory) {
      winnerId = match.firstId;
    } else if (secondResult && secondResult.isVictory) {
      winnerId = match.secondId;
    } else if (firstResult) {
      winnerId = match.secondId;
    } else if (secondResult) {
      winnerId = match.firstId;
    } else {
      return bare;
    }

    const record: Match = { ...bare, winnerId };
    const firstScore = sideScore(firstResult, winnerId === match.firstId);
    const secondScore = sideScore(secondResult, winnerId === match.secondId);
    if (firstScore !== undefined) {
      record.firstScore = firstScore;
    }
    if (secondScore !== undefined) {
      record.secondScore = secondScore;
    }
    return record;
  });
}
