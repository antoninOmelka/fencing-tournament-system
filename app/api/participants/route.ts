import { NextResponse } from "next/server";
import { readParticipants } from "@/app/server/repositories/participants";

export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json(readParticipants(), { status: 200 });
  } catch (error) {
    console.error(`Failed to read participants: ${error}`);
    return NextResponse.json(
      { error: `Failed to read participants: ${error}` },
      { status: 500 },
    );
  }
}
