import { Playoff } from "../types/playoff";
import { PlayoffStandingRow } from "../types/playoffView";

// Final standings per FIE ranking without a third-place bout: the final
// winner is 1st, the loser 2nd, both semifinal losers share 3rd, and losers
// of earlier rounds take distinct consecutive places (5, 6, 7, 8, ...)
// ordered by their seed from the group results. Returns an empty array until
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

  // participants are in seed order, so walking them in order ranks fencers
  // knocked out in the same round by their group results; only 3rd place
  // stays shared, deeper rounds get consecutive places (5, 6, 7, 8, ...)
  const rows: PlayoffStandingRow[] = [];
  const nextPlaceByBase = new Map<number, number>();
  for (const participant of playoff.participants) {
    const basePlace = placeById.get(participant.id);
    if (basePlace === undefined) {
      continue;
    }
    let place = basePlace;
    if (basePlace >= 5) {
      place = nextPlaceByBase.get(basePlace) || basePlace;
      nextPlaceByBase.set(basePlace, place + 1);
    }
    rows.push({
      id: participant.id,
      place,
      name: participant.name,
      year: participant.year,
      club: participant.club,
    });
  }
  return rows.sort((a, b) => a.place - b.place);
}
