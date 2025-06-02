"use client";

import "@/app/styles/global/global.css";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { getParticipants, updateParticipant, deleteParticipant } from "../services/participants";
import ParticipantsTable from "../components/ParticipantsTable/ParticipantsTable";
import Loading from "../components/Loading/Loading";
import { Participant } from "../types/participant";
import { StyledButton } from "../styles/shared/buttons";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ParticipantInputs } from "../components/ParticipantRow/ParticipantsTableRow";

function ParticipantsView() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

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

  const participantsByAlphabet = useMemo(() =>
    [...participants].sort((a, b) => a.name.localeCompare(b.name)),
    [participants]
  );

  const handleAdd = useCallback(async (data: ParticipantInputs) => {
    try {
      const newParticipant: Participant = {
        id: Date.now(),
        ...data
      };
      await updateParticipant(newParticipant);
      setParticipants(prev => [...prev, newParticipant]);
    } catch (error) {
      console.error("Failed to add participant:", error)
    }
  }, []);

  const handleUpdate = useCallback(async (id: number, data: ParticipantInputs) => {
    try {
      const updatedParticipant = { ...data, id };
      await updateParticipant(updatedParticipant);
      setParticipants(prev =>
        prev.map(p => (p.id === id ? updatedParticipant : p))
      );
    } catch (error) {
      console.error("Failed to update participant:", error)
    }
  }, []);

  const handleDelete = useCallback(async (id: number) => {
    try {
      await deleteParticipant(String(id));
      setParticipants(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete participant:", error)
    }
  }, []);

  const generatePDF = useCallback(() => {
    try {
      const doc = new jsPDF();
      const tableData = {
        head: [["Name", "Year", "Club", "Ranking"]],
        body: participantsByAlphabet.map(p => [p.name, p.year, p.club, p.ranking]),
      };

      autoTable(doc, tableData);
      const pdfUrl = doc.output("bloburl");
      window.open(pdfUrl, "_blank");
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  }, [participantsByAlphabet]);

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="secondary-actions-container">
        <StyledButton variant="contained" onClick={generatePDF}>
          Print Participants
        </StyledButton>
      </div>
      <div className="group-table">
        <ParticipantsTable
          participants={participantsByAlphabet}
          onAdd={handleAdd}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
        />
      </div>
    </>
  );
}

export default React.memo(ParticipantsView);
