import "./../../styles/global/global.css";

import { memo, useCallback, useState } from "react";
import { Table, TableBody, TableHead, TableRow, Paper, Modal, Box, Tooltip, TextField, Typography } from "@mui/material";
import { StyledTableContainer, StyledTableCell } from "../../styles/shared/tables";
import { Participant } from "../../types/participant";
import ParticipantsTableRow, { ParticipantInputs } from "../ParticipantRow/ParticipantsTableRow";
import { StyledButton } from "@/app/styles/shared/buttons";
import { z } from "zod";
import { deleteParticipant, updateParticipant } from "@/app/services/participants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SaveIcon from "@mui/icons-material/Save";
import { StyledDialog } from "@/app/styles/shared/dialogs";


type ParticipantsTableProps = {
  inicialParticipants: Participant[];
};

export const participantSchema = z.object({
  name: z.string().min(1).max(25),
  year: z.coerce.number().min(1900).max(2025).refine(val => Number.isInteger(val)),
  club: z.string().min(1).max(25),
  ranking: z.coerce.number().min(1).max(999).refine(val => Number.isInteger(val)),
});

function ParticipantsTable({ inicialParticipants }: ParticipantsTableProps) {
  const [participants, setParticipants] = useState<Participant[]>(inicialParticipants);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParticipantInputs>({
    resolver: zodResolver(participantSchema)
  });

  const handleAddParticipant = useCallback(() => {
    setEditingId(null);
    reset({
      name: "",
      year: 1990,
      club: "",
      ranking: 999
    });
    setOpen(true);

  }, [reset]);

  const handleEditParticipant = useCallback((id: number) => {
    const participantToEdit = participants.find(p => p.id === id);
    if (participantToEdit) {
      setEditingId(id);
      reset({
        name: participantToEdit.name,
        year: participantToEdit.year,
        club: participantToEdit.club,
        ranking: participantToEdit.ranking
      });
      setOpen(true);
    }
  }, [participants, reset]);

  const handleSaveEdit = useCallback(async (data: ParticipantInputs) => {
    try {
      if (editingId === null) {
        const newParticipant: Participant = {
          id: Date.now(),
          ...data
        };
        await updateParticipant(newParticipant)
        setParticipants(prev => [newParticipant, ...prev]);
      } else {
        const updatedParticipant = { ...data, id: editingId };
        await updateParticipant(updatedParticipant);
        setParticipants(prev =>
          prev.map(p => (p.id === editingId ? updatedParticipant : p))
        );
      }

      setOpen(false);
      setEditingId(null);
      reset();
    } catch (error) {
      console.error(error);
    }
  }, [editingId, reset]);

  const handleDeleteParticipant = useCallback(async (id: number) => {
    try {
      await deleteParticipant(String(id));
      const updatedParticipants = participants.filter(participant => participant.id !== id);
      setParticipants(updatedParticipants);
    } catch (error) {
      console.error(error);
      throw new Error("Failed to delete participant");
    }
  }, [participants]);

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
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledDialog>
          <Typography id="edit-participant-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
            {editingId === null ? "Add New Participant" : "Edit Participant"}
          </Typography>
          <form onSubmit={handleSubmit(handleSaveEdit)} style={{ display: "flex", flexDirection: "column", gap: "35px" }}>

            <Tooltip title={errors.name ? "Name must have length from 1 to 25" : ""} arrow>
              <TextField
                {...register("name")}
                label="Name"
                error={!!errors.name}
              />
            </Tooltip>

            <Tooltip title={errors.year ? "Year must be in range from 1900 to 2025" : ""} arrow>
              <TextField
                {...register("year")}
                type="number"
                label="Year"
                error={!!errors.year}
              />
            </Tooltip>

            <Tooltip title={errors.club ? "Club must have length from 1 to 25" : ""} arrow>
              <TextField
                {...register("club")}
                label="Club"
                error={!!errors.club}
              />
            </Tooltip>

            <Tooltip title={errors.ranking ? "Ranking must be in range from 1 to 999" : ""} arrow>
              <TextField
                {...register("ranking")}
                type="number"
                label="Ranking"
                error={!!errors.ranking}
              />
            </Tooltip>

            <Box sx={{ mt: 3, display: "flex", justifyContent: "space-between" }}>
              <StyledButton variant="outlined" onClick={handleClose}>
                Cancel
              </StyledButton>
              <StyledButton variant="contained" type="submit" startIcon={<SaveIcon />}>
                Save
              </StyledButton>
            </Box>
          </form>
        </StyledDialog>
      </Modal>
    </>

  );
}

export default memo(ParticipantsTable);