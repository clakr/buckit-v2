import { z } from "zod";

export const createBucketSchema = z.object({
  name: z
    .string()
    .nonempty("Name is required")
    .max(255, "Name must be less than 255 characters"),
  description: z
    .string()
    .max(1000, "Description must be less than 1000 characters"),
  current_amount: z.coerce
    .number()
    .min(-1_000_000_000, "Amount must be at least -1,000,000,000")
    .max(1_000_000_000, "Amount must be less than 1,000,000,000"),
});

export const updateBucketSchema = createBucketSchema.omit({
  current_amount: true,
});

export const createBucketTransactionSchema = z.object({
  bucket_id: z
    .string()
    .uuid("Invalid bucket ID")
    .nonempty("Bucket ID is required"),
  amount: z.coerce
    .number()
    .min(0.01, "Amount must be greater than 0")
    .max(1000000000, "Amount must be less than 1,000,000,000"),
  description: z.string().nonempty("Description is required"),
  type: z.enum(["inbound", "outbound"], {
    message: "Transaction type must be inbound or outbound",
  }),
  current_balance: z.number().default(0),
});
