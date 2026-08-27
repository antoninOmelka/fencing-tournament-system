"use client";

import "@/app/styles/global/global.css";

import { useEffect, useState } from "react";
import EditableGroupTable from "@/app/components/EditableGroupTable/EditableGroupTable";
import Loading from "@/app/components/Loading/Loading";
import UnsavedChangesModal from "@/app/components/UnsavedChangesModal/UnsavedChangesModal";
import { StyledButton } from "@/app/styles/shared/buttons";
import { useParams, useRouter } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useGroup } from "@/app/hooks/useGroup";

function EditableGroupTableView() {
  const params = useParams();
  const router = useRouter();
  const groupId = params?.groupsId ? Number(params.groupsId) : null;
  const { group, setGroup, isLoading, isSaving, isDirty, saveGroup } =
    useGroup(groupId);
  const [isValid, setIsValid] = useState<boolean>(true);
  const [leaveModalOpen, setLeaveModalOpen] = useState<boolean>(false);

  // warn before the tab is closed or reloaded with unsaved results
  useEffect(() => {
    if (!isDirty) {
      return;
    }
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty]);

  if (isLoading) {
    return <Loading />;
  }

  if (!group) {
    return <p>Group not found</p>;
  }

  return (
    <>
      <div className="secondary-actions-container page-header-stacked">
        <Link
          className="back-link"
          href={"/groups"}
          onClick={(event) => {
            if (isDirty) {
              event.preventDefault();
              setLeaveModalOpen(true);
            }
          }}
        >
          <ArrowBackIcon fontSize="small" />
          <span>Back</span>
        </Link>
        <div className="page-header-row">
          <h2 className="page-title">Group {group.id}</h2>
          <StyledButton
            variant="contained"
            onClick={saveGroup}
            disabled={isSaving || !isValid || !isDirty}
            startIcon={
              isSaving ? (
                <CircularProgress size={16} color="info" />
              ) : (
                <SaveIcon />
              )
            }
          >
            Save
          </StyledButton>
        </div>
      </div>
      <div className="group-table">
        <EditableGroupTable
          group={group}
          onGroupChange={setGroup}
          setIsValid={setIsValid}
        />
      </div>

      <UnsavedChangesModal
        open={leaveModalOpen}
        onClose={() => setLeaveModalOpen(false)}
        onConfirm={() => router.push("/groups")}
      />
    </>
  );
}

export default EditableGroupTableView;
