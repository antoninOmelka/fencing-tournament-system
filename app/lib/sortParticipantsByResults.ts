import { Group } from "../types/group";
import { Participant } from "../types/participant";

// FIE ranking of pool results: victory rate (V/M) first — pools can differ
// in size, so raw win counts are not comparable — then the indicator, then
// touches scored, then the drawn lot.
export function sortParticipantsByResults(groups: Group[]): Participant[] {
  const participants = groups.flatMap((group) => group.participants);
  return participants.sort((a, b) => {
    // 1. Victory rate (V/M), rounded to whole percent to absorb float noise
    const rateDiff =
      Math.round((b.winsRate || 0) * 100) - Math.round((a.winsRate || 0) * 100);
    if (rateDiff !== 0) {
      return rateDiff;
    }

    // 2. Indicator (pointsScored - pointsReceived)
    if (b.index !== a.index) {
      return (b.index || 0) - (a.index || 0);
    }

    // 3. Touches scored (pointsScored)
    if (b.pointsScored !== a.pointsScored) {
      return (b.pointsScored || 0) - (a.pointsScored || 0);
    }

    // 4. Draw of lots — random, but drawn only once (when groups are
    // generated), so recomputing the results never reshuffles them
    return (a.drawNumber || 0) - (b.drawNumber || 0);
  });
}
