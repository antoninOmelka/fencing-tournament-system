import path from "path";
import { Playoff } from "@/app/types/playoff";
import {
  deleteJsonFile,
  jsonFileExists,
  readJsonFile,
  writeJsonFile,
} from "../storage/jsonStore";

const playoffFilePath = path.join(process.cwd(), "app/data/playoff.json");

export function playoffExists(): boolean {
  return jsonFileExists(playoffFilePath);
}

export function readPlayoff(): Playoff {
  return readJsonFile<Playoff>(playoffFilePath, {
    participants: [],
    matches: [],
  });
}

export function writePlayoff(playoff: Playoff): void {
  writeJsonFile(playoffFilePath, playoff);
}

export function deletePlayoff(): void {
  deleteJsonFile(playoffFilePath);
}
