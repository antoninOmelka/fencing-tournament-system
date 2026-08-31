"use client";

import "@/app/styles/global/global.css";

import { useMemo } from "react";
import ResultsTable from "../components/ResultsTable/ResultsTable";
import Loading from "../components/Loading/Loading";
import { StyledButton } from "../styles/shared/buttons";
import { useResults } from "../hooks/useResults";
import { toResultsTableRows } from "../lib/toResultsTableRows";
import { openResultsPdf } from "../lib/openResultsPdf";
import PrintIcon from "@mui/icons-material/Print";

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
        <h2 className="page-title">Group Results</h2>
        <StyledButton
          variant="contained"
          onClick={handlePrint}
          startIcon={<PrintIcon />}
        >
          Print Group Results
        </StyledButton>
      </div>
      <div className="group-table">
        <ResultsTable rows={rows} />
      </div>
    </>
  );
}

export default ResultsView;
