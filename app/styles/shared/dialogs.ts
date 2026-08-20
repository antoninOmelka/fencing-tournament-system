import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";

export const StyledDialogTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.black,
  marginBottom: theme.spacing(3),
})) as typeof Typography;

export const StyledDialogText = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.black,
  marginBottom: theme.spacing(3),
})) as typeof Typography;

export const StyledDialog = styled(Box)(({ theme }) => ({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  backgroundColor: theme.palette.background.paper,
  padding: 20,
  boxShadow: theme.shadows[24],
  borderRadius: 5,
}));
