import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { Group } from "@/app/types/group";

const RESULTS_URL = "http://localhost:3000/api/results";

const groupsFilePath = path.join(process.cwd(), "app/data/groups.json");

function ensureFileExists() {
  if (!fs.existsSync(groupsFilePath)) {
    throw new Error("Groups data file not found");
  }
}

const readGroups = (): Group[] => {
  ensureFileExists();
  return JSON.parse(fs.readFileSync(groupsFilePath, "utf8"));
};

const writeGroups = (groups: Group[]): void => {
  fs.writeFileSync(groupsFilePath, JSON.stringify(groups, null, 2));
};

const validateGroupId = (groupId: string): number | null => {
  const groupIdNumber = Number(groupId);
  return isNaN(groupIdNumber) ? null : groupIdNumber;
};

function calculateStats({participants, results}: Group ) {
  const stats = participants.map((participant) => ({
    id: participant.id,
    wins: 0,
    matches: 0,
    pointsScored: 0,
    pointsReceived: 0,
    index: 0,
  }));

  results.forEach((row, rowIndex) => {
    row.forEach((score, colIndex) => {
      if (rowIndex >= colIndex || !score) return; // Upper triangle only

      const current = stats[rowIndex];
      const opponent = stats[colIndex];

      const isVictory = score.startsWith("V");
      const pointsScored = parseInt(score.slice(1), 10);
      const opponentScore = results[colIndex][rowIndex]?.slice(1);
      const pointsReceived = parseInt(opponentScore || "0", 10);

      current.matches++;
      opponent.matches++;

      if (isVictory) {
        current.wins++;
      } else {
        opponent.wins++;
      }

      current.pointsScored += pointsScored;
      current.pointsReceived += pointsReceived;

      opponent.pointsScored += pointsReceived;
      opponent.pointsReceived += pointsScored;
    });
  });

  stats.forEach((stat) => {
    stat.index = stat.pointsScored - stat.pointsReceived;
  });

  return participants.map((participant) => {
    const stat = stats.find((s) => s.id === participant.id);
    return {
      ...participant,
      wins: stat?.wins ?? 0,
      winsRate: stat?.matches ? (stat.wins / stat.matches).toFixed(2) : "0.00",
      pointsScored: stat?.pointsScored ?? 0,
      pointsReceived: stat?.pointsReceived ?? 0,
      index: stat?.index ?? 0,
    };
  });
}


export async function GET(req: NextRequest, { params }: { params: { groupId: string } }): Promise<NextResponse> {
  const { groupId } = await params;
  const groupIdNumber = validateGroupId(groupId);
  if (groupIdNumber === null) {
    return NextResponse.json({ error: "Invalid group ID" }, { status: 400 });
  }

  let groups;
  try {
    groups = readGroups();
  } catch (error) {
    console.error(`Failed to read groups: ${error}`);
    return NextResponse.json({ error: `Failed to read groups: ${error}` }, { status: 500 });
  }

  const group = groups.find((group) => group.id === groupIdNumber);
  if (!group) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  return NextResponse.json(group);
}

export async function PATCH(req: NextRequest, { params }: { params: { groupId: string } }) {
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
    return NextResponse.json({ error: `Failed to read groups: ${error}` }, { status: 500 });
  }

  const groupIndex = groups.findIndex((group) => group.id === groupIdNumber);
  if (groupIndex === -1) {
    return NextResponse.json({ error: "Group not found" }, { status: 404 });
  }

  const updatedGroup = { ...groups[groupIndex], ...groupData };
  updatedGroup.participants = calculateStats(updatedGroup);
  groups[groupIndex] = updatedGroup;

  try {
    writeGroups(groups);
  } catch (error) {
    console.error(`Failed to write group: ${error}`);
    return NextResponse.json({ error: `Failed to write group: ${error}` }, { status: 500 });
  }

  try {
    const response = await fetch(RESULTS_URL, {method: "POST"});
    if (!response.ok) {
      throw new Error(`Failed with status: ${response.status}`);
    }
  } catch (error) {
    console.log(`Failed to trigger results recalculation: ${error}`);
    return NextResponse.json({ error: `Failed to regenerate results: ${error}` }, { status: 500 });
  }

  return NextResponse.json({ message: "Group updated successfully", group: updatedGroup }, { status: 200 });
}