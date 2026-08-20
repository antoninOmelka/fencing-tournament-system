import { memo, useCallback } from "react";
import { Modal, Box } from "@mui/material";
import ReplayIcon from "@mui/icons-material/Replay";

import { StyledButton } from "@/app/styles/shared/buttons";
import {
  StyledDialog,
  StyledDialogText,
  StyledDialogTitle,
} from "@/app/styles/shared/dialogs";

type RegeneratePlayoffModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

function RegeneratePlayoffModal({
  open,
  onClose,
  onConfirm,
}: RegeneratePlayoffModalProps) {
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
      aria-labelledby="regenerate-playoff-modal-title"
      aria-describedby="regenerate-playoff-modal-description"
    >
      <StyledDialog>
        <StyledDialogTitle
          id="regenerate-playoff-modal-title"
          variant="h6"
          component="h2"
        >
          Regenerate Playoff
        </StyledDialogTitle>

        <StyledDialogText>
          Are you sure you want to discard the current bracket? All recorded
          playoff results will be lost.
        </StyledDialogText>

        <Box sx={{ mt: 5, display: "flex", justifyContent: "space-between" }}>
          <StyledButton variant="outlined" onClick={onClose}>
            Cancel
          </StyledButton>
          <StyledButton
            variant="contained"
            color="error"
            onClick={handleConfirm}
            startIcon={<ReplayIcon />}
          >
            Regenerate
          </StyledButton>
        </Box>
      </StyledDialog>
    </Modal>
  );
}

export default memo(RegeneratePlayoffModal);
