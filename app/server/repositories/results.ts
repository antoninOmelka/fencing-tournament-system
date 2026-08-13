import path from "path";
import { Results } from "@/app/types/results";
import {
  deleteJsonFile,
  jsonFileExists,
  readJsonFile,
  writeJsonFile,
} from "../storage/jsonStore";

const resultsFilePath = path.join(process.cwd(), "app/data/results.json");

export function resultsExist(): boolean {
  return jsonFileExists(resultsFilePath);
}

export function readResults(): Results {
  return readJsonFile<Results>(resultsFilePath, { participants: [] });
}

export function writeResults(results: Results): void {
  writeJsonFile(resultsFilePath, results);
}

export function deleteResults(): void {
  deleteJsonFile(resultsFilePath);
}
