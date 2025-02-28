"use client"

import "@/app/styles/global/global.css";

import React, { useState, useMemo, useEffect } from "react";
import { getParticipants, postParticipants } from "../services/participants";
import ParticipantsTable from "../components/ParticipantsTable/ParticipantsTable";
import Loading from "../components/Loading/Loading";
import { Participant } from "../types/participant";
import { Box } from "@mui/material";
import { StyledButton } from "../styles/shared/buttons";
import jsPDF from "jspdf";
import "jspdf-autotable";

function ParticipantsView() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState({ name: "", year: 0, club: "", ranking: 0 });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);


  useEffect(() => {
    async function fetchParticipants() {
      try {
        const data = await getParticipants();
        setParticipants(data);
      } catch(error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  
    fetchParticipants();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewParticipant(prev => ({ ...prev, [name]: value }));
  };

  const handleAddParticipant = () => {
    const participant: Participant = {
      id: Date.now(), // Use timestamp as a simple unique id
      ...newParticipant
    };
    setEditingId(participant.id);
    setParticipants(prev => [participant, ...prev]);
    setNewParticipant({ name: "", year: 0, club: "", ranking: 0 });
  }

  const handleEditParticipant = (id: number) => {
    setEditingId(id);
    const participantToEdit = participants.find(p => p.id === id);
    if (participantToEdit) {
      setNewParticipant(participantToEdit);
    }
  };

  const handleSaveEdit = async() => {
    const updatedParticipants = participants.map(p =>
      p.id === editingId
        ? { ...newParticipant, id: p.id }
        : p
    );
    setParticipants(updatedParticipants);
    await postParticipants(updatedParticipants);
    setEditingId(null);
    setNewParticipant({ name: "", year: 0, club: "", ranking: 0 });
  };

  const handleDeleteParticipant = async(id: number) => {
    const updatedParticipants = participants.filter(participant => participant.id !== id);
    setParticipants(updatedParticipants);
    await postParticipants(updatedParticipants);
  };

  const participantsByAlphabet = useMemo(() =>
    [...participants].sort((a, b) => a.name.localeCompare(b.name)),
    [participants]
  );

  const generatePDF = (participants: Participant[]) => {
    const doc = new jsPDF();
    const tableData = {
      head: [["Name", "Year", "Club", "Ranking"]],
      body: participants.map(p => [p.name, p.year, p.club, p.ranking]),
    };

    doc.autoTable(tableData);
    const pdfOutput = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfOutput);
    window.open(pdfUrl, "_blank");
  };

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="participants-container">
      <Box component="form" sx={{ "& > :not(style)": { m: 1, width: "25ch" } }} noValidate autoComplete="off">
        <StyledButton variant="contained" onClick={handleAddParticipant}>
          Add Participant
        </StyledButton>
        <StyledButton variant="contained" onClick={() => {generatePDF(participantsByAlphabet)}}>
          Print Participants
        </StyledButton>
      </Box>
      <ParticipantsTable
        participants={participantsByAlphabet}
        onEditParticipant={handleEditParticipant}
        onDeleteParticipant={handleDeleteParticipant}
        editingId={editingId}
        newParticipant={newParticipant}
        onInputChange={handleInputChange}
        onSaveEdit={handleSaveEdit} />
    </div>
  );
}

export default ParticipantsView;