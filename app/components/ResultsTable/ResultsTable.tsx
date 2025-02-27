import "@/app/styles/global/global.css";

import React from 'react';
import { Table, TableBody, TableContainer, TableHead, Paper } from '@mui/material';
import { StyledTableRow, StyledTableCell } from '@/app/styles/shared/tables';
import { Participant } from '../../types/participant';
import { ParticipantTableProps } from '../../types/props';

function ResultsTable({ participants }: ParticipantTableProps) {
    return (
        <TableContainer className="group-table" component={Paper} >
            <Table size="medium">
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell>Place</StyledTableCell>
                        <StyledTableCell>Name</StyledTableCell>
                        <StyledTableCell>Club</StyledTableCell>
                        <StyledTableCell>Index</StyledTableCell>
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {participants.map((participant: Participant, index: number) => (
                        <StyledTableRow key={participant.id}>
                            <StyledTableCell>{index + 1}</StyledTableCell>
                            <StyledTableCell>{participant.name}</StyledTableCell>
                            <StyledTableCell>{participant.club}</StyledTableCell>
                            <StyledTableCell>{participant.index}</StyledTableCell>
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default ResultsTable;