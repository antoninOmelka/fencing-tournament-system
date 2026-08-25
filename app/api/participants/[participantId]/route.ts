import { NextRequest, NextResponse } from "next/server";
import {
  readParticipants,
  writeParticipants,
} from "@/app/server/repositories/participants";
import { formatValidationIssues } from "@/app/lib/apiSchemas";
import { participantSchema } from "@/app/lib/participantSchema";

const validateParticipantId = (participantId: string): number | null => {
  const participantIdNumber = Number(participantId);
  return isNaN(participantIdNumber) ? null : participantIdNumber;
};

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ participantId: string }> },
) {
  const { participantId } = await params;
  const participantIdNumber = validateParticipantId(participantId);

  if (participantIdNumber === null) {
    return NextResponse.json(
      { error: "Invalid participant ID" },
      { status: 400 },
    );
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = participantSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        error: `Invalid participant data: ${formatValidationIssues(parsed.error)}`,
      },
      { status: 400 },
    );
  }
  const participantData = { ...parsed.data, id: participantIdNumber };

  let participants;
  try {
    participants = readParticipants();
  } catch (error) {
    console.error(`Failed to read participants: ${error}`);
    return NextResponse.json(
      { error: `Failed to read participants: ${error}` },
      { status: 500 },
    );
  }

  const participantIndex = participants.findIndex(
    (participant) => participant.id === participantIdNumber,
  );

  if (participantIndex === -1) {
    participants.push(participantData);
    writeParticipants(participants);
    return NextResponse.json(
      { message: "Participant created", participant: participantData },
      { status: 201 },
    );
  } else {
    participants[participantIndex] = {
      ...participants[participantIndex],
      ...participantData,
    };
    writeParticipants(participants);
    return NextResponse.json(
      {
        message: "Participant updated",
        participant: participants[participantIndex],
      },
      { status: 200 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ participantId: string }> },
) {
  const { participantId } = await params;
  const participantIdNumber = validateParticipantId(participantId);
  if (participantIdNumber === null) {
    return NextResponse.json(
      { error: "Invalid participant ID" },
      { status: 400 },
    );
  }

  let participants;
  try {
    participants = readParticipants();
  } catch (error) {
    console.error(`Failed to read participants: ${error}`);
    return NextResponse.json(
      { error: `Failed to read participants: ${error}` },
      { status: 500 },
    );
  }

  const participantToDelete = participants.find(
    (participant) => participant.id === Number(participantId),
  );
  if (!participantToDelete) {
    return NextResponse.json(
      { error: "Participant not found" },
      { status: 404 },
    );
  }

  try {
    const filteredParticipants = participants.filter(
      (participant) => participant.id !== participantToDelete.id,
    );
    writeParticipants(filteredParticipants);
  } catch (error) {
    console.error(`Failed to write participants: ${error}`);
    return NextResponse.json(
      { error: `Failed to write participants: ${error}` },
      { status: 500 },
    );
  }
  return NextResponse.json(
    { message: "Participant deleted successfully" },
    { status: 200 },
  );
}
