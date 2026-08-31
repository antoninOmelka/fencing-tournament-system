export type PlayoffSideView = {
  participantId: number | null;
  seed: number | null;
  label: string;
  isWinner: boolean;
};

export type PlayoffMatchView = {
  id: number;
  isDecided: boolean;
  isSelectable: boolean;
  first: PlayoffSideView;
  second: PlayoffSideView;
};

export type PlayoffRoundView = {
  title: string;
  matches: PlayoffMatchView[];
};

export type PlayoffView = {
  rounds: PlayoffRoundView[];
};

export type PlayoffStandingRow = {
  id: number;
  place: number;
  name: string;
  year: number;
  club: string;
};
