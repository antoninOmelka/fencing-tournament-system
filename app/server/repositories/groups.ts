import path from "path";
import { Group } from "@/app/types/group";
import { readJsonFile, writeJsonFile } from "../storage/jsonStore";

const groupsFilePath = path.join(process.cwd(), "app/data/groups.json");

export function readGroups(): Group[] {
  return readJsonFile<Group[]>(groupsFilePath, []);
}

export function writeGroups(groups: Group[]): void {
  writeJsonFile(groupsFilePath, groups);
}
