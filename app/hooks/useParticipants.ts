"use client";

import { useCallback, useEffect, useState } from "react";
import { Participant } from "../types/participant";
import { ParticipantInputs } from "../types/participantInputs";
import {
  getParticipants,
  updateParticipant,
  deleteParticipant,
} from "../services/participants";
import { useSnackbar } from "./useSnackbar";

export function useParticipants() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    async function fetchParticipants() {
      try {
        const data = await getParticipants();
        setParticipants(data);
      } catch (error) {
        console.error(error);
        showSnackbar("Failed to load participants", "error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchParticipants();
  }, [showSnackbar]);

  const addParticipant = useCallback(
    async (data: ParticipantInputs) => {
      try {
        const newParticipant: Participant = { id: Date.now(), ...data };
        await updateParticipant(newParticipant);
        setParticipants((prev) => [...prev, newParticipant]);
        showSnackbar("Participant added", "success");
      } catch (error) {
        console.error("Failed to add participant:", error);
        showSnackbar("Failed to add participant", "error");
      }
    },
    [showSnackbar],
  );

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
        showSnackbar("Participant updated", "success");
      } catch (error) {
        console.error("Failed to update participant:", error);
        showSnackbar("Failed to update participant", "error");
      }
    },
    [showSnackbar],
  );

  const removeParticipant = useCallback(
    async (id: number) => {
      try {
        await deleteParticipant(String(id));
        setParticipants((prev) =>
          prev.filter((participant) => participant.id !== id),
        );
        showSnackbar("Participant deleted", "success");
      } catch (error) {
        console.error("Failed to delete participant:", error);
        showSnackbar("Failed to delete participant", "error");
      }
    },
    [showSnackbar],
  );

  return {
    participants,
    isLoading,
    addParticipant,
    editParticipant,
    removeParticipant,
  };
}
