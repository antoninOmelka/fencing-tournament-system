import { z } from "zod";

export const maxParticipantYear = new Date().getFullYear();

export const participantSchema = z.object({
  name: z.string().min(1).max(25),
  year: z.coerce
    .number()
    .min(1900)
    .max(maxParticipantYear)
    .refine((val) => Number.isInteger(val)),
  club: z.string().min(1).max(25),
  ranking: z.coerce
    .number()
    .min(1)
    .max(999)
    .refine((val) => Number.isInteger(val)),
});
