import { NextResponse } from "next/server";
import {
  deletePlayoff,
  playoffExists,
  readPlayoff,
  writePlayoff,
} from "@/app/server/repositories/playoff";
import { readParticipants } from "@/app/server/repositories/participants";
import { formatValidationIssues, playoffSchema } from "@/app/lib/apiSchemas";
import { syncParticipants } from "@/app/lib/syncParticipants";

export async function GET(): Promise<NextResponse> {
  try {
    if (!playoffExists()) {
      return NextResponse.json(null, { status: 200 });
    }
    const playoff = readPlayoff();
    playoff.participants = syncParticipants(
      playoff.participants,
      readParticipants(),
    );
    return NextResponse.json(playoff, { status: 200 });
  } catch (error) {
    console.error(`Failed to read playoff: ${error}`);
    return NextResponse.json(
      { error: `Failed to read playoff: ${error}` },
      { status: 500 },
    );
  }
}

export async function POST(request: Request): Promise<NextResponse> {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = playoffSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: `Invalid playoff data: ${formatValidationIssues(parsed.error)}`,
      },
      { status: 400 },
    );
  }

  try {
    writePlayoff(parsed.data);
    return NextResponse.json(
      { message: "Playoff saved successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Failed to save playoff: ${error}`);
    return NextResponse.json(
      { error: `Failed to save playoff: ${error}` },
      { status: 500 },
    );
  }
}

export async function DELETE(): Promise<NextResponse> {
  try {
    deletePlayoff();
    return NextResponse.json(
      { message: "Playoff deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Failed to delete playoff: ${error}`);
    return NextResponse.json(
      { error: `Failed to delete playoff: ${error}` },
      { status: 500 },
    );
  }
}
