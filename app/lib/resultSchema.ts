import { z } from "zod";

export const resultSchema = z.string().regex(/^[VD][0-5]$/);
