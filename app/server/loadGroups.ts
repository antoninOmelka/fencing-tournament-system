import { calculateStats } from "@/app/lib/calculateStats";
import { resultsFromMatches } from "@/app/lib/resultsFromMatches";
import { syncParticipants } from "@/app/lib/syncParticipants";
import { Group } from "@/app/types/group";
import { readGroups } from "./repositories/groups";
import { readParticipants } from "./repositories/participants";

// Groups are stored with raw participant copies and the match records only.
// Everything derived — fresh identity fields, computed stats, and the results
// matrix view — is applied here on every read, so nothing stale can be served.
export function loadGroups(): Group[] {
  const master = readParticipants();
  return readGroups().map((group) => {
    const synced = {
      ...group,
      participants: syncParticipants(group.participants, master),
    };
    return {
      ...synced,
      participants: calculateStats(synced),
      results: resultsFromMatches(synced.participants, group.matches || []),
    };
  });
}
