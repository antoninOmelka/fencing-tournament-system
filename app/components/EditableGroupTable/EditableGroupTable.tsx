import "@/app/styles/global/global.css";
import { StyledTableRow, StyledTableCell } from "@/app/styles/shared/tables";
import { Group } from "@/app/types/group";
import { Participant } from "@/app/types/participant";
import { mirrorResultValue } from "@/app/lib/mirrorResultValue";
import { resultSchema } from "@/app/lib/resultSchema";
import { updateResultCell } from "@/app/lib/updateResultCell";
import {
  Alert,
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
  TextField,
} from "@mui/material";
import { useState } from "react";

type EditableGroupTableProps = {
  group: Group;
  onGroupChange: (updatedGroup: Group) => void;
  setIsValid: (isValid: boolean) => void;
};

function EditableGroupTable({
  group,
  onGroupChange,
  setIsValid,
}: EditableGroupTableProps) {
  const [resultErrors, setResultErrors] = useState<
    Record<number, Record<number, string>>
  >({});
  const { participants, results } = group;

  const setCellError = (
    errors: Record<number, Record<number, string>>,
    rowIndex: number,
    colIndex: number,
    value: string,
  ) => {
    // an empty cell means the bout was not fenced yet, which is fine
    if (value === "" || resultSchema.safeParse(value).success) {
      if (errors[rowIndex]) {
        errors[rowIndex] = { ...errors[rowIndex] };
        delete errors[rowIndex][colIndex];
        if (Object.keys(errors[rowIndex]).length === 0) {
          delete errors[rowIndex];
        }
      }
    } else {
      errors[rowIndex] = {
        ...errors[rowIndex],
        [colIndex]: "Invalid format",
      };
    }
  };

  const handleResultChange = (
    value: string,
    rowIndex: number,
    colIndex: number,
  ) => {
    const newErrors: Record<number, Record<number, string>> = {
      ...resultErrors,
    };

    let newResults = updateResultCell(results, rowIndex, colIndex, value);
    setCellError(newErrors, rowIndex, colIndex, value);

    const mirrorBefore = results[colIndex]?.[rowIndex] || "";
    const mirrorAfter = mirrorResultValue(value, mirrorBefore);
    if (mirrorAfter !== mirrorBefore) {
      newResults = updateResultCell(newResults, colIndex, rowIndex, mirrorAfter);
      setCellError(newErrors, colIndex, rowIndex, mirrorAfter);
    }

    onGroupChange({ ...group, results: newResults });
    setResultErrors(newErrors);
    setIsValid(Object.keys(newErrors).length === 0);
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
                <StyledTableCell className="center" key={participant.id}>
                  {participant.groupRanking}
                </StyledTableCell>
              ))}
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {participants.map(
              (participant: Participant, participantIndex: number) => (
                <StyledTableRow key={participant.id}>
                  <StyledTableCell>{participant.name}</StyledTableCell>
                  <StyledTableCell>{participantIndex + 1}</StyledTableCell>
                  {results.map((result: string[], resultIndex: number) => (
                    <StyledTableCell key={`${participant.id}-${resultIndex}`}>
                      {participantIndex === resultIndex ? (
                        <TextField
                          className="group-table-empty-cell"
                          disabled
                        ></TextField>
                      ) : (
                        <TextField
                          value={results[participantIndex]?.[resultIndex] || ""}
                          onChange={(e) =>
                            handleResultChange(
                              e.target.value.toUpperCase(),
                              participantIndex,
                              resultIndex,
                            )
                          }
                          error={
                            !!resultErrors?.[participantIndex]?.[resultIndex]
                          }
                        ></TextField>
                      )}
                    </StyledTableCell>
                  ))}
                </StyledTableRow>
              ),
            )}
          </TableBody>
        </Table>
      </TableContainer>
      {Object.keys(resultErrors).length > 0 && (
        <Alert
          className="group-table-error"
          severity="error"
          variant="outlined"
        >
          Invalid or incomplete result values! Please use one of the following
          formats: V5, D1. Pre-filled letters need the score filled in.
        </Alert>
      )}
    </>
  );
}

export default EditableGroupTable;
