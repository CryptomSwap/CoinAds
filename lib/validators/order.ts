import { z } from "zod";

export const orderCreateSchema = z.object({
  title: z.string().min(3).max(100),
  notes: z.string().max(5000).optional(),
  campaignId: z.number().int().positive().optional(),
  totalAmountMicros: z.coerce.bigint().refine(v => v >= BigInt(0), "Must be >= 0"),
  currency: z.string().min(3).max(6).default("USD"),
});

export const orderUpdateSchema = z.object({
  title: z.string().min(3).max(100).optional(),
  notes: z.string().max(5000).optional(),
  totalAmountMicros: z.coerce.bigint().refine(v => v >= BigInt(0), "Must be >= 0").optional(),
  currency: z.string().min(3).max(6).optional(),
});

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED", "CANCELED"]),
  adminReason: z.string().max(1000).optional(),
});
