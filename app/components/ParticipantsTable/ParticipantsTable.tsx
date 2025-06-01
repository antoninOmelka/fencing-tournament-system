import "./../../styles/global/global.css";

import { memo, useCallback, useState } from "react";
import {
  Table, TableBody, TableHead, TableRow, Paper
} from "@mui/material";
import { z } from "zod";

import { StyledTableContainer, StyledTableCell } from "../../styles/shared/tables";
import { Participant } from "../../types/participant";
import ParticipantsTableRow from "../ParticipantRow/ParticipantsTableRow";
import { StyledButton } from "@/app/styles/shared/buttons";
import EditParticipantModal, { ParticipantInputs } from "../EditParticipantModal/EditParticipantModal";
import DeleteConfirmationModal from "../DeleteParticipantModal/DeleteParticipantModal";

type ParticipantsTableProps = {
  participants: Participant[];
  onAdd: (data: ParticipantInputs) => Promise<void>;
  onUpdate: (id: number, data: ParticipantInputs) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

export const participantSchema = z.object({
  name: z.string().min(1).max(25),
  year: z.coerce.number().min(1900).max(2025).refine(val => Number.isInteger(val)),
  club: z.string().min(1).max(25),
  ranking: z.coerce.number().min(1).max(999).refine(val => Number.isInteger(val)),
});

function ParticipantsTable({
  participants,
  onAdd,
  onUpdate,
  onDelete
}: ParticipantsTableProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [participantToEdit, setParticipantToEdit] = useState<Participant | null>(null);
  
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [participantToDelete, setParticipantToDelete] = useState<Participant | null>(null);

  const getParticipantById = useCallback((id: number) => {
    return participants.find(p => p.id === id) ?? null;
  }, [participants]);

  const handleAddParticipant = useCallback(() => {
    setParticipantToEdit(null);
    setEditModalOpen(true);
  }, []);

  const handleEditParticipant = useCallback((id: number) => {
    const participant = getParticipantById(id);
    if (participant) {
      setParticipantToEdit(participant);
      setEditModalOpen(true);
    }
  }, [getParticipantById]);

  const handleEditModalClose = useCallback(() => {
    setEditModalOpen(false);
    setParticipantToEdit(null);
  }, []);

  const handleEditModalSave = useCallback(async (data: ParticipantInputs) => {
    if (participantToEdit) {
      await onUpdate(participantToEdit.id, data);
    } else {
      await onAdd(data);
    }
  }, [participantToEdit, onAdd, onUpdate]);

  const handleDeleteParticipant = useCallback((id: number) => {
    const participant = getParticipantById(id);
    if (participant) {
      setParticipantToDelete(participant);
      setDeleteModalOpen(true);
    }
  }, [getParticipantById]);

  const handleDeleteModalClose = useCallback(() => {
    setDeleteModalOpen(false);
    setParticipantToDelete(null);
  }, []);

  const handleDeleteModalConfirm = useCallback(async () => {
    if (participantToDelete) {
      await onDelete(participantToDelete.id);
    }
  }, [participantToDelete, onDelete]);

  return (
    <>
      <div className="table-button-container">
        <StyledButton variant="contained" onClick={handleAddParticipant}>
          Add New
        </StyledButton>
      </div>

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
                onEditParticipant={handleEditParticipant}
                onDeleteParticipant={handleDeleteParticipant}
              />
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <EditParticipantModal
        open={editModalOpen}
        participant={participantToEdit}
        onClose={handleEditModalClose}
        onSave={handleEditModalSave}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        participant={participantToDelete}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteModalConfirm}
      />
    </>
  );
}

export default memo(ParticipantsTable);