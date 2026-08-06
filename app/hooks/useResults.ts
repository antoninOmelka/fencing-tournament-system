"use client";

import { useEffect, useState } from "react";
import { Participant } from "../types/participant";
import { getResults } from "../services/results";

export function useResults() {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        const data = await getResults();
        setParticipants(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchResults();
  }, []);

  return { participants, isLoading };
}
