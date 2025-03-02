import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";

const groupsFilePath = path.join(process.cwd(), "app/data/groups.json");

function ensureFileExists() {
  if (!fs.existsSync(groupsFilePath)) {
    console.log("File doesn't exist, creating it...");
    fs.writeFileSync(groupsFilePath, JSON.stringify({ groups: [] }, null, 2));
  }
}

export async function GET(): Promise<NextResponse> {
  try {
    ensureFileExists();
    const data = fs.readFileSync(groupsFilePath, "utf8");
    const parsedData = JSON.parse(data);
    return NextResponse.json(parsedData, { status: 200 });
  } catch (error) {
    console.error(`Failed to read groups: ${error}`);
    return NextResponse.json({ error: `Failed to read groups: ${error}` }, { status: 500 })
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const data = await request.json();
  try {
    ensureFileExists();
    fs.writeFileSync(groupsFilePath, JSON.stringify(data, null, 2));
    return NextResponse.json({ message: "Groups added", data }, { status: 201 });
  } catch (error) {
    console.error(`Failed to write groups: ${error}`);
    return NextResponse.json({ error: `Failed to write groups: ${error}` }, { status: 500 });
  }
}