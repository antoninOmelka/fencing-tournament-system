import { Participant } from "../types/participant";

// Groups and the playoff store copies of participants, so identity fields go
// stale when a participant is edited. Refresh them from the master list while
// keeping tournament-specific fields (drawNumber, groupRanking, stats).
// A participant deleted from the master list keeps its tournament copy —
// removing it would corrupt the results matrix of already fenced matches.
export function syncParticipants(
  copies: Participant[],
  master: Participant[],
): Participant[] {
  return copies.map((copy) => {
    const current = master.find((participant) => participant.id === copy.id);
    if (!current) {
      return copy;
    }
    return {
      ...copy,
      name: current.name,
      year: current.year,
      club: current.club,
      ranking: current.ranking,
    };
  });
}
