import { NextResponse } from "next/server";
import { regenerateResults } from "@/app/server/regenerateResults";
import {
  deleteResults,
  readResults,
  resultsExist,
} from "@/app/server/repositories/results";

export async function GET(): Promise<NextResponse> {
  try {
    if (!resultsExist()) {
      regenerateResults();
    }
    return NextResponse.json(readResults(), { status: 200 });
  } catch (error) {
    console.error(`Failed to read results: ${error}`);
    return NextResponse.json(
      { error: `Failed to read results: ${error}` },
      { status: 500 },
    );
  }
}

export async function POST(): Promise<NextResponse> {
  try {
    regenerateResults();
    return NextResponse.json(
      { message: "Results recalculated successfully." },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Failed to generate results: ${error}`);
    return NextResponse.json(
      { error: `Failed to generate results: ${error}` },
      { status: 500 },
    );
  }
}

export async function DELETE(): Promise<NextResponse> {
  try {
    deleteResults();
    return NextResponse.json(
      { message: "Results deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error(`Failed to delete results: ${error}`);
    return NextResponse.json(
      { error: `Failed to delete results: ${error}` },
      { status: 500 },
    );
  }
}
