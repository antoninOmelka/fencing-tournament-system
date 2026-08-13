import { NextRequest, NextResponse } from "next/server";
import {
  readParticipants,
  writeParticipants,
} from "@/app/server/repositories/participants";

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

export async function POST(request: NextRequest): Promise<NextResponse> {
  const data = await request.json();
  try {
    writeParticipants(data);
    return NextResponse.json(
      { message: "Participant added", data },
      { status: 201 },
    );
  } catch (error) {
    console.error(`Failed to write participants: ${error}`);
    return NextResponse.json(
      { error: `Failed to write participants: ${error}` },
      { status: 500 },
    );
  }
}
