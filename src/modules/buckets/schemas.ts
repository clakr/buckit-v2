import { z } from "zod";

export const createBucketSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(255, "Name must be less than 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters"),
  current_amount: z.coerce
    .number()
    .min(-1_000_000_000, "Amount must be at least -1,000,000,000")
    .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
});

export const updateBucketSchema = createBucketSchema;
