import path from "path";
import { Participant } from "@/app/types/participant";
import { readJsonFile, writeJsonFile } from "../storage/jsonStore";

const participantsFilePath = path.join(
  process.cwd(),
  "app/data/participants.json",
);

export function readParticipants(): Participant[] {
  return readJsonFile<Participant[]>(participantsFilePath, []);
}

export function writeParticipants(participants: Participant[]): void {
  writeJsonFile(participantsFilePath, participants);
}
