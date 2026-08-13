import { Group } from "../types/group";
import { Participant } from "../types/participant";

export function sortParticipantsByResults(groups: Group[]): Participant[] {
  const participants = groups.flatMap((group) => group.participants);
  return participants.sort((a, b) => {
    // 1. Number of wins (V)
    if (b.wins !== a.wins) {
      return (b.wins ?? 0) - (a.wins ?? 0);
    }

    // 2. Victory rate (V/M)
    if (
      Math.round((b.winsRate ?? 0) * 100) !==
      Math.round((a.winsRate ?? 0) * 100)
    ) {
      return (b.winsRate ?? 0) - (a.winsRate ?? 0);
    }

    // 3. Indicator (pointsScored - pointsReceived)
    if (b.index !== a.index) {
      return (b.index ?? 0) - (a.index ?? 0);
    }

    // 4. Touches scored (pointsScored)
    if (b.pointsScored !== a.pointsScored) {
      return (b.pointsScored ?? 0) - (a.pointsScored ?? 0);
    }

    // 5. Random as a last resort
    return Math.random() - 0.5;
  });
}
