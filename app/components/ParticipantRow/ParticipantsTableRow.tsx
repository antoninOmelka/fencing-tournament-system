import { memo } from "react";
import { IconButton } from "@mui/material";
import { StyledTableRow, StyledTableCell } from "../../styles/shared/tables";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { ParticipantRowView } from "../../types/participantRowView";

type ParticipantsTableRowProps = {
  row: ParticipantRowView;
  onEdit: (row: ParticipantRowView) => void;
  onDelete: (row: ParticipantRowView) => void;
};

function ParticipantsTableRow({ row, onEdit, onDelete }: ParticipantsTableRowProps) {
  return (
    <StyledTableRow>
      <StyledTableCell className="name">{row.name}</StyledTableCell>
      <StyledTableCell className="year">{row.year}</StyledTableCell>
      <StyledTableCell className="club">{row.club}</StyledTableCell>
      <StyledTableCell className="ranking">{row.ranking}</StyledTableCell>
      <StyledTableCell className="actions">
        <div className="action-buttons">
          <IconButton
            aria-label="edit"
            onClick={() => onEdit(row)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            onClick={() => onDelete(row)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </StyledTableCell>
    </StyledTableRow>
  );
}

export default memo(ParticipantsTableRow);
