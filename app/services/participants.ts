import { Participant } from "../types/participant";

export async function getParticipants() {
    try {
      const response = await fetch("api/participants");
      const data = await response.json();
      return data; 
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  
  export async function postParticipants(participants: Participant[]) {
    try {
      await fetch("/api/participants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(participants),
      });
    } catch (error) {
      console.error(error);
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