import { Group } from "../types/group";
import { Participant } from "../types/participant";
import { generateMatches } from "./generateMatches";

const TARGET_GROUP_SIZE = 6;

function computeGroupCount(participantCount: number): number {
    let count = Math.max(1, Math.round(participantCount / TARGET_GROUP_SIZE));
    // Size-balancing adjustments only make sense with 2+ groups; with count = 1
    // participantCount % count is always 0 and the second branch would drop count to 0.
    if (count > 1 && participantCount % count === 1) count++;
    if (count > 1 && participantCount % count === count - 1) count--;
    return count;
}

export function distributeIntoGroups(participants: Participant[]): Group[] {
    if (participants.length === 0) {
        return [];
    }

    const sortedParticipants = [...participants].sort((a, b) => Number(a.ranking) - Number(b.ranking));

    const numGroups = computeGroupCount(participants.length);
    const baseSize = Math.floor(participants.length / numGroups);
    const extraParticipants = participants.length % numGroups;

    const groups: Group[] = Array.from({ length: numGroups }, (_, index) => ({
        id: index + 1,
        participants: [],
        results: [],
        matches: [],
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
                groupIndex = (groupIndex + 1) % numGroups;
            }

            groups[groupIndex].participants.push(participant);
            groupIndex = (groupIndex + 1) % numGroups;
        }
    }

    groups.forEach((group) => {
        const groupSize = group.participants.length;
        group.results = Array.from({ length: groupSize }, () => Array(groupSize).fill(""));
        group.participants.sort((a, b) => Number(a.ranking) - Number(b.ranking));
        group.participants.forEach((participant, index) => {
            participant.groupRanking = index + 1;
        });
        group.matches = generateMatches(group.participants);
    });

    return groups;
}
