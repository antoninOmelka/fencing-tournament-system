import { Participant } from "../types/participant";
import { ParticipantRowView } from "../types/participantRowView";

export function toParticipantRowViews(participants: Participant[]): ParticipantRowView[] {
    return [...participants]
        .sort((a, b) => a.name.localeCompare(b.name))
        .map((participant) => ({
            id: participant.id,
            name: participant.name,
            year: participant.year,
            club: participant.club,
            ranking: participant.ranking,
        }));
}
