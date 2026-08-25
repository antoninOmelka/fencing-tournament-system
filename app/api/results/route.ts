import { NextResponse } from "next/server";
import { sortParticipantsByResults } from "@/app/lib/sortParticipantsByResults";
import { loadGroups } from "@/app/server/loadGroups";

export async function GET(): Promise<NextResponse> {
  try {
    const participants = sortParticipantsByResults(loadGroups());
    return NextResponse.json({ participants }, { status: 200 });
  } catch (error) {
    console.error(`Failed to compute results: ${error}`);
    return NextResponse.json(
      { error: `Failed to compute results: ${error}` },
      { status: 500 },
    );
  }
}
