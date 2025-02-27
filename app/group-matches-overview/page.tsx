'use client'

import { useEffect, useState } from "react";
import { getGroups } from "../services/groups";
import { Group } from "../types/group";
import MatchesTable from "../components/MatchesTable/page";
import { StyledButton } from "../styles/shared/buttons";


function GroupMatchesOverview() {
    const [groups, setGroups] = useState<Group[]>([]);

    useEffect(() => {
        async function fetchGroups() {
            try {
                const data = await getGroups();
                setGroups(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchGroups();
    }, []);

    return (
        <>
            <StyledButton variant="contained" href="/results-overview">Generate Results</StyledButton>
            <div className="matches-overview">
                {groups.map((group) => (
                    <MatchesTable key={group.participants.map(p => p.id).join('-')} id={group.id} participants={group.participants} results={group.results}></MatchesTable>
                ))}
            </div>
        </>
    );
}

export default GroupMatchesOverview;