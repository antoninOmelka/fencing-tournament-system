"use client"

import './styles/global.css';

import React, { useState, useMemo } from 'react';
import ParticipantsTable from './components/Participant/Participant';
import { Button, Box, styled } from '@mui/material';
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import { initialParticipantsData } from './data/initialParticipants';

export type Participant = {
  id: number;
  name: string;
  year: string;
  club: string;
  ranking: string;
  isPresent: boolean;
};

const initialParticipants: Participant[] = initialParticipantsData;

function App() {
  const [participants, setParticipants] = useState<Participant[]>(initialParticipants);
  const [newParticipant, setNewParticipant] = useState({ name: '', year: '', club: '', ranking: '', isPresent: false });
  const [editingId, setEditingId] = useState<number | null>(null);

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
    setNewParticipant({ name: '', year: '', club: '', ranking: '', isPresent: false });
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
    const handleSaveEdit = () => {
      setParticipants(prev => prev.map(p =>
        p.id === editingId
          ? { ...newParticipant, id: p.id, isPresent: p.isPresent }
          : p
      ));
      setEditingId(null);
      setNewParticipant({ name: '', year: '', club: '', ranking: '', isPresent: false });
    };

    const handleDeleteParticipant = (id: number) => {
      setParticipants(prev => prev.filter(participant => participant.id !== id));
    };

    const sortedParticipants = useMemo(() =>
      [...participants].sort((a, b) => a.name.localeCompare(b.name)),
      [participants]
    );
    const participantsByRanking = useMemo(() =>
      [...participants].filter((participant) => participant.isPresent).sort((a, b) => Number(a.ranking) - Number(b.ranking)),
      [participants]
    );

    function distributeIntoGroups(participants: Participant[], numGroups: number): void {
      // Sort participants by ranking
      const sortedParticipants = [...participants].sort((a, b) => Number(a.ranking) - Number(b.ranking));

      // Create initial groups
      const groups: Participant[][] = Array.from({ length: numGroups }, () => []);

      // Initial snake distribution
      sortedParticipants.forEach((participant, index) => {
        const groupIndex = Math.floor(index / numGroups) % 2 === 0
          ? index % numGroups
          : numGroups - 1 - (index % numGroups);
        groups[groupIndex].push(participant);
      });

      // Optimize club distribution
      for (let i = 0; i < groups.length; i++) {
        let group = groups[i];
        const clubCounts = new Map<string, number>();

        group.forEach(participant => {
          clubCounts.set(participant.club, (clubCounts.get(participant.club) || 0) + 1);
        });

        for (const [club, count] of Array.from(clubCounts.entries())) {
          while (count > 1) {
            const participantToMove = group.find(p => p.club === club);
            if (!participantToMove) break;

            let moved = false;
            for (let j = 0; j < groups.length; j++) {
              if (i === j) continue;

              const otherGroup = groups[j];
              if (!otherGroup.some(p => p.club === club)) {
                otherGroup.push(participantToMove);
                group = group.filter(p => p !== participantToMove);
                moved = true;
                break;
              }
            }

            if (!moved) break;
            clubCounts.set(club, clubCounts.get(club)! - 1);
          }
        }

        groups[i] = group;
      }

      console.log(groups);
    }

    const generatePDF = (participants: Participant[]) => {
      const doc = new jsPDF();
      const tableData = {
        head: [['Name', 'Year', 'Club', 'Ranking']],
        body: participants.map(p => [p.name, p.year, p.club, p.ranking]),
      };

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
      <div className="App">
        <Box component="form" sx={{ '& > :not(style)': { m: 1, width: '25ch' } }} noValidate autoComplete="off">
          <StyledButton variant="contained" onClick={handleAddParticipant}>
            Add Participant
          </StyledButton>
          <StyledButton variant="contained" onClick={() => {generatePDF(sortedParticipants)}}>
            Registred List
          </StyledButton>
          <StyledButton variant="contained" onClick={() => {generatePDF(participantsByRanking)}}>
            Present List
          </StyledButton>
          <StyledButton variant="contained" onClick={() => { distributeIntoGroups(initialParticipantsData, 5) }}>
            Generate Groups
          </StyledButton>
        </Box>
        <ParticipantsTable
          participants={sortedParticipants}
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

  export default App;