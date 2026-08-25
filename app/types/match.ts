export interface Match {
  firstId: number;
  secondId: number;
  winnerId?: number; // undefined = bout not fenced yet
  firstScore?: number; // touches scored by firstId; winner defaults to 5 ("V")
  secondScore?: number;
}
