import { Match } from "./match";
import { Participant } from "./participant";

export interface Group {
  id: number;
  participants: Participant[];
  results: string[][];
  matches?: Match[];
}
