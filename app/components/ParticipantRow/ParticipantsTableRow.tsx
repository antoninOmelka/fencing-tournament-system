import React from "react";
import { IconButton } from "@mui/material";
import { StyledTableRow, StyledTableCell } from "../../styles/shared/tables";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Participant } from "../../types/participant";


export type ParaticipantInputsRaw = {
  name: string
  year: string
  club: string
  ranking: string
};

export type ParticipantInputs = {
  name: string
  year: number
  club: string
  ranking: number
};

interface ParticipantsTableRowProps {
  participant: Participant;
  onEditParticipant: (id: number) => void;
  onDeleteParticipant: (id: number) => void;
}

const ParticipantsTableRow = ({
  participant,
  onEditParticipant,
  onDeleteParticipant,
}: ParticipantsTableRowProps) => {



  return (
    <StyledTableRow>
      <StyledTableCell className="name">{participant.name}</StyledTableCell>
      <StyledTableCell className="year">{participant.year}</StyledTableCell>
      <StyledTableCell className="club">{participant.club}</StyledTableCell>
      <StyledTableCell className="ranking">{participant.ranking}</StyledTableCell>
      <StyledTableCell className="actions">
        <div className="action-buttons">
          <IconButton
            aria-label="edit"
            onClick={() => onEditParticipant(participant.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => onDeleteParticipant(participant.id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </StyledTableCell>
    </StyledTableRow >
  );
};

export default React.memo(ParticipantsTableRow, (prevProps, nextProps) => {
  const prevParticipant = prevProps.participant;
  const nextParticipant = nextProps.participant;
  
  const isSameParticipant = 
    prevParticipant.id === nextParticipant.id &&
    prevParticipant.name === nextParticipant.name &&
    prevParticipant.year === nextParticipant.year &&
    prevParticipant.club === nextParticipant.club &&
    prevParticipant.ranking === nextParticipant.ranking;

  return isSameParticipant;
});