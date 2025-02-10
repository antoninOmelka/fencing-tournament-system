import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';

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


const ParticipantTable = ({ participants }: ParticipantTableProps) => {
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

export default ParticipantTable;