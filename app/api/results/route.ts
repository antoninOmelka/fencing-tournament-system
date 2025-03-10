import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { Group } from "@/app/types/group";
import { Participant } from "@/app/types/participant";

const GROUPS_URL = "http://localhost:3000/api/groups";
const resultsFilePath = path.join(process.cwd(), "app/data/results.json");

async function ensureFileExists() {
    if (!fs.existsSync(resultsFilePath)) {
        await generateResults();
    }
}

async function generateResults() {
    try {
        const response = await fetch(GROUPS_URL);
        if (!response.ok) {
            throw new Error(`Failed to fetch groups: ${response.status} ${response.statusText}`);
        }

        const parsedData = await response.json();
        const sortedData = await sortParticipantsByResults(parsedData);
        fs.writeFileSync(resultsFilePath, JSON.stringify({ participants: sortedData }, null, 2));
    } catch (error) {
        console.error(`Failed to generate results: ${error}`);
        return NextResponse.json({ error: `Failed to generate results: ${error}` }, { status: 500 });
    }
}

async function sortParticipantsByResults(groups: Group[]): Promise<Participant[]> {
    const participants = groups.flatMap((group) => group.participants);
    return participants.sort((a, b) => {
        // 1. Number of wins (V)
        if (b.wins !== a.wins) {
            return (b.wins ?? 0) - (a.wins ?? 0);
        }

        // 2. Victory rate (V/M)
        if (Math.round((b.winsRate ?? 0) * 100) !== Math.round((a.winsRate ?? 0) * 100)) {
            return (b.winsRate ?? 0) - (a.winsRate ?? 0);
        }

        // 3. Indicator (pointsScored - pointsReceived)
        if (b.index !== a.index) {
            return (b.index ?? 0) - (a.index ?? 0);
        }

        // 4. Touches scored (pointsScored)
        if (b.pointsScored !== a.pointsScored) {
            return (b.pointsScored ?? 0) - (a.pointsScored ?? 0);
        }

        // 5. Random as a last resort
        return Math.random() - 0.5;
    });
}

export async function GET(): Promise<NextResponse> {
    try {
        await ensureFileExists();
        const data = fs.readFileSync(resultsFilePath, "utf8");
        const parsedData = JSON.parse(data);
        return NextResponse.json(parsedData, { status: 200 });
    } catch (error) {
        console.error(`Failed to read results: ${error}`);
        return NextResponse.json({ error: `Failed to read results: ${error}` }, { status: 500 });
    }
}

export async function POST(): Promise<NextResponse> {
    try {
        await generateResults();
        return NextResponse.json({message: "Results recalculated successfully."}, {status: 200})
    } catch (error) {
        console.error(`Failed to generate results: ${error}`);
        return NextResponse.json({ error: `Failed to generate results: ${error}` }, { status: 500 });
    }
}

export async function DELETE(): Promise<NextResponse> {
    console.log("lets delete")
    try {
        fs.unlink(resultsFilePath, (error) => {
            if (error) {
                console.error(`Failed to delete results: ${error}`);
                throw(error);
            }
        });
        return NextResponse.json({ message: "Results deleted successfully" }, { status: 200 });
    } catch(error) {
        return NextResponse.json({error: `Failed to delete results: ${error}`})
    }
}
