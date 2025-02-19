import { Participant } from "../types/participant";

export async function getParticipants() {
    try {
      const response = await fetch("api/participants");
      const data = await response.json();
      return data.participants; 
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  
  export async function postParticipants(participants: Participant[]) {
    try {
      await fetch('/api/participants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ participants: participants }),
      });
    } catch (error) {
      console.error(error);
    }
  }