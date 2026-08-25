import { Playoff } from "../types/playoff";
import { apiRequest } from "./apiRequest";

const PLAYOFF_URL = "/api/playoff";

export async function getPlayoff(): Promise<Playoff | null> {
  return apiRequest<Playoff | null>(PLAYOFF_URL);
}

export async function postPlayoff(playoff: Playoff): Promise<void> {
  await apiRequest<void>(PLAYOFF_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(playoff),
  });
}

export async function deletePlayoff(): Promise<void> {
  await apiRequest<void>(PLAYOFF_URL, { method: "DELETE" });
}
