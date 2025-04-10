import { z } from "zod";

/**
 * PRIMITIVES
 */

export const transactionTypeSchema = z.union([
  z.literal("inbound"),
  z.literal("outbound"),
]);

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

export const goalSchema = z.object({
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
  target_amount: z
    .string()
    .nonempty("Target amount is required")
    .transform((value) => Number(value))
    .pipe(
      z
        .number()
        .min(0.01, "Amount must be at least 0.01")
        .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
    ),

  is_active: z.boolean().default(true),
});

/**
 * COMPOSITES
 */

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

export const createGoalSchema = goalSchema
  .pick({
    name: true,
    description: true,
    current_amount: true,
    target_amount: true,
  })
  .refine(
    (data) =>
      data.target_amount === null || data.target_amount > data.current_amount,
    {
      message: "Target amount must be greater than current amount",
      path: ["target_amount"], // Apply error to target_amount field
    },
  );

export const updateGoalSchema = goalSchema.pick({
  id: true,
  name: true,
  description: true,
  target_amount: true,
});

export const goalTransactionSchema = z.object({
  id: z.string().default(""),
  goal_id: z.string(),
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

export const createGoalTransactionSchema = goalTransactionSchema.pick({
  goal_id: true,
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

export const convertToBucketSchema = createBucketSchema.extend({
  goalId: goalSchema.shape.id,
});

export const LoginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});
