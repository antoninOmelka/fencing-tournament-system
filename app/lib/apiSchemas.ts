import { z } from "zod";
import { participantSchema } from "./participantSchema";

// Validation for data crossing the API boundary. The UI validates its own
// forms; these schemas are the last line of defence before the storage files.

export const storedParticipantSchema = participantSchema.extend({
  id: z.number().int().positive(),
  drawNumber: z.number().int().positive().optional(),
  groupRanking: z.number().int().positive().optional(),
  wins: z.number().int().min(0).optional(),
  winsRate: z.number().min(0).max(1).optional(),
  pointsScored: z.number().int().min(0).optional(),
  pointsReceived: z.number().int().min(0).optional(),
  index: z.number().int().optional(),
});

export const matchSchema = z
  .object({
    firstId: z.number().int(),
    secondId: z.number().int(),
    winnerId: z.number().int().optional(),
    firstScore: z.number().int().min(0).max(5).optional(),
    secondScore: z.number().int().min(0).max(5).optional(),
  })
  .refine(
    (match) =>
      match.winnerId === undefined ||
      match.winnerId === match.firstId ||
      match.winnerId === match.secondId,
    { message: "winnerId must be one of the match participants" },
  )
  .refine(
    (match) =>
      match.winnerId !== undefined ||
      (match.firstScore === undefined && match.secondScore === undefined),
    { message: "scores require a winner" },
  );

export const groupSchema = z.object({
  id: z.number().int().positive(),
  participants: z.array(storedParticipantSchema),
  matches: z.array(matchSchema).optional(),
  // edit buffer only — accepted from the client, never persisted
  results: z.array(z.array(z.string())).optional(),
});

export const groupsSchema = z.array(groupSchema);

// PATCH body: any subset of a group; the id always comes from the URL
export const groupPatchSchema = groupSchema.omit({ id: true }).partial();

const playoffMatchSchema = z.object({
  id: z.number().int(),
  round: z.number().int().min(1),
  slot: z.number().int().min(0),
  firstId: z.number().int().nullable(),
  secondId: z.number().int().nullable(),
  winnerId: z.number().int().nullable(),
});

export const playoffSchema = z.object({
  participants: z.array(storedParticipantSchema),
  matches: z.array(playoffMatchSchema),
});

export function formatValidationIssues(error: z.ZodError): string {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "body"}: ${issue.message}`)
    .join("; ");
}
