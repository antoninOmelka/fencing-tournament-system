"use client";

import { useEffect, useState } from "react";
import { Group } from "../types/group";
import { getGroups, postGroups } from "../services/groups";
import { getParticipants } from "../services/participants";
import { deletePlayoff } from "../services/playoff";
import { distributeIntoGroups } from "../lib/distributeIntoGroups";
import { useSnackbar } from "./useSnackbar";

export function useGroups() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    async function fetchGroups() {
      try {
        const data = await getGroups();
        setGroups(data);
      } catch (error) {
        console.error(error);
        showSnackbar("Failed to load groups", "error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchGroups();
  }, [showSnackbar]);

  async function generateGroups(): Promise<void> {
    try {
      setIsSaving(true);
      const participants = await getParticipants();
      if (participants.length === 0) return;

      const newGroups = distributeIntoGroups(participants);
      // Write the new groups first — deleting the playoff before the write
      // succeeds could destroy tournament data with nothing to replace it.
      await postGroups(newGroups);
      await deletePlayoff();
      setGroups(newGroups);
      showSnackbar("Groups generated", "success");
    } catch (error) {
      console.error("Failed to generate groups:", error);
      showSnackbar("Failed to generate groups", "error");
    } finally {
      setIsSaving(false);
    }
  }

  return { groups, isLoading, isSaving, generateGroups };
}
