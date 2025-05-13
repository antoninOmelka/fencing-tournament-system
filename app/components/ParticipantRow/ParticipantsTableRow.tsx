import React from "react";
import { IconButton, Table, TableBody, TableRow, TextField, Tooltip } from "@mui/material";
import { StyledTableRow, StyledTableCell } from "../../styles/shared/tables";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { Participant } from "../../types/participant";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { participantSchema } from "../ParticipantsTable/ParticipantsTable";


export type ParaticipantInputsRaw = {
  name: string
  year: string
  club: string
  ranking: string
};

export type ParticipantInputs = {
  name: string
  year: number
  club: string
  ranking: number
};

interface ParticipantsTableRowProps {
  participant: Participant;
  isEditing: boolean;
  newParticipant: ParaticipantInputsRaw;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSaveEdit: (id: number, data: ParticipantInputs) => void;
  onEditParticipant: (id: number) => void;
  onDeleteParticipant: (id: number) => void;
  isActionDisabled: boolean;
  errors: Record<string, string>;
}

const ParticipantsTableRow = ({
  participant,
  isEditing,
  onSaveEdit,
  onEditParticipant,
  onDeleteParticipant,
  isActionDisabled,
}: ParticipantsTableRowProps) => {

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ParticipantInputs>({
    resolver: zodResolver(participantSchema),
    defaultValues: {
      name: participant.name,
      year: participant.year,
      club: participant.club,
      ranking: participant.ranking
    }
  });

  return (
    <StyledTableRow>
      {isEditing ? (
        <StyledTableCell colSpan={5}>
          <form onSubmit={handleSubmit((data: ParticipantInputs) => onSaveEdit(participant.id, data))} style={{ display: "contents" }}>
          <Table>
            <TableBody>
              <TableRow>
                <StyledTableCell className="name">
                  <Tooltip title={errors.name ? "Name must have length from 1 to 25" : ""} arrow>
                    <TextField
                      {...register("name")}
                      error={!!errors.name}
                    />
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell className="year">
                  <Tooltip title={errors.year ? "Year must be in range from 1900 to 2025" : ""} arrow>
                    <TextField
                      {...register("year")}
                      type="number"
                      error={!!errors.year}
                    />
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell className="club">
                  <Tooltip title={errors.club ? "Club must have length from 1 to 25" : ""} arrow>
                    <TextField
                      {...register("club")}
                      error={!!errors.club}
                    />
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell className="ranking">
                  <Tooltip title={errors.ranking ? "Ranking must be in range from 1 to 999" : ""} arrow>
                    <TextField
                      {...register("ranking")}
                      type="number"
                      error={!!errors.ranking}
                    />
                  </Tooltip>
                </StyledTableCell>
                <StyledTableCell className="actions">
                  <IconButton type="submit" aria-label="save">
                    <SaveIcon />
                  </IconButton>
                </StyledTableCell>

              </TableRow>
            </TableBody>
          </Table>
        </form>
        </StyledTableCell>
  ) : (
    <>
      <StyledTableCell className="name">{participant.name}</StyledTableCell>
      <StyledTableCell className="year">{participant.year}</StyledTableCell>
      <StyledTableCell className="club">{participant.club}</StyledTableCell>
      <StyledTableCell className="ranking">{participant.ranking}</StyledTableCell>
      <StyledTableCell className="actions">
        <div className="action-buttons">
          <IconButton
            aria-label="edit"
            disabled={isActionDisabled}
            onClick={() => onEditParticipant(participant.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label="delete"
            disabled={isActionDisabled}
            onClick={() => onDeleteParticipant(participant.id)}
          >
            <DeleteIcon />
          </IconButton>
        </div>
      </StyledTableCell>
    </>
  )
}
    </StyledTableRow >
  );
};

export default React.memo(ParticipantsTableRow, (prevProps, nextProps) => {
  if (
    prevProps.isEditing !== nextProps.isEditing ||
    prevProps.participant.id !== nextProps.participant.id ||
    prevProps.isActionDisabled !== nextProps.isActionDisabled ||
    JSON.stringify(prevProps.errors) !== JSON.stringify(nextProps.errors)
  ) {
    return false;
  }

  if (prevProps.isEditing) {
    return (
      prevProps.newParticipant.name === nextProps.newParticipant.name &&
      prevProps.newParticipant.year === nextProps.newParticipant.year &&
      prevProps.newParticipant.club === nextProps.newParticipant.club &&
      prevProps.newParticipant.ranking === nextProps.newParticipant.ranking
    );
  }

  return true;
});