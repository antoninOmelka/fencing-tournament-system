import fs from "fs";

export function jsonFileExists(filePath: string): boolean {
  return fs.existsSync(filePath);
}

export function readJsonFile<T>(filePath: string, defaultValue: T): T {
  if (!fs.existsSync(filePath)) {
    writeJsonFile(filePath, defaultValue);
    return defaultValue;
  }
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as T;
}

export function writeJsonFile(filePath: string, data: unknown): void {
  // Write to a temp file and rename so a crash mid-write can't corrupt the data.
  const tempFilePath = `${filePath}.tmp`;
  fs.writeFileSync(tempFilePath, JSON.stringify(data, null, 2));
  fs.renameSync(tempFilePath, filePath);
}

export function deleteJsonFile(filePath: string): void {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
