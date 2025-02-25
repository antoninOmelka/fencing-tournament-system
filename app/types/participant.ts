export interface Participant {
    id: number;
    name: string;
    year: number;
    club: string;
    ranking: number;
    groupRanking?: number;
    isPresent: boolean;
  };