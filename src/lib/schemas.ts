import { z } from "zod";

/**
 * PRIMITIVES
 */

export const transactionTypeSchema = z.union([
  z.literal("inbound"),
  z.literal("outbound"),
]);

const baseBucketSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .max(255, "Name must be less than 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .nullable(),
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
});

const baseGoalSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .max(255, "Name must be less than 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .nullable(),
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
        .min(-1_000_000_000, "Amount must be at least -1,000,000,000")
        .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
    ),
});

const baseTransactionSchema = z.object({
  amount: z
    .string()
    .nonempty("Amount is required")
    .transform((value) => Number(value))
    .pipe(
      z
        .number()
        .min(-1_000_000_000, "Amount must be at least -1,000,000,000")
        .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
    ),
  description: z
    .string()
    .nonempty("Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  type: transactionTypeSchema,
});

/**
 * COMPOSITES
 */

export const createBucketSchema = baseBucketSchema;

export const updateBucketSchema = baseBucketSchema
  .omit({
    current_amount: true,
  })
  .extend({
    id: z.string().nonempty("Bucket ID is required"),
  });

export const createBucketTransactionSchema = baseTransactionSchema.extend({
  bucket_id: z.string().nonempty("Bucket ID is required"),
});

export const createGoalSchema = baseGoalSchema.refine(
  (data) =>
    data.target_amount === null || data.target_amount > data.current_amount,
  {
    message: "Target amount must be greater than current amount",
    path: ["target_amount"],
  },
);

export const updateGoalSchema = baseGoalSchema
  .omit({
    current_amount: true,
    target_amount: true,
  })
  .extend({
    id: z.string().nonempty("Goal ID is required"),
  });

export const createGoalTransactionSchema = baseTransactionSchema.extend({
  goal_id: z.string().nonempty("Goal ID is required"),
});

export const convertToGoalSchema = baseGoalSchema
  .extend({
    bucket_id: z.string().nonempty("Bucket ID is required"),
  })
  .refine(
    (data) =>
      data.target_amount === null || data.target_amount > data.current_amount,
    {
      message: "Target amount must be greater than current amount",
      path: ["target_amount"],
    },
  );

export const convertToBucketSchema = baseBucketSchema.extend({
  goal_id: z.string().nonempty("Goal ID is required"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const registerSchema = loginSchema;

export const distributionAmountTypeSchema = z.union([
  z.literal("percentage"),
  z.literal("absolute"),
]);

export const createDistributionSchema = z
  .object({
    name: z.string().nonempty("Name is required"),
    description: z
      .string()
      .max(1000, "Description must be less than 1000 characters")
      .nullable(),
    base_amount: z
      .string()
      .nonempty("Base amount is required")
      .transform((value) => Number(value))
      .pipe(
        z
          .number()
          .gt(0, "Base amount must be greater than zero")
          .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
      ),
    distributions: z.array(
      z.object({
        target_id: z.string().nonempty("Target ID is required"),
        amount_type: distributionAmountTypeSchema,
        amount: z
          .string()
          .nonempty("Amount is required")
          .transform((value) => Number(value))
          .pipe(
            z
              .number()
              .gt(0, "Amount must be greater than zero")
              .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
          ),
        description: z
          .string()
          .max(1000, "Description must be less than 1000 characters")
          .nullable(),
      }),
    ),
  })
  .refine(
    (data) => {
      const totalDistributedAmount = data.distributions.reduce(
        (sum, distribution) =>
          distribution.amount_type === "absolute"
            ? sum + distribution.amount
            : sum + (data.base_amount * distribution.amount) / 100,
        0,
      );

      return totalDistributedAmount <= data.base_amount;
    },
    {
      message:
        "Total distributed amount cannot exceed the base amount. It is okay to be less than the base amount. It cannot be greater than the base amount",
      path: ["distributions"],
    },
  );
