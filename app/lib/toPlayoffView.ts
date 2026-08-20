import { Playoff, PlayoffMatch } from "../types/playoff";
import {
  PlayoffRoundView,
  PlayoffSideView,
  PlayoffView,
} from "../types/playoffView";

function roundTitle(round: number, totalRounds: number): string {
  const fencersInRound = 2 ** (totalRounds - round + 1);
  if (fencersInRound === 2) {
    return "Final";
  }
  if (fencersInRound === 4) {
    return "Semifinal";
  }
  if (fencersInRound === 8) {
    return "Quarterfinal";
  }
  return `Table of ${fencersInRound}`;
}

export function toPlayoffView(playoff: Playoff): PlayoffView {
  const seedById = new Map<number, number>();
  const nameById = new Map<number, string>();
  playoff.participants.forEach((participant, index) => {
    seedById.set(participant.id, index + 1);
    nameById.set(participant.id, participant.name);
  });

  const totalRounds = playoff.matches.reduce(
    (max, match) => Math.max(max, match.round),
    0,
  );

  function toSide(
    match: PlayoffMatch,
    participantId: number | null,
  ): PlayoffSideView {
    if (participantId === null) {
      return {
        participantId: null,
        seed: null,
        label: match.round === 1 ? "BYE" : "TBD",
        isWinner: false,
      };
    }
    return {
      participantId,
      seed: seedById.get(participantId) || null,
      label: nameById.get(participantId) || "",
      isWinner: match.winnerId === participantId,
    };
  }

  const rounds: PlayoffRoundView[] = [];
  for (let round = 1; round <= totalRounds; round++) {
    rounds.push({
      title: roundTitle(round, totalRounds),
      matches: playoff.matches
        .filter((match) => match.round === round)
        .sort((a, b) => a.slot - b.slot)
        .map((match) => ({
          id: match.id,
          isDecided: match.winnerId !== null,
          isSelectable: match.firstId !== null && match.secondId !== null,
          first: toSide(match, match.firstId),
          second: toSide(match, match.secondId),
        })),
    });
  }

  return { rounds };
}
