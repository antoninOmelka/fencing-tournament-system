import { Participant } from "./participant";

export interface Group {
    id: number;
    participants: Participant[];
    results: string[][];
} 