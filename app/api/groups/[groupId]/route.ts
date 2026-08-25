import { NextRequest, NextResponse } from "next/server";
import { readGroups, writeGroups } from "@/app/server/repositories/groups";
import { loadGroups } from "@/app/server/loadGroups";

const validateGroupId = (groupId: string): number | null => {
  const groupIdNumber = Number(groupId);
  return isNaN(groupIdNumber) ? null : groupIdNumber;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> },
): Promise<NextResponse> {
  const { groupId } = await params;
  const groupIdNumber = validateGroupId(groupId);
  if (groupIdNumber === null) {
    return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
  }

  let groups;
  try {
    groups = loadGroups();
  } catch (error) {
    console.error(`Failed to read groups: ${error}`);
    return NextResponse.json(
      { error: `Failed to read groups: ${error}` },
      { status: 500 },
    );
  }

  const group = groups.find((group) => group.id === groupIdNumber);
  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  return NextResponse.json(group);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ groupId: string }> },
) {
  const { groupId } = await params;
  const groupIdNumber = validateGroupId(groupId);
  if (groupIdNumber === null) {
    return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
  }

  const groupData = await req.json();

  let groups;
  try {
    groups = readGroups();
  } catch (error) {
    console.error(`Failed to read groups: ${error}`);
    return NextResponse.json(
      { error: `Failed to read groups: ${error}` },
      { status: 500 },
    );
  }

  const groupIndex = groups.findIndex((group) => group.id === groupIdNumber);
  if (groupIndex === -1) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const updatedGroup = { ...groups[groupIndex], ...groupData };
  groups[groupIndex] = updatedGroup;

  try {
    writeGroups(groups);
  } catch (error) {
    console.error(`Failed to write group: ${error}`);
    return NextResponse.json(
      { error: `Failed to write group: ${error}` },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { message: "Group updated successfully", group: updatedGroup },
    { status: 200 },
  );
}
