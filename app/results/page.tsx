"use client"

import "@/app/styles/global/global.css";

import ResultsTable from "../components/ResultsTable/ResultsTable";
import Loading from "../components/Loading/Loading";
import { useResults } from "../hooks/useResults";
import { toResultsTableRows } from "../lib/toResultsTableRows";

function ResultsView() {
  const { participants, isLoading } = useResults();

  if (isLoading) {
    return <Loading />
  }

  return (
    <>
      <div className="secondary-actions-container">
      </div>
      <div className="group-table">
        <ResultsTable rows={toResultsTableRows(participants)} />
      </div>
    </>
  )
}

export default ResultsView;
