'use client'

import { useEffect, useState } from "react";
import { getGroups, postGroups } from "../services/groups";
import { Group } from "../types/group";
import MatchesTable from "../components/MatchesTable/page";
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


function GroupMatchesOverview() {
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        async function fetchGroups() {
            try {
                const data = await getGroups();
                setGroups(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchGroups();
    }, []);

    async function distributeIntoGroups(): Promise<void> {
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
    }

    return (
        <>
            <StyledButton variant="contained" onClick={() => distributeIntoGroups()}>Generate Groups</StyledButton>
            <div className="matches-overview">
                {groups.map((group) => (
                    <MatchesTable key={group.participants.map(p => p.id).join('-')} id={group.id} participants={group.participants} results={group.results}></MatchesTable>
                ))}
            </div>
        </>
    );
}

export default GroupMatchesOverview;