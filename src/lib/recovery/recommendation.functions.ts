import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { generateRecommendation } from "./recommendation.server";

const inputSchema = z.object({
  customer_name: z.string().max(100),
  amount: z.number().nonnegative(),
  payment_reference: z.string().max(40),
  payment_type: z.enum(["invoice", "payment_link"]),
  days_overdue: z.number().int(),
  link_views: z.number().int().nonnegative(),
  previous_payment_count: z.number().int().nonnegative(),
  previous_fast_payment_count: z.number().int().nonnegative(),
  reminder_count_last_24h: z.number().int().nonnegative(),
  customer_timing_signal: z.string().max(200).nullable(),
  consent_verified: z.boolean(),
  recoverability_score: z.number().int().min(0).max(100),
  band: z.enum(["High", "Medium", "Low"]),
});

// "recovery-recommendation": returns AI decision or { ok: false } so the UI can fall back.
export const getRecoveryRecommendation = createServerFn({ method: "POST" })
  .inputValidator((d) => inputSchema.parse(d))
  .handler(async ({ data }) => {
    try {
      return { ok: true as const, recommendation: await generateRecommendation(data) };
    } catch (e) {
      console.error("recovery-recommendation failed", e);
      return { ok: false as const };
    }
  });
