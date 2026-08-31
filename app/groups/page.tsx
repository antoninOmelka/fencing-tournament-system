"use client";

import "@/app/styles/global/global.css";

import { useState } from "react";
import GroupTable from "../components/GroupTable/GroupTable";
import Loading from "../components/Loading/Loading";
import RegenerateGroupsModal from "../components/RegenerateGroupsModal/RegenerateGroupsModal";
import { StyledButton } from "../styles/shared/buttons";
import { toGroupTableView } from "../lib/toGroupTableView";
import { openGroupsPdf } from "../lib/openGroupsPdf";
import { useGroups } from "../hooks/useGroups";
import GroupsIcon from "@mui/icons-material/Groups";
import PrintIcon from "@mui/icons-material/Print";
import { CircularProgress } from "@mui/material";

function GroupTablesView() {
  const { groups, isLoading, isSaving, generateGroups } = useGroups();
  const [regenerateModalOpen, setRegenerateModalOpen] = useState(false);

  if (isLoading) {
    return <Loading />;
  }

  function handleGenerateClick(): void {
    // Regenerating discards entered results — ask first; the initial
    // generation has nothing to lose
    if (groups.length === 0) {
      generateGroups();
    } else {
      setRegenerateModalOpen(true);
    }
  }

  async function handlePrint(): Promise<void> {
    try {
      await openGroupsPdf(groups.map(toGroupTableView));
    } catch (error) {
      console.error("Failed to generate PDF:", error);
    }
  }

  return (
    <>
      <div className="secondary-actions-container">
        <h2 className="page-title">Groups</h2>
        <div className="page-actions">
          {groups.length > 0 && (
            <StyledButton
              variant="contained"
              onClick={handlePrint}
              startIcon={<PrintIcon />}
            >
              Print Groups
            </StyledButton>
          )}
          <StyledButton
            variant="contained"
            onClick={handleGenerateClick}
            disabled={isSaving}
            startIcon={
              isSaving ? (
                <CircularProgress size={16} color="info" />
              ) : (
                <GroupsIcon />
              )
            }
          >
            Generate Groups
          </StyledButton>
        </div>
      </div>
      <div className="groups-container">
        <div>
          {groups.map((group) => (
            <GroupTable key={group.id} view={toGroupTableView(group)} />
          ))}
        </div>
      </div>

      <RegenerateGroupsModal
        open={regenerateModalOpen}
        onClose={() => setRegenerateModalOpen(false)}
        onConfirm={generateGroups}
      />
    </>
  );
}

export default GroupTablesView;
