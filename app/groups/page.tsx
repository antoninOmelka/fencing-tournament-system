"use client"

import "@/app/styles/global/global.css";

import GroupTable from "../components/GroupTable/GroupTable";
import Loading from "../components/Loading/Loading";
import { StyledButton } from "../styles/shared/buttons";
import { toGroupTableView } from "../lib/toGroupTableView";
import { useGroups } from "../hooks/useGroups";
import GroupsIcon from '@mui/icons-material/Groups';
import { CircularProgress } from "@mui/material";

function GroupTablesView() {
    const { groups, isLoading, isSaving, generateGroups } = useGroups();

    if (isLoading) {
        return <Loading />
    }

    return (
        <>
            <div className="secondary-actions-container">
                <StyledButton
                    variant="contained"
                    onClick={() => generateGroups()}
                    disabled={isSaving}
                    startIcon={isSaving ? <CircularProgress size={16} color="info" /> : <GroupsIcon />}
                >
                   Generate Groups
                </StyledButton>
            </div>
            <div className="groups-container">
                <div>
                    {groups.map((group) => (
                        <GroupTable key={group.id} view={toGroupTableView(group)} />
                    ))}
                </div>
            </div>
        </>
    );
}

export default GroupTablesView;
