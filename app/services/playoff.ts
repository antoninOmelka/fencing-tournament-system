import { Playoff } from "../types/playoff";

const PLAYOFF_URL = "/api/playoff";

async function apiRequest<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      const errorBody = await response.json().catch(() => null);
      throw new Error(
        `HTTP error! status: ${response.status}, message: ${errorBody?.message || response.statusText}`,
      );
    }
    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

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
