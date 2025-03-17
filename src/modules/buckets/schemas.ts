import { transactionTypeSchema } from "@/lib/schemas";
import { goalSchema } from "@/modules/goals/schemas";
import { z } from "zod";

export const bucketSchema = z.object({
  id: z.string().default(""),
  user_id: z.string().default(""),
  created_at: z.string().default(new Date().toLocaleString()),

  name: z
    .string()
    .nonempty("Name is required")
    .max(255, "Name must be less than 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .default(""),
  current_amount: z
    .string()
    .nonempty("Current amount is required")
    .transform((value) => Number(value))
    .pipe(
      z
        .number()
        .min(-1_000_000_000, "Amount must be at least -1,000,000,000")
        .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
    ),

  is_active: z.boolean().default(true),
});

export const createBucketSchema = bucketSchema.pick({
  name: true,
  description: true,
  current_amount: true,
});

export const updateBucketSchema = bucketSchema.pick({
  id: true,
  name: true,
  description: true,
});

export const bucketTransactionSchema = z.object({
  id: z.string().default(""),
  bucket_id: z.string(),
  created_at: z.string().default(new Date().toLocaleString()),

  amount: z
    .string()
    .nonempty("Amount is required")
    .transform((value) => Number(value))
    .pipe(
      z
        .number()
        .min(0.01, "Amount must be at least 0.01")
        .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
    ),
  description: z
    .string()
    .nonempty("Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  type: transactionTypeSchema,

  current_balance: z.number().default(0),
});

export const createBucketTransactionSchema = bucketTransactionSchema.pick({
  bucket_id: true,
  amount: true,
  description: true,
  type: true,
  current_balance: true,
});

export const convertToGoalSchema = goalSchema
  .pick({
    name: true,
    description: true,
    current_amount: true,
    target_amount: true,
  })
  .extend({
    bucketId: bucketSchema.shape.id,
  })
  .refine(
    (data) =>
      data.target_amount === null || data.target_amount > data.current_amount,
    {
      message: "Target amount must be greater than current amount",
      path: ["target_amount"],
    },
  );
