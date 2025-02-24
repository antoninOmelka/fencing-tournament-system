"use client"

import './../styles/global/global.css';
import { useEffect, useState } from "react";
import GroupTable from "../components/ParticipantTable/ParticipantTable";
import { getParticipants } from "../services/participants";
import { Participant } from "../types/participant";
import { Group } from "../types/group";
import { StyledButton } from '../styles/shared/buttons';
import { postGroups } from '../services/groups';


function distributeIntoGroups(participants: Participant[]): Group[] {
    if (participants.length === 0) return [];

    const sortedParticipants = [...participants].sort((a, b) => Number(a.ranking) - Number(b.ranking));

    let bestNumGroups = Math.round(participants.length / 6);
    if (participants.length % bestNumGroups === 1) bestNumGroups++;
    if (participants.length % bestNumGroups === bestNumGroups - 1) bestNumGroups--;

    const baseSize = Math.floor(participants.length / bestNumGroups);
    const extraParticipants = participants.length % bestNumGroups;

    const groups: Group[] = Array.from({ length: bestNumGroups }, () => ({ participants: [] }));

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
    }));
    
    postGroups(groups);
    return groups;
}

function GroupsOverview() {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        async function fetchParticipants() {
            const data = await getParticipants();
            setParticipants(data);
        }

        fetchParticipants();
    }, []);

    useEffect(() => {
        setGroups(distributeIntoGroups(participants));
    }, [participants]);

    return (
        <>
            <StyledButton variant="contained" href="/group-matches-overview">
                Generate Group Matches
            </StyledButton>
            <div className="groups-overview">
                {groups.map((group, index) => {
                    return <GroupTable key={index} participants={group.participants}></GroupTable>
                })}
            </div>
        </>
    );
}

export default GroupsOverview;

