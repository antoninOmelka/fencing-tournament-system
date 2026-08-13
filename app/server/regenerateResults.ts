import { sortParticipantsByResults } from "@/app/lib/sortParticipantsByResults";
import { readGroups } from "./repositories/groups";
import { writeResults } from "./repositories/results";

export function regenerateResults(): void {
  const groups = readGroups();
  const participants = sortParticipantsByResults(groups);
  writeResults({ participants });
}
