import { StyledTableCell, StyledTableRow } from "@/app/styles/shared/tables";
import { Group } from "@/app/types/group";
import { Paper, Table, TableBody, TableContainer, TableHead } from "@mui/material";
import React from "react";

function MatchesTable({ id, participants: any, results }: Group) {
    return (
        <TableContainer component={Paper}>
            <Table size="medium">
                <TableHead>
                    <StyledTableRow>Fencer</StyledTableRow>
                        {participants.map((participant: any, index: any) => (
                            <StyledTableRow>{index}</StyledTableRow>
                        ))}
                </TableHead>
                <TableBody>
                   {participants.map((participant: Group) => (
                        <StyledTableRow key={participant.id}>
                            <StyledTableCell>{participant.name}</StyledTableCell>
                            {results?.map((result: any) => (
                            <StyledTableCell>{result}</StyledTableCell>
                            ))}
                        </StyledTableRow>
                   ))} 
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default MatchesTable