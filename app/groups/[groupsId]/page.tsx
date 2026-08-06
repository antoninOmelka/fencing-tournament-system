"use client";

import "@/app/styles/global/global.css";

import { useState } from "react";
import EditableGroupTable from "@/app/components/EditableGroupTable/EditableGroupTable";
import Loading from "@/app/components/Loading/Loading";
import { StyledButton } from "@/app/styles/shared/buttons";
import { useParams } from "next/navigation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Link from "next/link";
import { CircularProgress } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { useGroup } from "@/app/hooks/useGroup";

function EditableGroupTableView() {
  const params = useParams();
  const groupId = params?.groupsId ? Number(params.groupsId) : null;
  const { group, setGroup, isLoading, isSaving, saveGroup } = useGroup(groupId);
  const [isValid, setIsValid] = useState<boolean>(true);

  if (isLoading) {
    return <Loading />;
  }

  if (!group) {
    return <p>Group not found</p>;
  }

  return (
    <>
      <div className="back-link-container">
        <Link className="back-link" href={"/groups"}>
          <ArrowBackIcon fontSize="small" />
          <span>Back</span>
        </Link>
      </div>
      <div className="group-table">
        <div className="table-button-container">
          <StyledButton
            variant="contained"
            onClick={saveGroup}
            disabled={isSaving || !isValid}
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
        <EditableGroupTable
          group={group}
          onGroupChange={setGroup}
          setIsValid={setIsValid}
        />
      </div>
    </>
  );
}

export default EditableGroupTableView;
