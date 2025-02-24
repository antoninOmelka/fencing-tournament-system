import { Group } from "../types/group";

const GROUPS_URL = "api/groups"

export async function getGroups(): Promise<Group[]> {
    try {
        const response = await fetch(GROUPS_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function postGroups(groups: Group[]): Promise<void> {
    try {
        await fetch(GROUPS_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(groups),
          });
    } catch (error) {
        console.error(error);
    }
}