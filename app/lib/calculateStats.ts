import { Group } from "../types/group";
import { Participant } from "../types/participant";

type Stat = {
  wins: number;
  matches: number;
  pointsScored: number;
  pointsReceived: number;
  index: number;
};

function scoreOf(match: {
  score: number | undefined;
  isWinner: boolean;
}): number {
  if (match.score !== undefined) {
    return match.score;
  }
  return match.isWinner ? 5 : 0; // "V" = 5; a missing loser score counts as 0
}

export function calculateStats({
  participants,
  matches,
}: Group): Participant[] {
  const stats = new Map<number, Stat>(
    participants.map((participant) => [
      participant.id,
      { wins: 0, matches: 0, pointsScored: 0, pointsReceived: 0, index: 0 },
    ]),
  );

  (matches || []).forEach((match) => {
    if (match.winnerId === undefined) {
      return; // bout not fenced yet
    }
    const first = stats.get(match.firstId);
    const second = stats.get(match.secondId);
    if (!first || !second) {
      return;
    }

    const firstScore = scoreOf({
      score: match.firstScore,
      isWinner: match.winnerId === match.firstId,
    });
    const secondScore = scoreOf({
      score: match.secondScore,
      isWinner: match.winnerId === match.secondId,
    });

    first.matches++;
    second.matches++;
    if (match.winnerId === match.firstId) {
      first.wins++;
    } else {
      second.wins++;
    }

    first.pointsScored += firstScore;
    first.pointsReceived += secondScore;
    second.pointsScored += secondScore;
    second.pointsReceived += firstScore;
  });

  stats.forEach((stat) => {
    stat.index = stat.pointsScored - stat.pointsReceived;
  });

  return participants.map((participant) => {
    const stat = stats.get(participant.id);
    if (!stat) {
      return participant;
    }
    return {
      ...participant,
      wins: stat.wins,
      winsRate: stat.matches ? stat.wins / stat.matches : 0,
      pointsScored: stat.pointsScored,
      pointsReceived: stat.pointsReceived,
      index: stat.index,
    };
  });
}
