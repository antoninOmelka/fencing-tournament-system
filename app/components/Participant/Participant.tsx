import './../../styles/global.css';

import React, { useMemo } from 'react';
import { Table, TableBody, TableCell, TableContainer, TextField, TableHead, TableRow, Paper, IconButton, styled } from '@mui/material';
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

const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop) => prop !== 'component'
})<{ component?: React.ElementType }>(({ theme }) => ({
  maxWidth: 800,
  margin: 'auto',
  marginTop: theme.spacing(3),
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[3],
}));

const StyledTableRow = styled(TableRow)<{ ispresent: string }>(({ theme, ispresent }) => ({
  backgroundColor: ispresent === 'true' ? theme.palette.info.light : 'inherit',
  '&:hover': {
    backgroundColor: ispresent === 'true' ? theme.palette.info.main : theme.palette.action.hover,
  },
}));


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
            <TableCell>Name</TableCell>
            <TableCell>Year</TableCell>
            <TableCell>Club</TableCell>
            <TableCell>Ranking</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedParticipants.map((participant) => (
            <StyledTableRow key={participant.id} ispresent={participant.isPresent.toString()}>
              {editingId === participant.id ? (
                <>
                  <TableCell><TextField name="name" value={newParticipant.name} onChange={onInputChange} /></TableCell>
                  <TableCell><TextField type="number" name="year" value={newParticipant.year} onChange={onInputChange} inputProps={{
                    min: 0,
                    step: 1
                  }} /></TableCell>
                  <TableCell><TextField name="club" value={newParticipant.club} onChange={onInputChange} /></TableCell>
                  <TableCell><TextField type="number" name="ranking" value={newParticipant.ranking} onChange={onInputChange} inputProps={{
                    min: 0,
                    step: 1
                  }} /></TableCell>
                  <TableCell>
                    <IconButton aria-label="save" onClick={onSaveEdit}>
                      <SaveIcon />
                    </IconButton>
                  </TableCell>
                </>
              ) : (
                <>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.year}</TableCell>
                  <TableCell>{participant.club}</TableCell>
                  <TableCell>{participant.ranking}</TableCell>
                  {/* TODO: fix flex */}
                  <TableCell sx={{ display: 'flex' }}>
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
                  </TableCell>
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