export interface Participant {
    id: number;
    name: string;
    year: number;
    club: string;
    ranking: number;
    groupRanking?: number;
    wins?: number;
    winsRate?: number;
    pointsScored?: number;
    pointsReceived?: number;
    index?: number;
  };