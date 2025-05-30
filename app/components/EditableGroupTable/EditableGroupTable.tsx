import "@/app/styles/global/global.css";
import { StyledTableRow, StyledTableCell } from "@/app/styles/shared/tables";
import { Group } from "@/app/types/group";
import { Participant } from "@/app/types/participant";
import { Alert, Paper, Table, TableBody, TableContainer, TableHead, TextField } from "@mui/material";
import { useState } from "react";
import { z } from "zod";

type EditableGroupTableProps = {
    group: Group;
    onGroupChange: (updatedGroup: Group) => void;
    setIsValid: (isValid: boolean) => void;
};

const resultsSchema = z.string().regex(new RegExp("^[VD][0-5]$"));

function EditableGroupTable({ group, onGroupChange, setIsValid }: EditableGroupTableProps) {
    const [resultErrors, setResultErrors] = useState<Record<number, Record<number, string>>>({});
    const { participants, results } = group;

    const handleResultChange = (value: string, rowIndex: number, colIndex: number) => {
        const newErrors: Record<number, Record<number, string>> = { ...resultErrors };

        try {
            resultsSchema.parse(value);
            if (newErrors[rowIndex]) {
                delete newErrors[rowIndex][colIndex];
                if (Object.keys(newErrors[rowIndex]).length === 0) {
                    delete newErrors[rowIndex];
                }
            }
        } catch (error) {
            if (error instanceof z.ZodError) {
                newErrors[rowIndex] = {
                    ...newErrors[rowIndex],
                    [colIndex]: error.errors[0]?.message || "Invalid input",
                };
            } else {
                console.error("Unexpected error:", error);
            }
        }

        const updatedResults = results.map((row, rIndex) =>
            rIndex === rowIndex
                ? row.map((cell, cIndex) => (cIndex === colIndex ? value : cell))
                : row
        );

        onGroupChange({ ...group, results: updatedResults });
        setResultErrors(newErrors);
        const hasErrors = Object.keys(newErrors).length > 0;
        setIsValid(!hasErrors);
    };

    return (
        <>
            <TableContainer className="group-table" component={Paper}>
                <Table size="medium">
                    <TableHead>
                        <StyledTableRow>
                            <StyledTableCell>Fencer</StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                            {participants.map((participant: Participant) => (
                                <StyledTableCell className="center" key={participant.id}>{participant.groupRanking}</StyledTableCell>
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
                                        {participantIndex === resultIndex ?
                                            <TextField className="group-table-empty-cell" disabled>
                                            </TextField>
                                            :
                                            <TextField
                                                value={results[participantIndex]?.[resultIndex] || ""}
                                                onChange={(e) => handleResultChange(e.target.value.toUpperCase(), participantIndex, resultIndex)}
                                                error={!!resultErrors?.[participantIndex]?.[resultIndex]}
                                            ></TextField>
                                        }
                                    </StyledTableCell>
                                ))}
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            {Object.keys(resultErrors).length > 0 && <Alert className="group-table-error" severity="error" variant="outlined">Invalid format! Please use one of the following formats for the result values: V5, D1.</Alert>}
        </>
    );
}

export default EditableGroupTable;