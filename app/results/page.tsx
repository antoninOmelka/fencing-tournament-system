"use client";

import "@/app/styles/global/global.css";

import { useMemo } from "react";
import ResultsTable from "../components/ResultsTable/ResultsTable";
import Loading from "../components/Loading/Loading";
import { StyledButton } from "../styles/shared/buttons";
import { useResults } from "../hooks/useResults";
import { toResultsTableRows } from "../lib/toResultsTableRows";
import { openResultsPdf } from "../lib/openResultsPdf";

function ResultsView() {
  const { participants, isLoading } = useResults();

  const rows = useMemo(() => toResultsTableRows(participants), [participants]);

  async function handlePrint(): Promise<void> {
    try {
      await openResultsPdf(rows);
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
        <StyledButton variant="contained" onClick={handlePrint}>
          Print Results
        </StyledButton>
      </div>
      <div className="group-table">
        <ResultsTable rows={rows} />
      </div>
    </>
  );
}

export default ResultsView;
