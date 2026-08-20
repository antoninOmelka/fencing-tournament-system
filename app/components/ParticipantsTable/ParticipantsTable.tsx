import { memo, useCallback, useState } from "react";
import { Table, TableBody, TableHead, TableRow, Paper } from "@mui/material";

import {
  StyledTableContainer,
  StyledTableCell,
  StyledTableActions,
} from "../../styles/shared/tables";
import ParticipantsTableRow from "../ParticipantRow/ParticipantsTableRow";
import { StyledButton } from "@/app/styles/shared/buttons";
import EditParticipantModal from "../EditParticipantModal/EditParticipantModal";
import DeleteConfirmationModal from "../DeleteParticipantModal/DeleteParticipantModal";
import { ParticipantInputs } from "../../types/participantInputs";
import { ParticipantRowView } from "../../types/participantRowView";

type ParticipantsTableProps = {
  rows: ParticipantRowView[];
  onAdd: (data: ParticipantInputs) => Promise<void>;
  onUpdate: (id: number, data: ParticipantInputs) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

function ParticipantsTable({
  rows,
  onAdd,
  onUpdate,
  onDelete,
}: ParticipantsTableProps) {
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [rowToEdit, setRowToEdit] = useState<ParticipantRowView | null>(null);

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [rowToDelete, setRowToDelete] = useState<ParticipantRowView | null>(
    null,
  );

  const handleAddClick = useCallback(() => {
    setRowToEdit(null);
    setEditModalOpen(true);
  }, []);

  const handleEditClick = useCallback((row: ParticipantRowView) => {
    setRowToEdit(row);
    setEditModalOpen(true);
  }, []);

  const handleEditModalClose = useCallback(() => {
    setEditModalOpen(false);
    setRowToEdit(null);
  }, []);

  const handleEditModalSave = useCallback(
    async (data: ParticipantInputs) => {
      if (rowToEdit) {
        await onUpdate(rowToEdit.id, data);
      } else {
        await onAdd(data);
      }
    },
    [rowToEdit, onAdd, onUpdate],
  );

  const handleDeleteClick = useCallback((row: ParticipantRowView) => {
    setRowToDelete(row);
    setDeleteModalOpen(true);
  }, []);

  const handleDeleteModalClose = useCallback(() => {
    setDeleteModalOpen(false);
    setRowToDelete(null);
  }, []);

  const handleDeleteModalConfirm = useCallback(async () => {
    if (rowToDelete) {
      await onDelete(rowToDelete.id);
    }
  }, [rowToDelete, onDelete]);

  return (
    <>
      <StyledTableActions>
        <StyledButton variant="contained" onClick={handleAddClick}>
          Add New
        </StyledButton>
      </StyledTableActions>

      <StyledTableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCell className="order">#</StyledTableCell>
              <StyledTableCell className="name">Name</StyledTableCell>
              <StyledTableCell className="year">Year</StyledTableCell>
              <StyledTableCell className="club">Club</StyledTableCell>
              <StyledTableCell className="ranking">Ranking</StyledTableCell>
              <StyledTableCell className="actions">Actions</StyledTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <ParticipantsTableRow
                key={row.id}
                row={row}
                order={index + 1}
                onEdit={handleEditClick}
                onDelete={handleDeleteClick}
              />
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>

      <EditParticipantModal
        open={editModalOpen}
        participant={rowToEdit}
        onClose={handleEditModalClose}
        onSave={handleEditModalSave}
      />

      <DeleteConfirmationModal
        open={deleteModalOpen}
        participantName={rowToDelete ? rowToDelete.name : ""}
        onClose={handleDeleteModalClose}
        onConfirm={handleDeleteModalConfirm}
      />
    </>
  );
}

export default memo(ParticipantsTable);
