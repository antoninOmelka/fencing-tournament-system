import "./../../styles/global/global.css";

import { memo, useCallback, useState } from "react";
import {
  Table, TableBody, TableHead, TableRow, Paper, Modal, Box,
  Tooltip, TextField, Typography
} from "@mui/material";

import { StyledTableContainer, StyledTableCell } from "../../styles/shared/tables";
import { Participant } from "../../types/participant";
import ParticipantsTableRow, { ParticipantInputs } from "../ParticipantRow/ParticipantsTableRow";
import { StyledButton } from "@/app/styles/shared/buttons";
import { z } from "zod";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StyledDialog } from "@/app/styles/shared/dialogs";

type ParticipantsTableProps = {
  participants: Participant[];
  onAdd: (data: ParticipantInputs) => Promise<void>;
  onUpdate: (id: number, data: ParticipantInputs) => Promise<void>;
  onDelete: (id: number) => Promise<void>;
};

enum DialogType {
  edit = "edit",
  delete = "delete"
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
  const [modalType, setModalType] = useState<DialogType | null>(null);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParticipantInputs>({
    resolver: zodResolver(participantSchema)
  });

  const handleClose = useCallback(() => {
    setSelectedId(null);
    setModalType(null);
  }, []);

  const handleAddParticipant = useCallback(() => {
    setModalType(DialogType.edit);
    setSelectedId(null);
    reset({
      name: "",
      year: undefined,
      club: "",
      ranking: undefined
    });
  }, [reset]);

  const getParticipantById = useCallback((id: number | null) => {
    return participants.find(p => p.id === id) ?? null;
  }, [participants]);

  const handleEditParticipant = useCallback((id: number) => {
    const participantToEdit = getParticipantById(id);
    if (participantToEdit) {
      setModalType(DialogType.edit);
      setSelectedId(id);
      reset({
        name: participantToEdit.name,
        year: participantToEdit.year,
        club: participantToEdit.club,
        ranking: participantToEdit.ranking
      });
    }
  }, [getParticipantById, reset]);

  const handleDeleteParticipant = useCallback((id: number) => {
    setModalType(DialogType.delete);
    setSelectedId(id);
  }, []);

  const handleConfirmSave = useCallback(async (data: ParticipantInputs) => {
    try {
      if (selectedId === null) {
        await onAdd(data);
      } else {
        await onUpdate(selectedId, data);
      }

      setSelectedId(null);
      setModalType(null);
      reset();
    } catch (error) {
      console.error(error);
    }
  }, [selectedId, reset, onAdd, onUpdate]);

  const handleConfirmDelete = useCallback(async () => {
    if (selectedId !== null) {
      try {
        await onDelete(selectedId);
      } catch (error) {
        console.error(error);
      }

      setSelectedId(null);
      setModalType(null);
    }
  }, [selectedId, onDelete]);

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
        open={modalType !== null}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <StyledDialog>
          {modalType === DialogType.edit ?
            (
              <>
                <Typography id="edit-participant-modal-title" variant="h6" component="h2" sx={{ mb: 3 }}>
                  {selectedId === null ? "Add New Participant" : "Edit Participant"}
                </Typography>
                <form onSubmit={handleSubmit(handleConfirmSave)} style={{ display: "flex", flexDirection: "column", gap: "35px" }}>

                  <Tooltip title={errors.name ? "Name must have length from 1 to 25" : ""} arrow>
                    <TextField
                      {...register("name")}
                      label="Name"
                      error={!!errors.name}
                      autoFocus={true}
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
              </>
            ) : (
              <>
                <Typography id="delete-participant-modal-title" variant="h6" component="h2" sx={{ mb: 3}}>
                  Delete Participant
                </Typography>
                 <Typography sx={{ mb: 3 }}>
                  Are you sure you want to pernamently delete participant{" "}
                  <Box sx={{ fontWeight: "bold" }} component="span">
                    {getParticipantById(selectedId)?.name}
                  </Box>
                  ? This can not be undone.
                </Typography>
                <Box sx={{ mt: 5, display: "flex", justifyContent: "space-between" }}>
                  <StyledButton variant="outlined" onClick={handleClose}>
                    Cancel
                  </StyledButton>
                  <StyledButton variant="contained" color="error" onClick={handleConfirmDelete} startIcon={<DeleteIcon />}>
                    Delete
                  </StyledButton>
                </Box>
              </>
            )
          }
        </StyledDialog>
      </Modal>
    </>
  );
}

export default memo(ParticipantsTable);
