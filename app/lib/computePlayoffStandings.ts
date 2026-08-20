import { Playoff } from "../types/playoff";
import { PlayoffStandingRow } from "../types/playoffView";

// Final standings without a third-place bout: the final winner is 1st, the
// loser 2nd, both semifinal losers share 3rd, and losers of earlier rounds
// share 5th, 9th, ... Ties are ordered by seed. Returns an empty array until
// the final is decided (at that point every match necessarily is).
export function computePlayoffStandings(
  playoff: Playoff,
): PlayoffStandingRow[] {
  const totalRounds = playoff.matches.reduce(
    (max, match) => Math.max(max, match.round),
    0,
  );
  const final = playoff.matches.find((match) => match.round === totalRounds);
  if (!final || final.winnerId === null) {
    return [];
  }

  const placeById = new Map<number, number>();
  placeById.set(final.winnerId, 1);
  for (const match of playoff.matches) {
    if (match.winnerId === null) {
      continue;
    }
    const loserId =
      match.firstId === match.winnerId ? match.secondId : match.firstId;
    if (loserId === null) {
      continue; // a bye eliminates nobody
    }
    placeById.set(loserId, 2 ** (totalRounds - match.round) + 1);
  }

  // participants are in seed order, so the stable sort keeps seeding
  // as the order within a shared place
  const rows: PlayoffStandingRow[] = [];
  for (const participant of playoff.participants) {
    const place = placeById.get(participant.id);
    if (place !== undefined) {
      rows.push({
        id: participant.id,
        place,
        name: participant.name,
        club: participant.club,
      });
    }
  }
  return rows.sort((a, b) => a.place - b.place);
}
