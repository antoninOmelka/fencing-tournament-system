import { Participant } from "./participant";

export interface PlayoffMatch {
  id: number;
  round: number; // 1..totalRounds, the last round is the final
  slot: number; // 0-based position within the round
  firstId: number | null; // null = bye (round 1) or not yet known winner
  secondId: number | null;
  winnerId: number | null;
}

export interface Playoff {
  participants: Participant[]; // in seeding order, seed = index + 1
  matches: PlayoffMatch[];
}
