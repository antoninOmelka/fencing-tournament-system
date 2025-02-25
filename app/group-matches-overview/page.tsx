'use client'

import { useEffect, useState } from "react";
import { getGroups } from "../services/groups";
import { Group } from "../types/group";
import MatchesTable from "../components/MatchesTable/page";


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
        <div className="matches-overview">
            {groups.map((group) => (
                <MatchesTable key={group.participants.map(p => p.id).join('-')} participants={group.participants} results={group.results}></MatchesTable>
            ))}
        </div>
    );
}

export default GroupMatchesOverview;