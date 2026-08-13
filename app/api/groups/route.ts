import { NextRequest, NextResponse } from "next/server";
import { readGroups, writeGroups } from "@/app/server/repositories/groups";

export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json(readGroups(), { status: 200 });
  } catch (error) {
    console.error(`Failed to read groups: ${error}`);
    return NextResponse.json(
      { error: `Failed to read groups: ${error}` },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  const data = await request.json();
  try {
    writeGroups(data);
    return NextResponse.json(
      { message: "Groups added", data },
      { status: 201 },
    );
  } catch (error) {
    console.error(`Failed to write groups: ${error}`);
    return NextResponse.json(
      { error: `Failed to write groups: ${error}` },
      { status: 500 },
    );
  }
}
