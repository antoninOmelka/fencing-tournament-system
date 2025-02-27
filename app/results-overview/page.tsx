"use client"

import "@/app/styles/global/global.css";
import { useEffect, useState } from "react";
import { Participant } from "../types/participant";
import { getGroups } from "../services/groups";
import { Group } from "../types/group";
import ResultsTable from "../components/ResultsTable/ResultsTable";

function ResultsOverview() {
    const [groups, setGroups] = useState<Group[]>([]);
    const [sortedFencers, setSortedFencers] = useState<Participant[]>([]);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const data = await getGroups();
        setGroups(data);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to load group data.");
      }

    };

    fetchGroups();
  }, []);

  useEffect(() => {
    async function sortData() {
      try {
        const sortedData = await sortFencers(groups);
        setSortedFencers(sortedData);
        console.log(sortedFencers);

      }
      catch (error) {
        console.error("Sorting Failed", error)
      }
    }

    sortData();
  }, [groups]);

    async function sortFencers(groups: Group[]): Promise<Participant[]> {
        console.log(groups);

        const fencers = groups.flatMap((group) => group.participants);
        return fencers.sort((a, b) => {
          // 1. Number of wins (V)
          if (b.wins !== a.wins) {
            return b.wins - a.wins;
          }
      
          // 2. Victory rate (V/M)
          if (Math.round(b.winsRate * 100) !== Math.round(a.winsRate * 100)) {
            return b.winsRate - a.winsRate;
          }
      
          // 3. Indicator (pointsScored - pointsReceived)
          if (b.index !== a.index) {
            return b.index - a.index;
          }
      
          // 4. Touches scored (pointsScored)
          if (b.pointsScored !== a.pointsScored) {
            return b.pointsScored - a.pointsScored;
          }
      
          // 5. Random as a last resort (rare)
          return Math.random() - 0.5;
        });
      }

    return (
      <div className="matches-overview">
          <ResultsTable participants={sortedFencers}></ResultsTable>
      </div>
    )
}

export default ResultsOverview;