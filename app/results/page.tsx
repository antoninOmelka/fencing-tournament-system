"use client"

import "@/app/styles/global/global.css";

import { useEffect, useState } from "react";
import { Participant } from "../types/participant";
import { getGroups } from "../services/groups";
import { Group } from "../types/group";
import ResultsTable from "../components/ResultsTable/ResultsTable";
import Loading from "../components/Loading/Loading";

function ResultsView() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [sortedFencers, setSortedFencers] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchGroups() {
      try {
        const data = await getGroups();
        setGroups(data);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to load group data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchGroups();
  }, []);

  useEffect(() => {
    async function sortData() {
      try {
        const sortedData = await sortFencers(groups);
        setSortedFencers(sortedData);
      }
      catch (error) {
        console.error("Sorting Failed", error);
      }
    }

    if (groups.length) {
      sortData();
    }
  }, [groups]);

  async function sortFencers(groups: Group[]): Promise<Participant[]> {
    const fencers = groups.flatMap((group) => group.participants);
    return fencers.sort((a, b) => {
      // 1. Number of wins (V)
      if (b.wins !== a.wins) {
        return (b.wins ?? 0) - (a.wins ?? 0);
      }

      // 2. Victory rate (V/M)
      if (Math.round((b.winsRate ?? 0) * 100) !== Math.round((a.winsRate ?? 0) * 100)) {
        return (b.winsRate ?? 0) - (a.winsRate ?? 0);
      }

      // 3. Indicator (pointsScored - pointsReceived)
      if (b.index !== a.index) {
        return (b.index ?? 0) - (a.index ?? 0);
      }

      // 4. Touches scored (pointsScored)
      if (b.pointsScored !== a.pointsScored) {
        return (b.pointsScored ?? 0) - (a.pointsScored ?? 0);
      }

      // 5. Random as a last resort (rare)
      return Math.random() - 0.5;
    });
  }

  if (isLoading) {
    return <Loading />
  }

  return (
    <div className="groups-container">
      <ResultsTable participants={sortedFencers}></ResultsTable>
    </div>
  )
}

export default ResultsView;