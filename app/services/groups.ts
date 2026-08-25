import { Group } from "../types/group";
import { apiRequest } from "./apiRequest";

const GROUPS_URL = "/api/groups";

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

export async function updateGroup(
  groupId: number,
  groupData: Group,
): Promise<Group | null> {
  return apiRequest<Group>(`${GROUPS_URL}/${groupId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(groupData),
  });
}
