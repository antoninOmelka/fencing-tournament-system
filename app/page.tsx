"use client"

import './styles/global.css';

import React, { useState, useMemo, useEffect } from 'react';
import ParticipantsTable from './components/Participant/Participant';
import { Participant } from './types/participant';
import { Button, Box, styled } from '@mui/material';
import { jsPDF } from "jspdf";
import "jspdf-autotable";

export async function getParticipants() {
  try {
    const response = await fetch("api/participants");
    const data = await response.json();
    return data.participants; 
  } catch (error) {
    console.error(error);
    return [];
  }
};

export async function postParticipants(participants: Participant[]) {
  try {
    await fetch('/api/participants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ participants: participants }),
    });
  } catch (error) {
    console.error(error);
  }
};


function ParticipantsOverview() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState({ name: '', year: 0, club: '', ranking: 0, isPresent: false });
  const [editingId, setEditingId] = useState<number | null>(null);


  useEffect(() => {
    async function fetchParticipants() {
      try {
        const data = await getParticipants();
        setParticipants(data);
      } catch(error) {
        console.error(error);
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
    setNewParticipant({ name: '', year: 0, club: '', ranking: 0, isPresent: false });
  }

  const handlePresentParticipant = (id: number) => {
    setParticipants(prev => prev.map(p =>
      p.id === id ? { ...p, isPresent: !p.isPresent } : p
    ));
  };

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
        ? { ...newParticipant, id: p.id, isPresent: p.isPresent }
        : p
    );
    setParticipants(updatedParticipants);
    await postParticipants(updatedParticipants);
    setEditingId(null);
    setNewParticipant({ name: '', year: 0, club: '', ranking: 0, isPresent: false });
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
  const participantsByRanking = useMemo(() =>
    [...participants].filter((participant) => participant.isPresent).sort((a, b) => Number(a.ranking) - Number(b.ranking)),
    [participants]
  );

  const generatePDF = (participants: Participant[]) => {
    const doc = new jsPDF();
    const tableData = {
      head: [['Name', 'Year', 'Club', 'Ranking']],
      body: participants.map(p => [p.name, p.year, p.club, p.ranking]),
    };

    // TODO fix any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (doc as any).autoTable(tableData);
    const pdfOutput = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfOutput);
    window.open(pdfUrl, '_blank');
  };

  const StyledButton = styled(Button)(() => ({
    height: '56px', // Match TextField height
    marginTop: '16px', // Match TextField's default margin
    marginBottom: '8px',
  }));

  return (
    <div className="app">
      <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
        <StyledButton variant="contained" onClick={handleAddParticipant}>
          Add Participant
        </StyledButton>
        <StyledButton variant="contained" onClick={() => {generatePDF(participantsByAlphabet)}}>
          Registred List
        </StyledButton>
        <StyledButton variant="contained" onClick={() => {generatePDF(participantsByRanking)}}>
          Present List
        </StyledButton>
        <StyledButton variant="contained" href="/table">
          Generate Groups
        </StyledButton>
      </Box>
      <ParticipantsTable
        participants={participantsByAlphabet}
        onPresentParticipant={handlePresentParticipant}
        onEditParticipant={handleEditParticipant}
        onDeleteParticipant={handleDeleteParticipant}
        editingId={editingId}
        newParticipant={newParticipant}
        onInputChange={handleInputChange}
        onSaveEdit={handleSaveEdit} />
    </div>
  );
}

export default ParticipantsOverview;