"use client";

import { useEffect, useState } from "react";
import { Group } from "../types/group";
import { getGroups, postGroups } from "../services/groups";
import { getParticipants } from "../services/participants";
import { deleteResults } from "../services/results";
import { deletePlayoff } from "../services/playoff";
import { distributeIntoGroups } from "../lib/distributeIntoGroups";

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const data = await getGroups();
        setGroups(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchGroups();
  }, []);

  async function generateGroups(): Promise<void> {
    try {
      setIsSaving(true);
      const participants = await getParticipants();
      if (participants.length === 0) return;

      const newGroups = distributeIntoGroups(participants);
      await Promise.all([
        postGroups(newGroups),
        deleteResults(),
        deletePlayoff(),
      ]);
      setGroups(newGroups);
    } catch (error) {
      console.error("Failed to generate groups:", error);
    } finally {
      setIsSaving(false);
    }
  }

  return { groups, isLoading, isSaving, generateGroups };
}
