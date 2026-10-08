export type Channel = "whatsapp" | "sms" | "manual";
export type Timing = "now" | "evening" | "tomorrow";
export type BadgeTone = "intent" | "timing" | "neutral" | "review";

export interface RecoveryCase {
  id: string;
  customer: string;
  firstName: string;
  amount: number;
  reference: string; // e.g. "Invoice RP-8842"
  refCode: string; // e.g. "RP-8842"
  status: string;
  badges: { label: string; tone: BadgeTone }[];
  reason: string;
  recoverability: number;
  headline: string;
  explanation: string;
  signals: string[];
  recommendedChannel: Channel;
  recommendedTiming: Timing;
  humanReview?: boolean;
  draft: string;
  learning: string;
  input: RecommendationInput;
}

export interface RecommendationInput {
  customer_name: string;
  amount: number;
  payment_reference: string;
  payment_type: "invoice" | "payment_link";
  days_overdue: number;
  link_views: number;
  previous_payment_count: number;
  previous_fast_payment_count: number;
  reminder_count_last_24h: number;
  customer_timing_signal: string | null;
  consent_verified: boolean;
}

export interface AiRecommendation {
  recoverability_score: number;
  recommended_channel: Channel;
  recommended_timing: string;
  recommendation_reason: string;
  draft_message: string;
  confidence: "high" | "medium" | "low";
  learning_signal: string;
}

export interface RecoverySummary {
  opportunity: number;
  outstanding: string;
  linksAtRisk: number;
  winRate: number;
  lastScan: string;
}
