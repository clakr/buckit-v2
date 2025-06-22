import { z } from "zod";

/**
 * PRIMITIVES
 */

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
    .number()
    .min(-1_000_000_000, "Amount must be at least -1,000,000,000")
    .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
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
    .number()
    .min(-1_000_000_000, "Amount must be at least -1,000,000,000")
    .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
  target_amount: z
    .number()
    .gt(0, "Amount must be greater than zero")
    .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
});

export const transactionTypeSchema = z.union([
  z.literal("inbound"),
  z.literal("outbound"),
]);

const baseTransactionSchema = z.object({
  amount: z
    .number()
    .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
  description: z
    .string()
    .nonempty("Description is required")
    .max(1000, "Description must be less than 1000 characters"),
  type: transactionTypeSchema,
});

export const distributionAmountTypeSchema = z.union([
  z.literal("percentage"),
  z.literal("absolute"),
]);

export const distributionTargetTypeSchema = z.union([
  z.literal("bucket"),
  z.literal("goal"),
]);

export const baseDistributionTargetSchema = z.object({
  distribution_id: z.string().uuid().nonempty("Distribution ID is required"),
  target_id: z.string().nonempty("Target ID is required"),
  amount_type: distributionAmountTypeSchema,
  amount: z
    .number()
    .gt(0, "Amount must be greater than zero")
    .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .nullable(),
});

export const baseDistributionSchema = z.object({
  id: z.string().uuid().nonempty("Distribution ID is required"),
  name: z.string().nonempty("Name is required"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .nullable(),
  base_amount: z
    .number()
    .gt(0, "Base amount must be greater than zero")
    .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
});

export const baseCreateDistributionSchema = baseDistributionSchema.extend({
  distribution_targets: z.array(baseDistributionTargetSchema),
});

export const expenseStatusTypeSchema = z.union([
  z.literal("draft"),
  z.literal("calculated"),
  z.literal("settled"),
]);

export const expenseItemTypeSchema = z.union([
  z.literal("absolute"),
  z.literal("percentage"),
  z.literal("equal"),
]);

export const baseExpenseParticipantSchema = z.object({
  expense_id: z.string().uuid().nonempty("Expense ID is required"),
  name: z.string().nonempty("Participant is required"),
});

export const baseExpenseItemDistributionSchema = z.object({
  expense_item_id: z.string().uuid().nonempty("Expense item ID is required"),
  expense_participant_id: z
    .string()
    .nonempty("Expense participant is required"),
  amount: z
    .number()
    .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
});

export const baseExpenseItemSchema = z.object({
  id: z.string().uuid().nonempty("Expense item ID is required"),
  expense_id: z.string().uuid().nonempty("Expense ID is required"),
  amount: z
    .number()
    .gt(0, "Amount must be greater than zero")
    .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters"),
  expense_participant_id: z
    .string()
    .nonempty("Expense participant ID is required"),
  type: expenseItemTypeSchema,
  distributions: z.array(baseExpenseItemDistributionSchema),
});

export const baseExpenseSettlementSchema = z.object({
  expense_id: z.string().uuid().nonempty("Expense ID is required"),
  payer_participant_id: z.string().nonempty("Payer participant ID is required"),
  receiver_participant_id: z
    .string()
    .nonempty("Receiver participant ID is required"),
  amount: z
    .number()
    .gt(0, "Amount must be greater than zero")
    .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
});

export const baseExpenseSchema = z.object({
  id: z.string().uuid(),
  name: z.string().nonempty("Name is required"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters")
    .nullable(),
  status: expenseStatusTypeSchema,
  participants: z.array(baseExpenseParticipantSchema),
  items: z.array(baseExpenseItemSchema),
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
    id: z.string().uuid().nonempty("Bucket ID is required"),
  });

export const archiveBucketSchema = z.object({
  id: z.string().uuid().nonempty("Bucket ID is required"),
});

export const createBucketTransactionSchema = baseTransactionSchema.extend({
  bucket_id: z.string().uuid().nonempty("Bucket ID is required"),
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
  })
  .extend({
    id: z.string().uuid().nonempty("Goal ID is required"),
  });

export const archiveGoalSchema = z.object({
  id: z.string().uuid().nonempty("Goal ID is required"),
});

export const createGoalTransactionSchema = baseTransactionSchema.extend({
  goal_id: z.string().uuid().nonempty("Goal ID is required"),
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

export const createDistributionSchema = baseCreateDistributionSchema.refine(
  (data) => {
    const totalDistributedAmount = data.distribution_targets.reduce(
      (sum, distribution) =>
        distribution.amount_type === "absolute"
          ? sum + distribution.amount
          : sum + (data.base_amount * distribution.amount) / 100,
      0,
    );

    return totalDistributedAmount <= data.base_amount;
  },
  {
    message: "Total distributed amount cannot exceed the base amount.",
    path: ["distributions"],
  },
);

export const distributeFundsSchema = z.object({
  buckets: z.array(createBucketTransactionSchema),
  goals: z.array(createGoalTransactionSchema),
});

export const updateDistributionSchema = baseCreateDistributionSchema.extend({
  id: z.string().uuid().nonempty("Distribution ID is required"),
});

export const archiveDistributionSchema = z.object({
  id: z.string().uuid().nonempty("Distribution ID is required"),
});

export const createExpenseSchema = baseExpenseSchema;
