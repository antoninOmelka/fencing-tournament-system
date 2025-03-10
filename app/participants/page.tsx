"use client"

import "@/app/styles/global/global.css";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { deleteParticipant, getParticipants, updateParticipant } from "../services/participants";
import ParticipantsTable from "../components/ParticipantsTable/ParticipantsTable";
import Loading from "../components/Loading/Loading";
import { Participant } from "../types/participant";
import { StyledButton } from "../styles/shared/buttons";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { z } from "zod";

const participantSchema = z.object({
  name: z.string().min(1).max(25),
  year: z.coerce.number().min(1900).max(2025).refine(val => Number.isInteger(val)),
  club: z.string().min(1).max(25),
  ranking: z.coerce.number().min(1).max(999).refine(val => Number.isInteger(val)),
});

function ParticipantsView() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [newParticipant, setNewParticipant] = useState({ name: "", year: "", club: "", ranking: '' });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchParticipants() {
      try {
        const data = await getParticipants();
        setParticipants(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchParticipants();
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewParticipant(prev => ({ ...prev, [name]: value }));
  }, []);

  const handleAddParticipant = useCallback(() => {
    const participant: Participant = {
      id: Date.now(), // Use timestamp as a simple unique id
      ...newParticipant
    };
    setEditingId(participant.id);
    setParticipants(prev => [participant, ...prev]);
    setNewParticipant({ name: "", year: "", club: "", ranking: "" });
    setErrors({});
  }, [newParticipant]);

  const handleEditParticipant = useCallback((id: number) => {
    setEditingId(id);
    const participantToEdit = participants.find(p => p.id === id);
    if (participantToEdit) {
      setNewParticipant(participantToEdit);
    }
  }, [participants]);

  const handleSaveEdit = useCallback(async () => {
    try {
      const updatedParticipants = participants.map(p =>
        p.id === editingId ? { ...newParticipant, id: p.id } : p
      );

      const participantToSave = updatedParticipants.find(p => p.id === editingId);
      if (participantToSave) {
        participantSchema.parse(participantToSave);
        await updateParticipant(participantToSave);
      }

      setParticipants(updatedParticipants);
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
  }, [participants, editingId, newParticipant]);

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
  
  const participantsByAlphabet = useMemo(() =>
    participants.length > 0 ?
      [...participants].sort((a, b) => a.name.localeCompare(b.name)) : [],
    [participants]
  );

  const generatePDF = useCallback((participants: Participant[]) => {
    const doc = new jsPDF();
    const tableData = {
      head: [["Name", "Year", "Club", "Ranking"]],
      body: participants.map(p => [p.name, p.year, p.club, p.ranking]),
    };

    doc.autoTable(tableData);
    const pdfOutput = doc.output("blob");
    const pdfUrl = URL.createObjectURL(pdfOutput);
    window.open(pdfUrl, "_blank");
  }, []);

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="secondary-actions-container">
        <StyledButton variant="contained" onClick={() => { generatePDF(participantsByAlphabet) }}>
          Print Participants
        </StyledButton>
      </div>
      <div className="group-table">
        <div className="table-button-container">
          <StyledButton variant="contained" onClick={handleAddParticipant} disabled={editingId ? true : false}>
            Add New
          </StyledButton>
        </div>
        <ParticipantsTable
          participants={participantsByAlphabet}
          onEditParticipant={handleEditParticipant}
          onDeleteParticipant={handleDeleteParticipant}
          editingId={editingId}
          newParticipant={newParticipant}
          onInputChange={handleInputChange}
          onSaveEdit={handleSaveEdit}
          errors={errors} />
      </div>
    </>
  );
}

export default React.memo(ParticipantsView);