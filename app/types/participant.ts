export interface Participant {
    id: number;
    name: string;
    year: string;
    club: string;
    ranking: string;
    groupRanking?: number;
    wins?: number;
    winsRate?: number;
    pointsScored?: number;
    pointsReceived?: number;
    index?: number;
  };