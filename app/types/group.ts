import { Match } from "./match";
import { Participant } from "./participant";

export interface Group {
  id: number;
  participants: Participant[];
  matches?: Match[]; // source of truth for bout results
  results?: string[][]; // derived view of matches; edit buffer in the UI
}
