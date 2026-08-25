import { Participant } from "../types/participant";
import { Results } from "../types/results";
import { apiRequest } from "./apiRequest";

const RESULTS_URL = "/api/results";

export async function getResults(): Promise<Participant[]> {
  const results = await apiRequest<Results>(RESULTS_URL);
  return results.participants;
}

export async function deleteResults(): Promise<void> {
  await apiRequest<void>(RESULTS_URL, { method: "DELETE" });
}
