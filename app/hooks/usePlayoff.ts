"use client";

import { useEffect, useState } from "react";
import { Participant } from "../types/participant";
import { Playoff } from "../types/playoff";
import { deletePlayoff, getPlayoff, postPlayoff } from "../services/playoff";
import { generatePlayoff } from "../lib/generatePlayoff";
import { setPlayoffWinner } from "../lib/setPlayoffWinner";
import { useSnackbar } from "./useSnackbar";

export function usePlayoff() {
  const [playoff, setPlayoff] = useState<Playoff | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    async function fetchPlayoff() {
      try {
        const data = await getPlayoff();
        setPlayoff(data);
      } catch (error) {
        console.error(error);
        showSnackbar("Failed to load playoff", "error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlayoff();
  }, [showSnackbar]);

  async function createPlayoff(
    seededParticipants: Participant[],
  ): Promise<void> {
    try {
      setIsSaving(true);
      const newPlayoff = generatePlayoff(seededParticipants);
      await postPlayoff(newPlayoff);
      setPlayoff(newPlayoff);
      showSnackbar("Playoff generated", "success");
    } catch (error) {
      console.error("Failed to create playoff:", error);
      showSnackbar("Failed to generate playoff", "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function markWinner(matchId: number, winnerId: number): Promise<void> {
    if (!playoff) return;

    const updated = setPlayoffWinner(playoff, matchId, winnerId);
    if (updated === playoff) return;

    try {
      setIsSaving(true);
      await postPlayoff(updated);
      setPlayoff(updated);
      showSnackbar("Match result saved", "success");
    } catch (error) {
      console.error("Failed to save playoff winner:", error);
      showSnackbar("Failed to save match result", "error");
    } finally {
      setIsSaving(false);
    }
  }

  async function removePlayoff(): Promise<void> {
    try {
      setIsSaving(true);
      await deletePlayoff();
      setPlayoff(null);
      showSnackbar("Playoff deleted", "success");
    } catch (error) {
      console.error("Failed to delete playoff:", error);
      showSnackbar("Failed to delete playoff", "error");
    } finally {
      setIsSaving(false);
    }
  }

  return {
    playoff,
    isLoading,
    isSaving,
    createPlayoff,
    markWinner,
    removePlayoff,
  };
}
