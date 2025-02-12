import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

const DEFAULT_GROUPS_NUMBER = 5;

interface Participant {
  id: number;
  name: string;
  club: string;
  ranking: number;
  isPresent?: boolean;
}

interface ParticipantTableProps {
  participants: Participant[];
}


function distributeIntoGroups(participants: Participant[], numGroups: number): Participant[][] {
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

  return groups;
}

function GroupTable({ participants }: ParticipantTableProps) {

  distributeIntoGroups(participants, DEFAULT_GROUPS_NUMBER);
  console.log(participants);
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell>Name</TableCell>
            <TableCell>Club</TableCell>
            <TableCell>Ranking</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {participants.map((participant: Participant) => (
            <TableRow key={participant.id}>
              <TableCell>{participant.id}</TableCell>
              <TableCell>{participant.name}</TableCell>
              <TableCell>{participant.club}</TableCell>
              <TableCell>{participant.ranking}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GroupTable;