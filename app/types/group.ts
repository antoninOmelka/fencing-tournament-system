import { Participant } from "./participant";

export interface Group {
    // TODO ID required
    id?: string;
    participants: Participant[];
    results?: string[][]
} 