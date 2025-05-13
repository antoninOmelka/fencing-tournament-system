import "./../../styles/global/global.css";

import React, { useCallback, useState } from "react";
import { Table, TableBody, TableHead, TableRow, Paper } from "@mui/material";
import { StyledTableContainer, StyledTableCell } from "../../styles/shared/tables";
import { Participant } from "../../types/participant";
import ParticipantsTableRow, { ParticipantInputs, ParaticipantInputsRaw } from "../ParticipantRow/ParticipantsTableRow";
import { StyledButton } from "@/app/styles/shared/buttons";
import { z } from "zod";
import { deleteParticipant, updateParticipant } from "@/app/services/participants";

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
  const [newParticipant, setNewParticipant] = useState<ParaticipantInputsRaw>({ name: "", year: "", club: "", ranking: "" });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const isActionDisabled = Boolean(editingId);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewParticipant(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAddParticipant = useCallback(() => {
    const participant: Participant = {
      id: Date.now(), // Use timestamp as a simple unique id
      name: newParticipant.name,
      year: Number(newParticipant.year),
      club: newParticipant.club,
      ranking: Number(newParticipant.ranking)
    };
    setEditingId(participant.id);
    setParticipants(prev => [participant, ...prev]);
    setNewParticipant({ name: "", year: "", club: "", ranking: "" });
    setErrors({});
  }, [newParticipant, setParticipants]);

  const handleEditParticipant = useCallback((id: number) => {
    setEditingId(id);
    const participantToEdit = participants.find(p => p.id === id);
    if (participantToEdit) {
        setNewParticipant({
          name: participantToEdit.name,
          year: participantToEdit.year.toString(),
          club: participantToEdit.club,
          ranking: participantToEdit.ranking.toString()
      });
    }
  }, [participants]);

  const handleSaveEdit = useCallback(async (id: number, data: ParticipantInputs) => {
    try {
      const updatedParticipant = { ...data, id };
      participantSchema.parse(updatedParticipant);
      await updateParticipant(updatedParticipant);

      setParticipants(prev =>
        prev.map(p => (p.id === id ? updatedParticipant : p))
      );
      setEditingId(null);
      setNewParticipant({ name: "", year: "", club: "", ranking: "" });
      setErrors({});
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors = error.errors.reduce((acc, err) => {
          acc[err.path.join(".")] = err.message;
          return acc;
        }, {} as Record<string, string>);
        setErrors(newErrors);
      } else {
        console.error(error);
      }
    }
  }, []);

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
        <StyledButton variant="contained" onClick={handleAddParticipant} disabled={editingId ? true : false}>
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
                isEditing={editingId === participant.id}
                newParticipant={newParticipant}
                onInputChange={handleInputChange}
                onSaveEdit={handleSaveEdit}
                onEditParticipant={handleEditParticipant}
                onDeleteParticipant={handleDeleteParticipant}
                isActionDisabled={isActionDisabled}
                errors={errors}
              />
            ))}
          </TableBody>
        </Table>
      </StyledTableContainer>
    </>

  );
}

export default React.memo(ParticipantsTable);