"use client"

import "@/app/styles/global/global.css";

import { useEffect, useState } from "react";
import { getGroups, postGroups } from "../services/groups";
import { Group } from "../types/group";
import GroupTable from "../components/GroupTable/GroupTable";
import Loading from "../components/Loading/Loading";
import { StyledButton } from "../styles/shared/buttons";
import { Participant } from "../types/participant";
import { getParticipants } from "../services/participants";


async function fetchParticipants(): Promise<Participant[]> {
    try {
        const data = await getParticipants();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

function GroupTablesView() {
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
        };

        fetchGroups();
    }, []);

    async function distributeIntoGroups(): Promise<void> {
        setIsSaving(true);
        const participants = await fetchParticipants();
        if (participants.length === 0) return;

        const sortedParticipants = [...participants].sort((a, b) => Number(a.ranking) - Number(b.ranking));

        let bestNumGroups = Math.round(participants.length / 6);
        if (participants.length % bestNumGroups === 1) bestNumGroups++;
        if (participants.length % bestNumGroups === bestNumGroups - 1) bestNumGroups--;

        const baseSize = Math.floor(participants.length / bestNumGroups);
        const extraParticipants = participants.length % bestNumGroups;

        const groups: Group[] = Array.from({ length: bestNumGroups }, (_, index) => ({
            id: index + 1,
            participants: [],
            results: [],
        }));

        const clubMap = new Map<string, Participant[]>();
        for (const participant of sortedParticipants) {
            if (!clubMap.has(participant.club)) clubMap.set(participant.club, []);
            clubMap.get(participant.club)!.push(participant);
        }

        let groupIndex = 0;
        for (const [, clubParticipants] of clubMap.entries()) {
            for (const participant of clubParticipants) {
                const groupSize = baseSize + (groupIndex < extraParticipants ? 1 : 0);

                if (groups[groupIndex].participants.length >= groupSize) {
                    groupIndex = (groupIndex + 1) % bestNumGroups;
                }

                groups[groupIndex].participants.push(participant);
                groupIndex = (groupIndex + 1) % bestNumGroups;
            }
        }

        groups.forEach((group => {
            const groupSize = group.participants.length;
            group.results = Array.from({ length: groupSize }, () => Array(groupSize));
            group.participants.sort((a, b) => a.ranking - b.ranking);
            group.participants.forEach((participant, index) => {
                participant.groupRanking = index + 1;
            });
        }));

        await postGroups(groups);
        setGroups(groups);
        setIsSaving(false);
    }

    if (isLoading) {
        return <Loading />
    }

    return (
        <>
            <div className="secondary-actions-container">
                <StyledButton variant="contained" onClick={() => distributeIntoGroups()} disabled={isSaving}>
                    {isSaving ? "Generating..." : "Generate Groups"}
                </StyledButton>
            </div>
            <div className="groups-container">
                <div>
                    {groups.map((group) => (
                        <GroupTable key={group.participants.map(p => p.id).join("-")} id={group.id} participants={group.participants} results={group.results} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default GroupTablesView;