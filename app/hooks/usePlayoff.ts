"use client";

import { useEffect, useState } from "react";
import { Participant } from "../types/participant";
import { Playoff } from "../types/playoff";
import { deletePlayoff, getPlayoff, postPlayoff } from "../services/playoff";
import { generatePlayoff } from "../lib/generatePlayoff";
import { setPlayoffWinner } from "../lib/setPlayoffWinner";

export function usePlayoff() {
  const [playoff, setPlayoff] = useState<Playoff | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    async function fetchPlayoff() {
      try {
        const data = await getPlayoff();
        setPlayoff(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchPlayoff();
  }, []);

  async function createPlayoff(
    seededParticipants: Participant[],
  ): Promise<void> {
    try {
      setIsSaving(true);
      const newPlayoff = generatePlayoff(seededParticipants);
      await postPlayoff(newPlayoff);
      setPlayoff(newPlayoff);
    } catch (error) {
      console.error("Failed to create playoff:", error);
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
    } catch (error) {
      console.error("Failed to save playoff winner:", error);
    } finally {
      setIsSaving(false);
    }
  }

  async function removePlayoff(): Promise<void> {
    try {
      setIsSaving(true);
      await deletePlayoff();
      setPlayoff(null);
    } catch (error) {
      console.error("Failed to delete playoff:", error);
    } finally {
      setIsSaving(false);
    }
  }

  return { playoff, isLoading, isSaving, createPlayoff, markWinner, removePlayoff };
}
