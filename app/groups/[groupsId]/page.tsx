"use client";

import "@/app/styles/global/global.css";

import { getGroup, updateGroup } from "@/app/services/groups";
import { Group } from "@/app/types/group";
import React, { useEffect, useState } from "react";
import EditableGroupTable from "@/app/components/EditableGroupTable/EditableGroupTable";
import Loading from "@/app/components/Loading/Loading";
import { StyledButton } from "@/app/styles/shared/buttons";
import { useParams } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";

function EditableGroupTableView() {
    const [group, setGroup] = useState<Group | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isValid, setIsValid] = useState<boolean>(true);
    const params = useParams();
    const groupId = params?.groupsId;

    useEffect(() => {
        if (!groupId) {
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
                setIsLoading(false);
            }
        }

        fetchGroup();
    }, [groupId]);

    if (isLoading) {
        return <Loading />;
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
        <>
            <div className="back-link-container">
                <Link className="back-link" href={"/groups"}>
                    <ArrowBackIcon fontSize="small" />
                    <span>Back</span>
                </Link>
            </div>
            <div className="group-table">
                <div className="table-button-container">
                    <StyledButton variant="contained" onClick={handleSaveButton} disabled={isSaving || !isValid}>
                        {isSaving ? "Saving..." : "Save"}
                    </StyledButton>
                </div>
                <EditableGroupTable group={group} onGroupChange={handleGroupChange} setIsValid={setIsValid} />
            </div>
        </>
    );
}

export default EditableGroupTableView;