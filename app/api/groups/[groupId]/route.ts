import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from 'next/server';
import { Group } from "@/app/types/group";

const groupsFilePath = path.join(process.cwd(), "app/data/groups.json");

const readGroups = (): Group[] => {
  if (!fs.existsSync(groupsFilePath)) {
    throw new Error("Groups data file not found");
  }
  return JSON.parse(fs.readFileSync(groupsFilePath, "utf8"));
};

const writeGroups = (groups: Group[]): void => {
  fs.writeFileSync(groupsFilePath, JSON.stringify(groups, null, 2));
};

const validateGroupId = (groupId: string): number | null => {
  const groupIdNumber = Number(groupId);
  return isNaN(groupIdNumber) ? null : groupIdNumber;
};

export async function GET(req: NextRequest, { params }: { params: { groupId: string } }) {
  const { groupId } = await params;
  const groupIdNumber = validateGroupId(groupId);
  if (groupIdNumber === null) {
    return NextResponse.json({ message: "Invalid group ID" }, { status: 400 });
  }

  let groups;
  try {
    groups = readGroups();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }

  const group = groups.find((group) => group.id === groupIdNumber);
  if (!group) {
    return NextResponse.json({ message: "Group not found" }, { status: 404 });
  }

  return NextResponse.json(group);
}

export async function PATCH(req: NextRequest, { params }: { params: { groupId: string } }) {
  const { groupId } = await params;
  const groupIdNumber = validateGroupId(groupId);
  if (groupIdNumber === null) {
    return NextResponse.json({ message: "Invalid group ID" }, { status: 400 });
  }

  const groupData = await req.json();

  let groups;
  try {
    groups = readGroups();
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: error }, { status: 500 });
  }

  const groupIndex = groups.findIndex((group) => group.id === groupIdNumber);
  if (groupIndex === -1) {
    return NextResponse.json({ message: "Group not found" }, { status: 404 });
  }

  groups[groupIndex] = { ...groups[groupIndex], ...groupData };

  try {
    writeGroups(groups);
  } catch (error) {
    console.error("Failed to write groups:", error);
    return NextResponse.json({ message: "Failed to update group" }, { status: 500 });
  }

  return NextResponse.json({ message: "Group updated successfully" }, { status: 200 });
}