"use client";

import "@/app/styles/global/global.css";

import { useState } from "react";
import { CircularProgress, MenuItem, TextField } from "@mui/material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ReplayIcon from "@mui/icons-material/Replay";

import Loading from "../components/Loading/Loading";
import PlayoffBracket from "../components/PlayoffBracket/PlayoffBracket";
import PlayoffStandingsTable from "../components/PlayoffStandingsTable/PlayoffStandingsTable";
import RegeneratePlayoffModal from "../components/RegeneratePlayoffModal/RegeneratePlayoffModal";
import { StyledButton } from "../styles/shared/buttons";
import { usePlayoff } from "../hooks/usePlayoff";
import { useResults } from "../hooks/useResults";
import { generatePlayoff } from "../lib/generatePlayoff";
import { toPlayoffView } from "../lib/toPlayoffView";
import { computePlayoffStandings } from "../lib/computePlayoffStandings";

function PlayoffView() {
  const { participants, isLoading: isLoadingResults } = useResults();
  const {
    playoff,
    isLoading,
    isSaving,
    createPlayoff,
    markWinner,
    removePlayoff,
  } = usePlayoff();

  const [advancerCount, setAdvancerCount] = useState<number | null>(null);
  const [regenerateModalOpen, setRegenerateModalOpen] = useState(false);

  if (isLoading || isLoadingResults) {
    return <Loading />;
  }

  if (!playoff) {
    if (participants.length < 2) {
      return (
        <>
          <div className="secondary-actions-container">
            <h2 className="page-title">Playoff</h2>
          </div>
          <p className="playoff-empty">
            At least two ranked participants are needed for a playoff. Generate
            groups and enter their results first.
          </p>
        </>
      );
    }

    const count = advancerCount === null ? participants.length : advancerCount;
    const countOptions = Array.from(
      { length: participants.length - 1 },
      (_, index) => index + 2,
    );
    const preview = generatePlayoff(participants.slice(0, count));

    return (
      <>
        <div className="secondary-actions-container">
          <h2 className="page-title">Playoff</h2>
          <div className="playoff-setup">
            <TextField
              select
              label="Advancing fencers"
              size="small"
              sx={{ width: 180 }}
              value={count}
              onChange={(event) => setAdvancerCount(Number(event.target.value))}
            >
              {countOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <StyledButton
              variant="contained"
              onClick={() => createPlayoff(participants.slice(0, count))}
              disabled={isSaving}
              startIcon={
                isSaving ? (
                  <CircularProgress size={16} color="info" />
                ) : (
                  <AccountTreeIcon />
                )
              }
            >
              Generate Playoff
            </StyledButton>
          </div>
        </div>
        <h2 className="playoff-preview-title">Preview</h2>
        <PlayoffBracket view={toPlayoffView(preview)} />
      </>
    );
  }

  const standings = computePlayoffStandings(playoff);

  return (
    <>
      <div className="secondary-actions-container">
        <h2 className="page-title">Playoff</h2>
        <StyledButton
          variant="contained"
          onClick={() => setRegenerateModalOpen(true)}
          disabled={isSaving}
          startIcon={<ReplayIcon />}
        >
          Regenerate Playoff
        </StyledButton>
      </div>
      <PlayoffBracket
        view={toPlayoffView(playoff)}
        onWinnerClick={isSaving ? undefined : markWinner}
      />
      {standings.length > 0 && (
        <>
          <h2 className="playoff-standings-title">Final Standings</h2>
          <PlayoffStandingsTable rows={standings} />
        </>
      )}

      <RegeneratePlayoffModal
        open={regenerateModalOpen}
        onClose={() => setRegenerateModalOpen(false)}
        onConfirm={removePlayoff}
      />
    </>
  );
}

export default PlayoffView;
