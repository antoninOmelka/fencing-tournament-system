import { Participant } from "../types/participant";
import { apiRequest } from "./apiRequest";

const PARTICIPANTS_URL = "/api/participants";

export async function getParticipants(): Promise<Participant[]> {
  return apiRequest<Participant[]>(PARTICIPANTS_URL);
}

export async function updateParticipant(
  participant: Participant,
): Promise<void> {
  await apiRequest<void>(`${PARTICIPANTS_URL}/${participant.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(participant),
  });
}

export async function deleteParticipant(participantId: string): Promise<void> {
  await apiRequest<void>(`${PARTICIPANTS_URL}/${participantId}`, {
    method: "DELETE",
  });
}
