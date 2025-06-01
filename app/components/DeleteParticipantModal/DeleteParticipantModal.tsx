import { memo, useCallback } from "react";
import { Modal, Box, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { StyledButton } from "@/app/styles/shared/buttons";
import { StyledDialog } from "@/app/styles/shared/dialogs";
import { Participant } from "../../types/participant";

type DeleteConfirmationModalProps = {
  open: boolean;
  participant: Participant | null;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

function DeleteConfirmationModal({
  open,
  participant,
  onClose,
  onConfirm
}: DeleteConfirmationModalProps) {
  const handleConfirm = useCallback(async () => {
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error(error);
    }
  }, [onConfirm, onClose]);

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="delete-participant-modal-title"
      aria-describedby="delete-participant-modal-description"
    >
      <StyledDialog>
        <Typography 
          id="delete-participant-modal-title" 
          variant="h6" 
          component="h2" 
          sx={{ mb: 3 }}
        >
          Delete Participant
        </Typography>
        
        <Typography sx={{ mb: 3 }}>
          Are you sure you want to permanently delete participant{" "}
          <Box sx={{ fontWeight: "bold" }} component="span">
            {participant?.name}
          </Box>
          ? This cannot be undone.
        </Typography>
        
        <Box sx={{ mt: 5, display: "flex", justifyContent: "space-between" }}>
          <StyledButton variant="outlined" onClick={onClose}>
            Cancel
          </StyledButton>
          <StyledButton 
            variant="contained" 
            color="error" 
            onClick={handleConfirm} 
            startIcon={<DeleteIcon />}
          >
            Delete
          </StyledButton>
        </Box>
      </StyledDialog>
    </Modal>
  );
}

export default memo(DeleteConfirmationModal);