import './../../styles/global/global.css';

import React, { useMemo } from 'react';
import { Table, TableBody, TextField, TableHead, TableRow, Paper, IconButton} from '@mui/material';
import { StyledTableContainer, StyledTableRow, StyledTableCell } from './../../styles/shared/tables';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { Participant } from '../../types/participant';

type ParticipantsTableProps = {
  participants: Participant[];
  onPresentParticipant: (id: number) => void;
  onDeleteParticipant: (id: number) => void;
  onEditParticipant: (id: number) => void;
  editingId: number | null;
  newParticipant: Omit<Participant, 'id'>;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit: () => void;
};

function ParticipantsTable({
  participants,
  onPresentParticipant,
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
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Year</StyledTableCell>
            <StyledTableCell>Club</StyledTableCell>
            <StyledTableCell>Ranking</StyledTableCell>
            <StyledTableCell>Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedParticipants.map((participant) => (
            <StyledTableRow key={participant.id} ispresent={participant.isPresent.toString()}>
              {editingId === participant.id ? (
                <>
                  <StyledTableCell><TextField name="name" value={newParticipant.name} onChange={onInputChange} /></StyledTableCell>
                  <StyledTableCell><TextField type="number" name="year" value={newParticipant.year} onChange={onInputChange} inputProps={{
                    min: 0,
                    step: 1
                  }} /></StyledTableCell>
                  <StyledTableCell><TextField name="club" value={newParticipant.club} onChange={onInputChange} /></StyledTableCell>
                  <StyledTableCell><TextField type="number" name="ranking" value={newParticipant.ranking} onChange={onInputChange} inputProps={{
                    min: 0,
                    step: 1
                  }} /></StyledTableCell>
                  <StyledTableCell>
                    <IconButton aria-label="save" onClick={onSaveEdit}>
                      <SaveIcon />
                    </IconButton>
                  </StyledTableCell>
                </>
              ) : (
                <>
                  <StyledTableCell>{participant.name}</StyledTableCell>
                  <StyledTableCell>{participant.year}</StyledTableCell>
                  <StyledTableCell>{participant.club}</StyledTableCell>
                  <StyledTableCell>{participant.ranking}</StyledTableCell>
                  {/* TODO: fix flex */}
                  <StyledTableCell sx={{ display: 'flex' }}>
                    <IconButton
                      onClick={() => onPresentParticipant(participant.id)}
                    >
                      <CheckCircleIcon />
                    </IconButton>
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