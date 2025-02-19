import React from 'react';
import { Table, TableBody, TableContainer, TableHead, Paper  } from '@mui/material';
import { StyledTableRow, StyledTableCell } from '@/app/styles/shared/tables';
import { Participant } from '../../types/participant';
import { ParticipantTableProps } from '../../types/props';

function GroupTable({ participants }: ParticipantTableProps) {
  return (
    <TableContainer className="group-table" component={Paper} >
      <Table size="medium">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Club</StyledTableCell>
            <StyledTableCell>Ranking</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {participants.map((participant: Participant) => (
            <StyledTableRow key={participant.id}>
              <StyledTableCell>{participant.name}</StyledTableCell>
              <StyledTableCell>{participant.club}</StyledTableCell>
              <StyledTableCell>{participant.ranking}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default GroupTable;