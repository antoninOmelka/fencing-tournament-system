import React, { useEffect, useState } from "react";
import { StyledTableCell, StyledTableRow } from "@/app/styles/shared/tables";
import { Group } from "@/app/types/group";
import { Participant } from '../../types/participant';
import { Paper, Table, TableBody, TableContainer, TableHead } from "@mui/material";
import roundRobin from "roundrobin";
import "./../../styles/global/global.css";

async function generateMatchOrder(participants: Participant[]): Promise<string[]> {
    const participantNames = participants.map(participant => participant.name);
    const matches = roundRobin(participants.length, participantNames);
    return matches.flat();
}

function MatchesTable({ participants, results }: Group) {
    const [matchesOrder, setMatchesOrder] = useState<string[]>([]);

    useEffect(() => {
        async function getMatchOrder(participants: Participant[]) {
            const order = await generateMatchOrder(participants);
            setMatchesOrder(order);
        }

        getMatchOrder(participants);
    }, [participants]);

    return (
        <>
            <TableContainer className="group-table" component={Paper}>
                <Table size="medium">
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Fencer</StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                            {participants.map((participant: Participant) => (
                                <StyledTableCell key={participant.id}>{participant.groupRanking}</StyledTableCell>
                            ))}
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {participants.map((participant: Participant, participantIndex: number) => (
                            <StyledTableRow key={participant.id}>
                                <StyledTableCell>{participant.name}</StyledTableCell>
                                <StyledTableCell>{participantIndex + 1}</StyledTableCell>
                                {results.map((result: string[], resultIndex: number) => (
                                    <StyledTableCell key={`${participant.id}-${resultIndex}`}>
                                        {participantIndex === resultIndex ? 'X' : ''}
                                    </StyledTableCell>
                                ))}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <div className="match-list">
                {matchesOrder.map((match, index) => {
                    const participant1 = participants.find(p => p.name === match[0]);
                    const participant2 = participants.find(p => p.name === match[1]);
                
                        return (
                            <div key={`${match[0]}-${match[1]}-${index}`}>
                                <p>{participant1?.groupRanking ?? "N/A"} {match[0]}</p>
                                <p>{participant2?.groupRanking ?? "N/A"} {match[1]}</p>
                                <br />
                            </div>
                        );
                })}
            </div>
        </>
    );
}

export default MatchesTable;