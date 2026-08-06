"use client";

import { useCallback, useEffect, useState } from "react";
import { Participant } from "../types/participant";
import { ParticipantInputs } from "../types/participantInputs";
import {
  getParticipants,
  updateParticipant,
  deleteParticipant,
} from "../services/participants";

export function useParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchParticipants() {
      try {
        const data = await getParticipants();
        setParticipants(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchParticipants();
  }, []);

  const addParticipant = useCallback(async (data: ParticipantInputs) => {
    try {
      const newParticipant: Participant = { id: Date.now(), ...data };
      await updateParticipant(newParticipant);
      setParticipants((prev) => [...prev, newParticipant]);
    } catch (error) {
      console.error("Failed to add participant:", error);
    }
  }, []);

  const editParticipant = useCallback(
    async (id: number, data: ParticipantInputs) => {
      try {
        const updatedParticipant = { ...data, id };
        await updateParticipant(updatedParticipant);
        setParticipants((prev) =>
          prev.map((participant) =>
            participant.id === id ? updatedParticipant : participant,
          ),
        );
      } catch (error) {
        console.error("Failed to update participant:", error);
      }
    },
    [],
  );

  const removeParticipant = useCallback(async (id: number) => {
    try {
      await deleteParticipant(String(id));
      setParticipants((prev) =>
        prev.filter((participant) => participant.id !== id),
      );
    } catch (error) {
      console.error("Failed to delete participant:", error);
    }
  }, []);

  return {
    participants,
    isLoading,
    addParticipant,
    editParticipant,
    removeParticipant,
  };
}
