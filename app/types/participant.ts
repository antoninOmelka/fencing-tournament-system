export interface Participant {
  id: number;
  name: string;
  year: number;
  club: string;
  ranking: number;
  drawNumber?: number; // lot drawn once when groups are generated
  groupRanking?: number;
  wins?: number;
  winsRate?: number;
  pointsScored?: number;
  pointsReceived?: number;
  index?: number;
}
