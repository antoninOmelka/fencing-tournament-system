import "./../../styles/global/global.css";

import React from "react";
import { Table, TableBody, TableHead, TableRow, Paper } from "@mui/material";
import { StyledTableContainer, StyledTableCell } from "../../styles/shared/tables";
import { Participant } from "../../types/participant";
import ParticipantsTableRow from "../ParticipantRow/ParticipantsTableRow";

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

  const isActionDisabled = Boolean(editingId);
  
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
          {participants.map((participant) => (
              <ParticipantsTableRow
                key={participant.id}
                participant={participant}
                isEditing={editingId === participant.id}
                newParticipant={newParticipant}
                onInputChange={onInputChange}
                onSaveEdit={onSaveEdit}
                onEditParticipant={onEditParticipant}
                onDeleteParticipant={onDeleteParticipant}
                isActionDisabled={isActionDisabled}
                errors={errors}
              />
          ))}
        </TableBody>
      </Table>
    </StyledTableContainer>
  );
}

export default React.memo(ParticipantsTable);