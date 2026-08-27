import { memo } from "react";
import { Modal, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

import { StyledButton } from "@/app/styles/shared/buttons";
import {
  StyledDialog,
  StyledDialogText,
  StyledDialogTitle,
} from "@/app/styles/shared/dialogs";

type UnsavedChangesModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

function UnsavedChangesModal({
  open,
  onClose,
  onConfirm,
}: UnsavedChangesModalProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="unsaved-changes-modal-title"
      aria-describedby="unsaved-changes-modal-description"
    >
      <StyledDialog>
        <StyledDialogTitle
          id="unsaved-changes-modal-title"
          variant="h6"
          component="h2"
        >
          Unsaved Changes
        </StyledDialogTitle>

        <StyledDialogText>
          This group has unsaved results. If you leave now, the changes will be
          discarded.
        </StyledDialogText>

        <Box sx={{ mt: 5, display: "flex", justifyContent: "space-between" }}>
          <StyledButton variant="outlined" onClick={onClose}>
            Cancel
          </StyledButton>
          <StyledButton
            variant="contained"
            color="error"
            onClick={onConfirm}
            startIcon={<DeleteIcon />}
          >
            Discard &amp; Leave
          </StyledButton>
        </Box>
      </StyledDialog>
    </Modal>
  );
}

export default memo(UnsavedChangesModal);
