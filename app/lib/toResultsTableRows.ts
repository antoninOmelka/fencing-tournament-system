import { Participant } from "../types/participant";
import { ResultsTableRow } from "../types/resultsTableRow";

export function toResultsTableRows(
  participants: Participant[],
): ResultsTableRow[] {
  return participants.map((participant, index) => ({
    id: participant.id,
    place: index + 1,
    name: participant.name,
    club: participant.club,
    wins: participant.wins || 0,
    winsRate: (participant.winsRate || 0).toFixed(2),
    scored: String(participant.pointsScored || 0),
    received: String(participant.pointsReceived || 0),
    index: String(participant.index || 0),
  }));
}
