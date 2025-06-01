import { memo, useCallback, useEffect } from "react";
import {
  Modal, Box, Tooltip, TextField, Typography
} from "@mui/material";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SaveIcon from "@mui/icons-material/Save";

import { StyledButton } from "@/app/styles/shared/buttons";
import { StyledDialog } from "@/app/styles/shared/dialogs";
import { participantSchema } from "../ParticipantsTable/ParticipantsTable";
import { Participant } from "../../types/participant";

export type ParticipantInputs = {
  name: string;
  year: number;
  club: string;
  ranking: number;
};

type EditParticipantModalProps = {
  open: boolean;
  participant?: Participant | null;
  onClose: () => void;
  onSave: (data: ParticipantInputs) => Promise<void>;
};

function EditParticipantModal({
  open,
  participant,
  onClose,
  onSave
}: EditParticipantModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ParticipantInputs>({
    resolver: zodResolver(participantSchema)
  });

  const isEditMode = participant !== null && participant !== undefined;

  useEffect(() => {
    if (open) {
      if (isEditMode && participant) {
        reset({
          name: participant.name,
          year: participant.year,
          club: participant.club,
          ranking: participant.ranking
        });
      } else {
        reset({
          name: "",
          year: undefined,
          club: "",
          ranking: undefined
        });
      }
    }
  }, [open, participant, isEditMode, reset]);

  const handleSave = useCallback(async (data: ParticipantInputs) => {
    try {
      await onSave(data);
      onClose();
    } catch (error) {
      console.error(error);
    }
  }, [onSave, onClose]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="edit-participant-modal-title"
      aria-describedby="edit-participant-modal-description"
    >
      <StyledDialog>
        <Typography 
          id="edit-participant-modal-title" 
          variant="h6" 
          component="h2" 
          sx={{ mb: 3 }}
        >
          {isEditMode ? "Edit Participant" : "Add New Participant"}
        </Typography>
        
        <form 
          onSubmit={handleSubmit(handleSave)} 
          style={{ display: "flex", flexDirection: "column", gap: "35px" }}
        >
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
            <StyledButton variant="outlined" onClick={onClose}>
              Cancel
            </StyledButton>
            <StyledButton variant="contained" type="submit" startIcon={<SaveIcon />}>
              Save
            </StyledButton>
          </Box>
        </form>
      </StyledDialog>
    </Modal>
  );
}

export default memo(EditParticipantModal);