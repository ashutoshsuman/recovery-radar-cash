import type { RecoveryCase, RecoverySummary } from "./types";

// Synthetic data only. Swap these exports for a data-source call later.
export const summary: RecoverySummary = {
  opportunity: 46200,
  outstanding: "₹1.28L",
  linksAtRisk: 11,
  winRate: 36,
  lastScan: "9:12 AM today",
};

export const cases: RecoveryCase[] = [
  {
    id: "rahul",
    customer: "Rahul Sharma",
    firstName: "Rahul",
    amount: 7500,
    reference: "Invoice RP-8842",
    refCode: "RP-8842",
    status: "due 2 days ago",
    badges: [
      { label: "High intent", tone: "intent" },
      { label: "Best window now", tone: "timing" },
    ],
    reason: "Viewed twice; paid 3 previous invoices within 48h.",
    recoverability: 91,
    headline: "Rahul looks highly recoverable right now.",
    explanation:
      "He viewed the invoice twice, has paid three previous invoices within 48 hours, and has received no reminder in the last 24 hours. The agent predicts a short WhatsApp nudge now has the highest expected recovery.",
    signals: ["2 invoice views", "3/3 prior invoices paid <48h", "0 reminders in 24h", "Consent: verified"],
    recommendedChannel: "whatsapp",
    recommendedTiming: "now",
    draft:
      "Hi Rahul, a quick reminder that ₹7,500 for invoice RP-8842 is pending. You can complete the payment here: https://rzp.io/i/demo8842 — thank you!",
  },
  {
    id: "priya",
    customer: "Priya Arora",
    firstName: "Priya",
    amount: 12000,
    reference: "Payment Link PL-2181",
    refCode: "PL-2181",
    status: "expires tomorrow",
    badges: [
      { label: "High intent", tone: "intent" },
      { label: "1 reminder sent", tone: "neutral" },
    ],
    reason: "Opened after reminder; prefers evening payments.",
    recoverability: 84,
    headline: "Priya is likely to pay this evening.",
    explanation:
      "She opened the link after the first reminder, and 4 of her last 5 payments were made between 6 and 9 PM. With the link expiring tomorrow, the agent recommends a WhatsApp nudge at 6:15 PM — inside her usual payment window.",
    signals: ["Opened after reminder", "4/5 payments 6–9 PM", "Link expires tomorrow", "Consent: verified"],
    recommendedChannel: "whatsapp",
    recommendedTiming: "evening",
    draft:
      "Hi Priya, your payment link PL-2181 for ₹12,000 is still open and expires tomorrow. You can pay here whenever convenient: https://rzp.io/l/demo2181 — thank you!",
  },
  {
    id: "vikram",
    customer: "Vikram Kapoor",
    firstName: "Vikram",
    amount: 18700,
    reference: "Invoice RP-8793",
    refCode: "RP-8793",
    status: "due 5 days ago",
    badges: [{ label: "Needs review", tone: "review" }],
    reason: "High value, no link views; last successful payment 23 days ago.",
    recoverability: 63,
    headline: "High value, but weak intent — a human touch is better.",
    explanation:
      "The invoice is large, but it has not been viewed and his last successful payment was 23 days ago. An automated nudge is unlikely to land. The agent recommends a personal follow-up from you rather than a templated message.",
    signals: ["₹18,700 · top 10% value", "0 link views", "Last paid 23 days ago", "Consent: verified"],
    recommendedChannel: "manual",
    recommendedTiming: "now",
    humanReview: true,
    draft:
      "Hi Vikram, hope all is well. Following up personally on invoice RP-8793 for ₹18,700, due last week. Is there anything I can help clarify? The link is here: https://rzp.io/i/demo8793",
  },
  {
    id: "neha",
    customer: "Neha Kulkarni",
    firstName: "Neha",
    amount: 8000,
    reference: "Payment Link PL-2156",
    refCode: "PL-2156",
    status: "due 1 day ago",
    badges: [{ label: "Timing signal", tone: "timing" }],
    reason: "Customer replied \u201cafter 6 pm\u201d to the previous reminder.",
    recoverability: 71,
    headline: "Neha told us when to reach her.",
    explanation:
      "Her reply to the previous reminder was a free-text message: \u201cwill do after 6 pm\u201d. The agent read this as an explicit timing preference and moved the next nudge to after 6 PM instead of sending now.",
    signals: ["Reply: \u201cafter 6 pm\u201d", "Parsed: prefers ≥ 6 PM", "1 reminder sent", "Consent: verified"],
    recommendedChannel: "whatsapp",
    recommendedTiming: "evening",
    draft:
      "Hi Neha, as mentioned, here's the payment link PL-2156 for ₹8,000: https://rzp.io/l/demo2156 — thank you!",
  },
];

export const guardrails = [
  "Review-first mode",
  "Only consented contacts",
  "No new discounts",
  "Max 2 nudges",
  "Full audit trail",
];

export const formatINR = (n: number) => "₹" + n.toLocaleString("en-IN");
