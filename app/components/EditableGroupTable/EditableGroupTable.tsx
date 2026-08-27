import "@/app/styles/global/global.css";
import { StyledTableRow, StyledTableCell } from "@/app/styles/shared/tables";
import { Group } from "@/app/types/group";
import { Participant } from "@/app/types/participant";
import { calculateStats } from "@/app/lib/calculateStats";
import { matchesFromResults } from "@/app/lib/matchesFromResults";
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
  const { participants } = group;
  const results = group.results || [];
  // live stats — recomputed from the match records on every edit
  const stats = calculateStats(group);

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
      newResults = updateResultCell(
        newResults,
        colIndex,
        rowIndex,
        mirrorAfter,
      );
      setCellError(newErrors, colIndex, rowIndex, mirrorAfter);
    }

    // the matrix is only the edit buffer — match records are what gets saved
    const newMatches = matchesFromResults(
      participants,
      group.matches || [],
      newResults,
    );

    onGroupChange({ ...group, results: newResults, matches: newMatches });
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
              <StyledTableCell className="center"></StyledTableCell>
              {participants.map((participant: Participant) => (
                <StyledTableCell className="result" key={participant.id}>
                  {participant.groupRanking}
                </StyledTableCell>
              ))}
              <StyledTableCell className="stat">V</StyledTableCell>
              <StyledTableCell className="stat">V/M</StyledTableCell>
              <StyledTableCell className="stat">Scored</StyledTableCell>
              <StyledTableCell className="stat">Received</StyledTableCell>
              <StyledTableCell className="stat">Index</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {participants.map(
              (participant: Participant, participantIndex: number) => (
                <StyledTableRow key={participant.id}>
                  <StyledTableCell>{participant.name}</StyledTableCell>
                  <StyledTableCell className="center">
                    {participantIndex + 1}
                  </StyledTableCell>
                  {results.map((result: string[], resultIndex: number) => (
                    <StyledTableCell
                      className="result"
                      key={`${participant.id}-${resultIndex}`}
                    >
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
                  <StyledTableCell className="stat">
                    {stats[participantIndex].wins}
                  </StyledTableCell>
                  <StyledTableCell className="stat">
                    {(stats[participantIndex].winsRate || 0).toFixed(2)}
                  </StyledTableCell>
                  <StyledTableCell className="stat">
                    {stats[participantIndex].pointsScored}
                  </StyledTableCell>
                  <StyledTableCell className="stat">
                    {stats[participantIndex].pointsReceived}
                  </StyledTableCell>
                  <StyledTableCell className="stat">
                    {stats[participantIndex].index}
                  </StyledTableCell>
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
          Invalid or incomplete result values! Use the FIE notation: V for a
          full-score victory, V4 for a victory short of 5 touches, D3 for a
          defeat with 3 touches. A pre-filled D needs the loser&apos;s score
          filled in.
        </Alert>
      )}
    </>
  );
}

export default EditableGroupTable;
