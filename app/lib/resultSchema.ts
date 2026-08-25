import { z } from "zod";

// FIE notation: "V" is a victory with the full 5 touches; the score is added
// only when the bout ended short of it ("V0"–"V4", "V5" is tolerated as an
// explicit spelling of "V"). A defeat always carries the loser's touches
// ("D0"–"D4") — the loser can never reach 5.
export const resultSchema = z.string().regex(/^(V[0-5]?|D[0-4])$/);
