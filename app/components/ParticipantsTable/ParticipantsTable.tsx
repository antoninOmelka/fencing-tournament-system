import "./../../styles/global/global.css";

import React, { useMemo } from "react";
import { Table, TableBody, TableHead, TableRow, Paper, IconButton, Tooltip, TextField } from "@mui/material";
import { StyledTableContainer, StyledTableRow, StyledTableCell } from "../../styles/shared/tables";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Participant } from "../../types/participant";

type ParticipantsTableProps = {
  participants: Participant[];
  onDeleteParticipant: (id: number) => void;
  onEditParticipant: (id: number) => void;
  editingId: number | null;
  newParticipant: Omit<Participant, "id">;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit: () => void;
  errors: Record<string, string>;
};

function ParticipantsTable({
  participants,
  onEditParticipant,
  onDeleteParticipant,
  editingId,
  newParticipant,
  onInputChange,
  onSaveEdit,
  errors
}: ParticipantsTableProps) {

  const isActionDisabled = (editingId: number | null) => Number.isInteger(editingId);

  const sortedParticipants = useMemo(() =>
    [...participants].sort((a, b) => a.name.localeCompare(b.name)),
    [participants]
  );

  return (
    <StyledTableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <StyledTableCell className="name">Name</StyledTableCell>
            <StyledTableCell className="year">Year</StyledTableCell>
            <StyledTableCell className="club">Club</StyledTableCell>
            <StyledTableCell className="ranking">Ranking</StyledTableCell>
            <StyledTableCell className="actions">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedParticipants.map((participant) => (
            <StyledTableRow key={participant.id}>
              {editingId === participant.id ? (
                <>
                  <StyledTableCell className="name">
                    <Tooltip title={errors.name ? "Name must have length from 1 to 25" : ""} arrow>
                      <TextField
                        name="name"
                        value={newParticipant.name}
                        onChange={onInputChange}
                        error={!!errors.name}
                        helperText={errors.name ? "Invalid value" : ""}
                      />
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell className="year">
                    <Tooltip title={errors.year ? "Year must be in range from 1900 to 2025" : ""} arrow>
                      <TextField
                        name="year"
                        value={newParticipant.year}
                        onChange={onInputChange}
                        error={!!errors.year}
                        helperText={errors.year ? "Invalid value" : ""}
                      />
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell className="club">
                    <Tooltip title={errors.club ? "Club must have length from 1 to 25" : ""} arrow>
                      <TextField
                        name="club"
                        value={newParticipant.club}
                        onChange={onInputChange}
                        error={!!errors.club}
                        helperText={errors.club ? "Invalid value" : ""}
                      />
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell className="ranking">
                    <Tooltip title={errors.ranking ? "Ranking must be in range from 1 to 999" : ""} arrow>
                      <TextField
                        name="ranking"
                        value={newParticipant.ranking}
                        onChange={onInputChange}
                        error={!!errors.ranking}
                        helperText={errors.ranking ? "Invalid value" : ""}
                      />
                    </Tooltip>
                  </StyledTableCell>
                  <StyledTableCell className="actions">
                    <IconButton aria-label="save" onClick={onSaveEdit}>
                      <SaveIcon />
                    </IconButton>
                  </StyledTableCell>
                </>
              ) : (
                <>
                  <StyledTableCell className="name">{participant.name}</StyledTableCell>
                  <StyledTableCell className="year">{participant.year}</StyledTableCell>
                  <StyledTableCell className="club">{participant.club}</StyledTableCell>
                  <StyledTableCell className="ranking">{participant.ranking}</StyledTableCell>
                  <StyledTableCell className="actions">
                    <div className="action-buttons">
                      <IconButton
                        aria-label="edit"
                        disabled={isActionDisabled(editingId)}
                        onClick={() => onEditParticipant(participant.id)}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        aria-label="delete"
                        disabled={isActionDisabled(editingId)}
                        onClick={() => onDeleteParticipant(participant.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </div>
                  </StyledTableCell>
                </>
              )}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

export default ParticipantsTable;