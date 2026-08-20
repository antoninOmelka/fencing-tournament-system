import { Group } from "../types/group";
import { Participant } from "../types/participant";
import { generateMatches } from "./generateMatches";

const MAX_GROUP_SIZE = 7;

// The smallest number of groups such that no group exceeds MAX_GROUP_SIZE;
// the base/extra distribution below keeps sizes within 1 of each other.
function computeGroupCount(participantCount: number): number {
  return Math.ceil(participantCount / MAX_GROUP_SIZE);
}

export function distributeIntoGroups(participants: Participant[]): Group[] {
  if (participants.length === 0) {
    return [];
  }

  const sortedParticipants = [...participants].sort(
    (a, b) => Number(a.ranking) - Number(b.ranking),
  );

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
    group.results = Array.from({ length: groupSize }, () =>
      Array(groupSize).fill(""),
    );
    group.participants.sort((a, b) => Number(a.ranking) - Number(b.ranking));
    group.participants.forEach((participant, index) => {
      participant.groupRanking = index + 1;
    });
    group.matches = generateMatches(group.participants);
  });

  return groups;
}
