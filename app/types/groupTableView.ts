export type GroupTableRow = {
  id: number;
  order: number;
  name: string;
  cells: string[];
  wins: string;
  winsRate: string;
  scored: string;
  received: string;
  index: string;
};

export type GroupTableMatch = {
  firstOrder: number;
  firstName: string;
  firstResult: string;
  secondOrder: number;
  secondName: string;
  secondResult: string;
};

export type GroupTableView = {
  id: number;
  orders: number[];
  rows: GroupTableRow[];
  matches: GroupTableMatch[];
};
