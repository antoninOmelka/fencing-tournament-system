import { Group } from "../types/group";
import { Participant } from "../types/participant";

export function calculateStats({
  participants,
  results,
}: Group): Participant[] {
  const stats = participants.map((participant) => ({
    id: participant.id,
    wins: 0,
    matches: 0,
    pointsScored: 0,
    pointsReceived: 0,
    index: 0,
  }));

  results.forEach((row, rowIndex) => {
    row.forEach((score, colIndex) => {
      if (rowIndex >= colIndex || !score) return; // Upper triangle only

      const current = stats[rowIndex];
      const opponent = stats[colIndex];

      const isVictory = score.startsWith("V");
      const pointsScored = parseInt(score.slice(1), 10);
      const opponentScore = results[colIndex][rowIndex]?.slice(1);
      const pointsReceived = parseInt(opponentScore || "0", 10);

      current.matches++;
      opponent.matches++;

      if (isVictory) {
        current.wins++;
      } else {
        opponent.wins++;
      }

      current.pointsScored += pointsScored;
      current.pointsReceived += pointsReceived;

      opponent.pointsScored += pointsReceived;
      opponent.pointsReceived += pointsScored;
    });
  });

  stats.forEach((stat) => {
    stat.index = stat.pointsScored - stat.pointsReceived;
  });

  return participants.map((participant) => {
    const stat = stats.find((s) => s.id === participant.id);
    return {
      ...participant,
      wins: stat?.wins ?? 0,
      winsRate: stat?.matches ? stat.wins / stat.matches : 0,
      pointsScored: stat?.pointsScored ?? 0,
      pointsReceived: stat?.pointsReceived ?? 0,
      index: stat?.index ?? 0,
    };
  });
}
