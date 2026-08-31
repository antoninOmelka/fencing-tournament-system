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

  // work on copies — the caller's participant objects must stay untouched
  const sortedParticipants = participants
    .map((participant) => ({ ...participant }))
    .sort((a, b) => Number(a.ranking) - Number(b.ranking));

  // Draw of lots: the single moment of randomness in the tournament.
  // The numbers break full stat ties in the results and stay fixed until
  // the groups are generated again.
  const lots = Array.from({ length: participants.length }, (_, i) => i + 1);
  for (let i = lots.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [lots[i], lots[j]] = [lots[j], lots[i]];
  }
  sortedParticipants.forEach((participant, index) => {
    participant.drawNumber = lots[index];
  });

  const numGroups = computeGroupCount(participants.length);
  const baseSize = Math.floor(participants.length / numGroups);
  const extraParticipants = participants.length % numGroups;
  const capacityOf = (index: number): number =>
    baseSize + (index < extraParticipants ? 1 : 0);

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

  // Snake distribution: 1,2,3 → groups 1,2,3, then 4,5,6 → groups 3,2,1.
  // At the edges the direction flips and the edge group receives two
  // consecutive participants.
  let groupIndex = 0;
  let direction = 1;
  const advance = () => {
    if (groupIndex + direction < 0 || groupIndex + direction >= numGroups) {
      direction = -direction;
    } else {
      groupIndex += direction;
    }
  };

  for (const [, clubParticipants] of clubMap.entries()) {
    for (const participant of clubParticipants) {
      // find the next group with free capacity — the total capacity equals
      // the number of participants, so one always exists
      while (groups[groupIndex].participants.length >= capacityOf(groupIndex)) {
        advance();
      }

      groups[groupIndex].participants.push(participant);
      advance();
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
