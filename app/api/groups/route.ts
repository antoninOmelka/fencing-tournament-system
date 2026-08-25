import { NextRequest, NextResponse } from "next/server";
import { writeGroups } from "@/app/server/repositories/groups";
import { loadGroups } from "@/app/server/loadGroups";
import { formatValidationIssues, groupsSchema } from "@/app/lib/apiSchemas";

export async function GET(): Promise<NextResponse> {
  try {
    return NextResponse.json(loadGroups(), { status: 200 });
  } catch (error) {
    console.error(`Failed to read groups: ${error}`);
    return NextResponse.json(
      { error: `Failed to read groups: ${error}` },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = groupsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: `Invalid groups data: ${formatValidationIssues(parsed.error)}` },
      { status: 400 },
    );
  }

  try {
    writeGroups(parsed.data);
    return NextResponse.json({ message: "Groups added" }, { status: 201 });
  } catch (error) {
    console.error(`Failed to write groups: ${error}`);
    return NextResponse.json(
      { error: `Failed to write groups: ${error}` },
      { status: 500 },
    );
  }
}
