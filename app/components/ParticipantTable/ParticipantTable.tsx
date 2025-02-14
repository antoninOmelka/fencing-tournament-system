import React from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, tableCellClasses  } from '@mui/material';
import { styled } from '@mui/material/styles';
import { Participant } from '../../types/participant';
import { ParticipantTableProps } from '../../types/props';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

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