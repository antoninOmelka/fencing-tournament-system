import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const participantsFilePath = path.join(process.cwd(), "app/data/participants.json");

function ensureFileExists() {
  if (!fs.existsSync(participantsFilePath)) {
    console.log("File doesn't exist, creating it...");
    fs.writeFileSync(participantsFilePath, JSON.stringify([], null, 2));
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    ensureFileExists();
    const data = fs.readFileSync(participantsFilePath, "utf8");
    const parsedData = JSON.parse(data);
    return NextResponse.json(parsedData, { status: 200 });
  } catch (error) {
    console.error(`Failed to read participants: ${error}`);
    return NextResponse.json({ error: `Failed to read participants: ${error}` }, { status: 500 });
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const data = await request.json();
  try {
    ensureFileExists();
    fs.writeFileSync(participantsFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: "Participant added", data }, { status: 201 });
  } catch (error) {
    console.error(`Failed to write participants: ${error}`);
    return NextResponse.json({ error: `Failed to write participants: ${error}` }, { status: 500 });
  }
}
