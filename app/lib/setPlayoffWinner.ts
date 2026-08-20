import { Playoff } from "../types/playoff";
import { propagatePlayoffWinners } from "./generatePlayoff";

export function setPlayoffWinner(
  playoff: Playoff,
  matchId: number,
  winnerId: number,
): Playoff {
  const match = playoff.matches.find((item) => item.id === matchId);
  if (!match || match.firstId === null || match.secondId === null) {
    return playoff;
  }
  if (match.firstId !== winnerId && match.secondId !== winnerId) {
    return playoff;
  }

  const matches = playoff.matches.map((item) =>
    item.id === matchId ? { ...item, winnerId } : item,
  );

  return { ...playoff, matches: propagatePlayoffWinners(matches) };
}
