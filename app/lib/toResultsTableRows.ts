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
    index: String(participant.index || 0),
  }));
}
