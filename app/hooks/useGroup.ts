"use client";

import { useEffect, useState } from "react";
import { Group } from "../types/group";
import { getGroup, updateGroup } from "../services/groups";
import { useSnackbar } from "./useSnackbar";

export function useGroup(groupId: number | null) {
  const [group, setGroup] = useState<Group | null>(null);
  // the group as it exists on the server — the editor always produces a new
  // object, so a simple reference comparison detects unsaved changes
  const [savedGroup, setSavedGroup] = useState<Group | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (groupId === null) {
      return;
    }
    const id = groupId;

    async function fetchGroup() {
      try {
        const data = await getGroup(id);
        setGroup(data ? data : null);
        setSavedGroup(data ? data : null);
      } catch (error) {
        console.error("Failed to fetch group:", error);
        showSnackbar("Failed to load group", "error");
      } finally {
        setIsLoading(false);
      }
    }

    fetchGroup();
  }, [groupId, showSnackbar]);

  async function saveGroup(): Promise<void> {
    if (!group) {
      return;
    }

    try {
      setIsSaving(true);
      await updateGroup(group.id, group);
      setSavedGroup(group);
      showSnackbar("Group results saved", "success");
    } catch (error) {
      console.error("Failed to save group:", error);
      showSnackbar("Failed to save group results", "error");
    } finally {
      setIsSaving(false);
    }
  }

  const isDirty = group !== savedGroup;

  return { group, setGroup, isLoading, isSaving, isDirty, saveGroup };
}
