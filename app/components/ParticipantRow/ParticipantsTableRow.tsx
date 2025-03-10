import React from "react";
import { IconButton, TextField, Tooltip } from "@mui/material";
import { StyledTableRow, StyledTableCell } from "../../styles/shared/tables";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Participant } from "../../types/participant";

interface ParticipantsTableRowProps {
  participant: Participant;
  isEditing: boolean;
  newParticipant: Omit<Participant, "id">;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit: () => void;
  onEditParticipant: (id: number) => void;
  onDeleteParticipant: (id: number) => void;
  isActionDisabled: boolean;
  errors: Record<string, string>;
}

const ParticipantsTableRow = ({
  participant,
  isEditing,
  newParticipant,
  onInputChange,
  onSaveEdit,
  onEditParticipant,
  onDeleteParticipant,
  isActionDisabled,
  errors
}: ParticipantsTableRowProps) => {
  return (
    <StyledTableRow>
      {isEditing ? (
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
                disabled={isActionDisabled}
                onClick={() => onEditParticipant(participant.id)}
              >
                <EditIcon />
              </IconButton>
              <IconButton
                aria-label="delete"
                disabled={isActionDisabled}
                onClick={() => onDeleteParticipant(participant.id)}
              >
                <DeleteIcon />
              </IconButton>
            </div>
          </StyledTableCell>
        </>
      )}
    </StyledTableRow>
  );
};

export default React.memo(ParticipantsTableRow, (prevProps, nextProps) => {
    if (
      prevProps.isEditing !== nextProps.isEditing ||
      prevProps.participant.id !== nextProps.participant.id ||
      prevProps.isActionDisabled !== nextProps.isActionDisabled ||
      JSON.stringify(prevProps.errors) !== JSON.stringify(nextProps.errors)
    ) {
      return false;
    }
  
    if (prevProps.isEditing) {
      return (
        prevProps.newParticipant.name === nextProps.newParticipant.name &&
        prevProps.newParticipant.year === nextProps.newParticipant.year &&
        prevProps.newParticipant.club === nextProps.newParticipant.club &&
        prevProps.newParticipant.ranking === nextProps.newParticipant.ranking
      );
    }
  
    return true;  
});