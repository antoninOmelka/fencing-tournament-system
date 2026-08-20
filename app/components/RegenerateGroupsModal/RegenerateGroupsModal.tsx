import { memo, useCallback } from "react";
import { Modal, Box } from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";

import { StyledButton } from "@/app/styles/shared/buttons";
import {
  StyledDialog,
  StyledDialogText,
  StyledDialogTitle,
} from "@/app/styles/shared/dialogs";

type RegenerateGroupsModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
};

function RegenerateGroupsModal({
  open,
  onClose,
  onConfirm,
}: RegenerateGroupsModalProps) {
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
      aria-labelledby="regenerate-groups-modal-title"
      aria-describedby="regenerate-groups-modal-description"
    >
      <StyledDialog>
        <StyledDialogTitle
          id="regenerate-groups-modal-title"
          variant="h6"
          component="h2"
        >
          Regenerate Groups
        </StyledDialogTitle>

        <StyledDialogText>
          Are you sure you want to generate new groups? All entered group
          results, the overall results and the playoff bracket will be
          discarded. This cannot be undone.
        </StyledDialogText>

        <Box sx={{ mt: 5, display: "flex", justifyContent: "space-between" }}>
          <StyledButton variant="outlined" onClick={onClose}>
            Cancel
          </StyledButton>
          <StyledButton
            variant="contained"
            color="error"
            onClick={handleConfirm}
            startIcon={<GroupsIcon />}
          >
            Regenerate
          </StyledButton>
        </Box>
      </StyledDialog>
    </Modal>
  );
}

export default memo(RegenerateGroupsModal);
