"use client"

import "@/app/styles/global/global.css";

import React, { useState, useMemo, useEffect, useCallback } from "react";
import { getParticipants } from "../services/participants";
import ParticipantsTable from "../components/ParticipantsTable/ParticipantsTable";
import Loading from "../components/Loading/Loading";
import { Participant } from "../types/participant";
import { StyledButton } from "../styles/shared/buttons";
import jsPDF from "jspdf";
import "jspdf-autotable";

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
        <ParticipantsTable inicialParticipants={participantsByAlphabet} />
      </div>
    </>
  );
}

export default React.memo(ParticipantsView);