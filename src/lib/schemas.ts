import { z } from "zod";

export const transactionTypeSchema = z.union([
  z.literal("inbound"),
  z.literal("outbound"),
]);
