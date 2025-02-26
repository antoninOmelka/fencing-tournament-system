import { Group } from "../types/group";

const GROUPS_URL = "http://localhost:3000/api/groups";

async function apiRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        const errorBody = await response.json().catch(() => null);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorBody?.message || response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error("API request failed:", error);
      throw error;
    }
  }

export async function getGroups(): Promise<Group[]> {
  return apiRequest<Group[]>(GROUPS_URL);
}

export async function getGroup(id: number): Promise<Group | null> {
  return apiRequest<Group>(`${GROUPS_URL}/${id}`);
}

export async function postGroups(groups: Group[]): Promise<void> {
  await apiRequest<void>(GROUPS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(groups),
  });
}

export async function updateGroup(groupId: number, groupData: Group): Promise<Group | null> {
  return apiRequest<Group>(`${GROUPS_URL}/${groupId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(groupData),
  });
}
