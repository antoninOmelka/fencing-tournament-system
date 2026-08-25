import { NextResponse } from "next/server";
import {
  deletePlayoff,
  playoffExists,
  readPlayoff,
  writePlayoff,
} from "@/app/server/repositories/playoff";
import { readParticipants } from "@/app/server/repositories/participants";
import { syncParticipants } from "@/app/lib/syncParticipants";
import { Playoff } from "@/app/types/playoff";

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
  try {
    const playoff: Playoff = await request.json();
    writePlayoff(playoff);
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
