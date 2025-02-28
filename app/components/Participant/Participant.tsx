import './../../styles/global/global.css';

import React, { useMemo } from 'react';
import { Table, TableBody, TextField, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { StyledTableContainer, StyledTableRow, StyledTableCell } from './../../styles/shared/tables';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Participant } from '../../types/participant';

type ParticipantsTableProps = {
  participants: Participant[];
  onDeleteParticipant: (id: number) => void;
  onEditParticipant: (id: number) => void;
  editingId: number | null;
  newParticipant: Omit<Participant, 'id'>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit: () => void;
};

function ParticipantsTable({
  participants,
  onEditParticipant,
  onDeleteParticipant,
  editingId,
  newParticipant,
  onInputChange,
  onSaveEdit
}: ParticipantsTableProps) {

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
                  <StyledTableCell className="name"><TextField name="name" value={newParticipant.name} onChange={onInputChange} /></StyledTableCell>
                  <StyledTableCell className="year"><TextField type="number" name="year" value={newParticipant.year} onChange={onInputChange} inputProps={{
                    min: 0,
                    step: 1
                  }} /></StyledTableCell>
                  <StyledTableCell className="club"><TextField name="club" value={newParticipant.club} onChange={onInputChange} /></StyledTableCell>
                  <StyledTableCell className="ranking"><TextField type="number" name="ranking" value={newParticipant.ranking} onChange={onInputChange} inputProps={{
                    min: 0,
                    step: 1
                  }} /></StyledTableCell>
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