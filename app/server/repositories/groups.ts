import path from "path";
import { Group } from "@/app/types/group";
import { generateMatches } from "@/app/lib/generateMatches";
import { matchesFromResults } from "@/app/lib/matchesFromResults";
import { readJsonFile, writeJsonFile } from "../storage/jsonStore";

const groupsFilePath = path.join(process.cwd(), "app/data/groups.json");

// Legacy groups stored the results matrix as the source of truth; adopt it
// into the match records on read so every caller works with records only.
function migrateGroup(group: Group): Group {
  const baseMatches =
    group.matches && group.matches.length > 0
      ? group.matches
      : generateMatches(group.participants);

  if (!group.results) {
    return { ...group, matches: baseMatches };
  }

  const migrated = {
    ...group,
    matches: matchesFromResults(group.participants, baseMatches, group.results),
  };
  delete migrated.results;
  return migrated;
}

export function readGroups(): Group[] {
  return readJsonFile<Group[]>(groupsFilePath, []).map(migrateGroup);
}

export function writeGroups(groups: Group[]): void {
  // The results matrix is a derived view of the match records — never
  // persist it, so the two can't drift apart.
  const rawGroups = groups.map((group) => {
    const raw = { ...group };
    delete raw.results;
    return raw;
  });
  writeJsonFile(groupsFilePath, rawGroups);
}
