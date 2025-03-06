import fs from "fs";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { Participant } from "@/app/types/participant";

const participantsFilePath = path.join(process.cwd(), "app/data/participants.json");

function ensureFileExists() {
  if (!fs.existsSync(participantsFilePath)) {
    throw new Error("Participants data file not found");
  }
}

const readParticipants = (): Participant[] => {
  ensureFileExists();
  return JSON.parse(fs.readFileSync(participantsFilePath, "utf8"));
};

const writeParticipants = (participants: Participant[]): void => {
  fs.writeFileSync(participantsFilePath, JSON.stringify(participants, null, 2));
};

const validatParticipantId = (participantId: string): number | null => {
    const participantIdNumber = Number(participantId);
    return isNaN(participantIdNumber) ? null : participantIdNumber;
  };
  

export async function DELETE(req: NextRequest, { params }: { params: { participantId: string } }) {
    const { participantId } = await params;
    const participantIdNumber = validatParticipantId(participantId);
    if (participantIdNumber === null)
    {
        return NextResponse.json({ error: "Invalid participant ID"}, { status: 400 });
    }

    let participants;
    try {
        participants = readParticipants();
    } catch (error) {
        console.error(`Failed to read participants: ${error}`);
        return NextResponse.json({ error: `Failed to read participants: ${error}` }, { status: 500 });
    }

    const participantToDelete = participants.find((participant) => participant.id === Number(participantId));
    if (!participantToDelete) {
        return NextResponse.json({ error: "Participant not found" }, { status: 404 });
    }
    
    try {
        const filteredParticipants =  participants.filter((participant) => participant.id !== participantToDelete.id);
        writeParticipants(filteredParticipants);
    } catch (error) {
        console.error(`Failed to write participants: ${error}`);
        return NextResponse.json({ error: `Failed to write participants: ${error}` }, { status: 500 });
      }
      return NextResponse.json({ message: "Participant deleted successfully"}, { status: 200 });
}

