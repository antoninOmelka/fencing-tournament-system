import { Match } from "../types/match";
import { Participant } from "../types/participant";

function formatCell(score: number | undefined, isWinner: boolean): string {
  if (isWinner) {
    // FIE: a full-score victory is written as a plain "V"
    return score === undefined || score === 5 ? "V" : `V${score}`;
  }
  return score === undefined ? "D" : `D${score}`;
}

// Derives the displayable results matrix from the match records.
export function resultsFromMatches(
  participants: Participant[],
  matches: Match[],
): string[][] {
  const size = participants.length;
  const results = Array.from({ length: size }, () =>
    new Array<string>(size).fill(""),
  );
  const indexById = new Map(
    participants.map((participant, index) => [participant.id, index]),
  );

  for (const match of matches) {
    if (match.winnerId === undefined) {
      continue;
    }
    const first = indexById.get(match.firstId);
    const second = indexById.get(match.secondId);
    if (first === undefined || second === undefined) {
      continue;
    }
    results[first][second] = formatCell(
      match.firstScore,
      match.winnerId === match.firstId,
    );
    results[second][first] = formatCell(
      match.secondScore,
      match.winnerId === match.secondId,
    );
  }

  return results;
}
