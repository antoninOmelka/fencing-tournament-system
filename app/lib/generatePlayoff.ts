import { Participant } from "../types/participant";
import { Playoff, PlayoffMatch } from "../types/playoff";

// Seeds laid out so that the two best seeds can only meet in the final;
// consecutive pairs form the first-round matches and each pair sums to
// bracketSize + 1, so the byes of a short field go to the top seeds.
function computeSeedOrder(bracketSize: number): number[] {
  let order = [1];
  for (let size = 2; size <= bracketSize; size *= 2) {
    order = order.flatMap((seed) => [seed, size + 1 - seed]);
  }
  return order;
}

// Fills rounds 2+ from the winners of the feeding matches. A match whose
// participants changed loses its recorded winner, so correcting an earlier
// result invalidates everything downstream of it.
export function propagatePlayoffWinners(
  matches: PlayoffMatch[],
): PlayoffMatch[] {
  if (matches.length === 0) {
    return [];
  }

  const result = matches.map((match) => ({ ...match }));
  const byRoundSlot = new Map<string, PlayoffMatch>();
  for (const match of result) {
    byRoundSlot.set(`${match.round}:${match.slot}`, match);
  }

  const totalRounds = result.reduce(
    (max, match) => Math.max(max, match.round),
    0,
  );

  for (let round = 2; round <= totalRounds; round++) {
    for (const match of result) {
      if (match.round !== round) {
        continue;
      }

      const firstFeeder = byRoundSlot.get(`${round - 1}:${match.slot * 2}`);
      const secondFeeder = byRoundSlot.get(
        `${round - 1}:${match.slot * 2 + 1}`,
      );
      const firstId = firstFeeder ? firstFeeder.winnerId : null;
      const secondId = secondFeeder ? secondFeeder.winnerId : null;

      if (match.firstId !== firstId || match.secondId !== secondId) {
        match.firstId = firstId;
        match.secondId = secondId;
        match.winnerId = null;
      }
    }
  }

  return result;
}

export function generatePlayoff(seededParticipants: Participant[]): Playoff {
  const participants = [...seededParticipants];
  if (participants.length < 2) {
    return { participants, matches: [] };
  }

  const bracketSize = 2 ** Math.ceil(Math.log2(participants.length));
  const seedOrder = computeSeedOrder(bracketSize);
  const totalRounds = Math.log2(bracketSize);

  const matches: PlayoffMatch[] = [];
  let matchId = 1;
  for (let round = 1; round <= totalRounds; round++) {
    const matchCount = bracketSize / 2 ** round;
    for (let slot = 0; slot < matchCount; slot++) {
      matches.push({
        id: matchId,
        round,
        slot,
        firstId: null,
        secondId: null,
        winnerId: null,
      });
      matchId += 1;
    }
  }

  matches
    .filter((match) => match.round === 1)
    .forEach((match, index) => {
      const firstSeed = seedOrder[index * 2];
      const secondSeed = seedOrder[index * 2 + 1];
      match.firstId =
        firstSeed <= participants.length
          ? participants[firstSeed - 1].id
          : null;
      match.secondId =
        secondSeed <= participants.length
          ? participants[secondSeed - 1].id
          : null;

      // A bye advances its participant without a bout
      if (match.firstId !== null && match.secondId === null) {
        match.winnerId = match.firstId;
      }
      if (match.firstId === null && match.secondId !== null) {
        match.winnerId = match.secondId;
      }
    });

  return { participants, matches: propagatePlayoffWinners(matches) };
}
