"use client";

import "@/app/styles/global/global.css";

import { useMemo } from "react";
import PrintIcon from "@mui/icons-material/Print";

import Loading from "../components/Loading/Loading";
import PlayoffStandingsTable from "../components/PlayoffStandingsTable/PlayoffStandingsTable";
import { StyledButton } from "../styles/shared/buttons";
import { usePlayoff } from "../hooks/usePlayoff";
import { computePlayoffStandings } from "../lib/computePlayoffStandings";
import { openPlayoffResultsPdf } from "../lib/openPlayoffResultsPdf";

function PlayoffResultsView() {
  const { playoff, isLoading } = usePlayoff();

  const standings = useMemo(
    () => (playoff ? computePlayoffStandings(playoff) : []),
    [playoff],
  );

  async function handlePrint(): Promise<void> {
    try {
      await openPlayoffResultsPdf(standings);
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
        <h2 className="page-title">Playoff Results</h2>
        {standings.length > 0 && (
          <StyledButton
            variant="contained"
            onClick={handlePrint}
            startIcon={<PrintIcon />}
          >
            Print Playoff Results
          </StyledButton>
        )}
      </div>
      {standings.length > 0 ? (
        <div className="group-table">
          <PlayoffStandingsTable rows={standings} />
        </div>
      ) : (
        <p className="playoff-empty">
          Final standings appear once the playoff final is decided.
        </p>
      )}
    </>
  );
}

export default PlayoffResultsView;
