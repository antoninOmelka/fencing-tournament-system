declare module "roundrobin" {
    function roundrobin<T>(numTeams: number, teams?: T[]): T[][];
    export = roundrobin;
  }