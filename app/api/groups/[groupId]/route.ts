import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from 'next/server'
import { Group } from "@/app/types/group";

const groupsFilePath = path.join(process.cwd(), "app/data/groups.json");

export async function GET(req: NextRequest, { params }: { params: { groupId: string } }) {
  const { groupId } = await params;

  const groupIdNumber = Number(groupId);
  if (isNaN(groupIdNumber)) {
    return NextResponse.json({ message: "Invalid group ID" }, { status: 400 });
  }

  if (!fs.existsSync(groupsFilePath)) {
    console.error("Groups data file not found:", groupsFilePath);
    return NextResponse.json({ message: "Groups data file not found" }, { status: 500 });
  }

  let groups: Group[];

  try {
    const fileContent = fs.readFileSync(groupsFilePath, "utf8");
    groups = JSON.parse(fileContent);
  } catch (error) {
    console.error("Error reading or parsing groups data:", error);
    return NextResponse.json({ message: "Failed to load groups data" }, { status: 500 });
  }

  const group = groups.find((group) => group.id === groupIdNumber);

  if (!group) {
    console.warn(`Group with ID ${groupId} not found`);
    return NextResponse.json({ message: 'Group not found' }, { status: 404 })
  }
  return NextResponse.json(group);
}