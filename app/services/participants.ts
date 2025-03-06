import { Participant } from "../types/participant";

export async function getParticipants() {
  try {
    const response = await fetch("api/participants");
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to load participants");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return [];
  }
}

export async function updateParticipant(participant: Participant) {
  try {
    const response = await fetch(`/api/participants/${participant.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(participant),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to update participant");
    }
  } catch (error) {
    console.error("Error updating participant:", error);
    throw error;
  }
}

export async function deleteParticipant(participantId: string) {
  try {
    const response = await fetch(`/api/participants/${participantId}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to delete participant");
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}