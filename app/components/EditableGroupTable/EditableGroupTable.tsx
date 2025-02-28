import "@/app/styles/global/global.css";
import { StyledTableRow, StyledTableCell } from "@/app/styles/shared/tables";
import { Group } from "@/app/types/group";
import { Participant } from "@/app/types/participant";
import { Paper, Table, TableBody, TableContainer, TableHead, TextField } from "@mui/material";

type EditableGroupTableProps = {
    group: Group;
    onGroupChange: (updatedGroup: Group) => void;
  };

function EditableGroupTable({ group, onGroupChange }: EditableGroupTableProps) {
    const { participants, results } = group;

    const handleResultChange = (value: string, rowIndex: number, colIndex: number) => {
        const updatedResults = results.map((row, rIndex) =>
          rIndex === rowIndex
            ? row.map((cell, cIndex) => (cIndex === colIndex ? value : cell))
            : row
        );
    
        onGroupChange({ ...group, results: updatedResults });
    };

    return (
        <TableContainer className="group-table" component={Paper}>
            <Table size="medium">
                <TableHead>
                    <StyledTableRow>
                        <StyledTableCell>Fencer</StyledTableCell>
                        <StyledTableCell></StyledTableCell>
                        {participants?.map((participant: Participant) => (
                            <StyledTableCell key={participant.id}>{participant.groupRanking}</StyledTableCell>
                        ))}
                    </StyledTableRow>
                </TableHead>
                <TableBody>
                    {participants?.map((participant: Participant, participantIndex: number) => (
                        <StyledTableRow key={participant.id}>
                            <StyledTableCell>{participant.name}</StyledTableCell>
                            <StyledTableCell>{participantIndex + 1}</StyledTableCell>
                            {results.map((result: string[], resultIndex: number) => (
                                <StyledTableCell key={`${participant.id}-${resultIndex}`}>
                                    {participantIndex === resultIndex ? 'X' :
                                        <TextField value={results[participantIndex]?.[resultIndex] || ''} onChange={(e) => handleResultChange(e.target.value, participantIndex, resultIndex)}></TextField>
                                    }
                                </StyledTableCell>
                            ))}
                        </StyledTableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}

export default EditableGroupTable;