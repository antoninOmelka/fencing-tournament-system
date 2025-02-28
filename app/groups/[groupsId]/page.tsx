"use client";

import "@/app/styles/global/global.css";

import { getGroup, updateGroup } from "@/app/services/groups";
import { Group } from "@/app/types/group";
import React, { useEffect, useState } from "react";
import GroupTable from "@/app/components/GroupTable/page";
import { StyledButton } from "@/app/styles/shared/buttons";
import { useParams } from "next/navigation";

function GroupTableView() {
    const [group, setGroup] = useState<Group | null>(null);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const params = useParams();
    const groupId = params?.groupsId;

    useEffect(() => {
        if (!groupId) {
            setLoading(false); // když není groupId, ukonči loading
            return;
        }

        async function fetchGroup() {
            try {
                const data = await getGroup(Number(groupId));
                setGroup(data ?? null);
              } catch (error) {
                console.error("Failed to fetch group:", error);
                throw new Error("Failed to load group data.");
              } finally {
                setLoading(false);
              }
            };
        
            fetchGroup();
          }, [groupId]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (!group) {
        return <p>Group not found</p>;
    }


    async function handleSaveButton() {
        if (group) {
            try {
                setIsSaving(true);
                await updateGroup(group.id, group);
            } catch (error) {
                console.error(error);
                throw new Error("Failed to save group.");
            } finally {
                setIsSaving(false);
            }
        }
    }

    function handleGroupChange(updatedGroup: Group) {
        setGroup(updatedGroup);
    }

    return (
        <div>
            <div className="button-container">
                <StyledButton variant="contained" onClick={() => handleSaveButton()} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save"}
                </StyledButton>
            </div>
            <div className="matches-overview">
                <GroupTable group={group} onGroupChange={handleGroupChange} />
            </div>
        </div>
    );
}

export default GroupTableView;
