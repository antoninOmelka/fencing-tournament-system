import "./../../styles/global/global.css";

import React, { useMemo } from "react";
import roundRobin from "roundrobin";
import { Paper, Table, TableBody, TableContainer, TableHead } from "@mui/material";
import { StyledTableCell, StyledTableRow } from "@/app/styles/shared/tables";
import { StyledButton } from "@/app/styles/shared/buttons";
import { Group } from "@/app/types/group";
import { Participant } from "../../types/participant";

function generateMatchOrder(participants: Participant[]): string[] {
    const participantNames = participants.map((p) => p.name);
    const matches = roundRobin(participants.length, participantNames);
    return matches.flat();
}

function GroupTable({ id, participants, results }: Group) {
    const matchOrder = useMemo(() =>
        generateMatchOrder(participants), [participants]);

    return (
        <div className="group-table">
            <div className="table-header">
                <h2 className="group-title">Group {id}</h2>
                <StyledButton variant="contained" href={`/groups/${id}`}>
                    Edit
                </StyledButton>
            </div>

            <TableContainer className="group-table" component={Paper}>
                <Table size="medium">
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Fencer</StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                            {participants.map((participant) => (
                                <StyledTableCell key={participant.id}>
                                    {participant.groupRanking}
                                </StyledTableCell>
                            ))}
                            <StyledTableCell>Wins</StyledTableCell>
                            <StyledTableCell>Wins Rate</StyledTableCell>
                            <StyledTableCell>Scored</StyledTableCell>
                            <StyledTableCell>Received</StyledTableCell>
                            <StyledTableCell>Index</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {participants.map((participant, participantIndex) => (
                            <StyledTableRow key={participant.id}>
                                <StyledTableCell>{participant.name}</StyledTableCell>
                                <StyledTableCell>{participantIndex + 1}</StyledTableCell>
                                {results.map((result, resultIndex) => (
                                    <StyledTableCell key={`${participant.id}-${resultIndex}`}>
                                        {participantIndex === resultIndex ? "X" : results[participantIndex]?.[resultIndex]}
                                    </StyledTableCell>
                                ))}
                                <StyledTableCell>{participant.wins}</StyledTableCell>
                                <StyledTableCell>{participant.winsRate}</StyledTableCell>
                                <StyledTableCell>{participant.pointsScored}</StyledTableCell>
                                <StyledTableCell>{participant.pointsReceived}</StyledTableCell>
                                <StyledTableCell>{participant.index}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="match-list">
                {matchOrder.map((match, index) => {
                    const participant1 = participants.find((p) => p.name === match[0]);
                    const participant2 = participants.find((p) => p.name === match[1]);

                    return (
                        <div key={`${match[0]}-${match[1]}-${index}`}>
                            <p>{participant1?.groupRanking ?? "N/A"} {match[0]}</p>
                            <p>{participant2?.groupRanking ?? "N/A"} {match[1]}</p>
                            <br />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default GroupTable;
