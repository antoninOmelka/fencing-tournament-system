import roundRobin from "roundrobin";
import { Match } from "../types/match";
import { Participant } from "../types/participant";

export function generateMatches(participants: Participant[]): Match[] {
  const ids = participants.map((participant) => participant.id);
  const rounds = roundRobin(ids.length, ids);
  return rounds.flat().map((pair) => ({ firstId: pair[0], secondId: pair[1] }));
}
