"use client";

import "@/app/styles/global/global.css";
import { useMemo } from "react";
import ParticipantsTable from "../components/ParticipantsTable/ParticipantsTable";
import Loading from "../components/Loading/Loading";
import { StyledButton } from "../styles/shared/buttons";
import { useParticipants } from "../hooks/useParticipants";
import { toParticipantRowViews } from "../lib/toParticipantRowViews";
import { openParticipantsPdf } from "../lib/openParticipantsPdf";
import PrintIcon from "@mui/icons-material/Print";

function ParticipantsView() {
  const {
    participants,
    isLoading,
    addParticipant,
    editParticipant,
    removeParticipant,
  } = useParticipants();

  const rows = useMemo(
    () => toParticipantRowViews(participants),
    [participants],
  );

  async function handlePrint(): Promise<void> {
    try {
      await openParticipantsPdf(rows);
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  }

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <div className="secondary-actions-container">
        <h2 className="page-title">Participants</h2>
        <StyledButton
          variant="contained"
          onClick={handlePrint}
          startIcon={<PrintIcon />}
        >
          Print Participants
        </StyledButton>
      </div>
      <div className="group-table">
        <ParticipantsTable
          rows={rows}
          onAdd={addParticipant}
          onUpdate={editParticipant}
          onDelete={removeParticipant}
        />
      </div>
    </>
  );
}

export default ParticipantsView;
