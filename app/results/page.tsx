"use client"

import "@/app/styles/global/global.css";

import { useEffect, useState } from "react";
import { Participant } from "../types/participant";
import ResultsTable from "../components/ResultsTable/ResultsTable";
import Loading from "../components/Loading/Loading";
import { getResults } from "../services/results";
import { StyledButton } from "../styles/shared/buttons";

function ResultsView() {
  const [sortedParticipants, setSortedParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const data = await getResults();
        setSortedParticipants(data);
      } catch (error) {
        console.error(error);
        throw new Error("Failed to load results data.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, []);

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="secondary-actions-container">
        <StyledButton variant="contained">
          Print Results
        </StyledButton>
      </div>
      <div className="group-table">
        <ResultsTable participants={sortedParticipants}></ResultsTable>
      </div>
    </>
  )
}

export default ResultsView;