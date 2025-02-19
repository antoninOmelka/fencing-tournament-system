"use client"

import { useEffect, useState } from "react";
import GroupTable from "../components/ParticipantTable/ParticipantTable";
import { getParticipants } from "../services/participants";
import { Participant } from "../types/participant";
import { Group } from "../types/group";

const DEFAULT_GROUPS_NUMBER = 5;

function distributeIntoGroups(participants: Participant[], numGroups: number): Group[] {
    // Sort participants by ranking
    const sortedParticipants = [...participants].sort((a, b) => Number(a.ranking) - Number(b.ranking));

    // Create initial groups
    const groups: Group[] = Array.from({ length: numGroups }, () => ({ participants: [] }));

    // Initial snake distribution
    sortedParticipants.forEach((participant, index) => {
        const groupIndex = Math.floor(index / numGroups) % 2 === 0
            ? index % numGroups
            : numGroups - 1 - (index % numGroups);
        groups[groupIndex].participants.push(participant);
    });

    // Optimize club distribution
    groups.forEach((group, i) => {
        const clubCounts = new Map<string, number>();
        group.participants.forEach(p => clubCounts.set(p.club, (clubCounts.get(p.club) || 0) + 1));

        for (const [club, count] of Array.from(clubCounts.entries())) {
            while (count > 1) {
                const participantToMove = group.participants.find(p => p.club === club);
                if (!participantToMove) break;

                let moved = false;
                for (let j = 0; j < groups.length; j++) {
                    if (i === j) continue;

                    const otherGroup = groups[j];
                    if (!otherGroup.participants.some(p => p.club === club)) {
                        otherGroup.participants.push(participantToMove);
                        group.participants = group.participants.filter(p => p !== participantToMove);
                        moved = true;
                        break;
                    }
                }

                if (!moved) break;
                clubCounts.set(club, clubCounts.get(club)! - 1);
            }
        }
        groups[i] = group;
    });

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
        setGroups(distributeIntoGroups(participants, DEFAULT_GROUPS_NUMBER));
    }, [participants]);

    return (
        <div className="groups-overview">
            {groups.map((group, index) => {
                return <GroupTable key={index} participants={group.participants}></GroupTable>
            })}
        </div>

    );
}

export default GroupsOverview;

