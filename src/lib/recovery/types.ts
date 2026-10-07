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
}

export interface RecoverySummary {
  opportunity: number;
  outstanding: string;
  linksAtRisk: number;
  winRate: number;
  lastScan: string;
}
