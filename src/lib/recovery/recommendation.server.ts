import type { AiRecommendation, RecommendationInput } from "./types";

const SYSTEM = `You are Recovery Agent, a payment-recovery decisioning agent for an Indian SME merchant. You are not a chatbot.
Given structured signals about one outstanding payment, decide the best next action for the merchant to review.
Rules:
- Use ONLY the supplied signals. Never invent facts, customer behaviour, history, or reasons.
- Never change the amount, never modify the payment reference/link, never invent or offer a discount.
- If consent_verified is false, recommended_channel MUST be "manual" and the reason must say automated outreach is blocked.
- High value combined with weak engagement (few/no link views, no fast payment history) should prefer "manual".
- If customer_timing_signal is present, respect it when choosing timing.
- The merchant approves everything. Never claim anything was sent or executed.
- draft_message: short, polite, under 280 characters, addressed by first name, mentions the exact amount (₹ with Indian grouping) and payment reference, and includes the placeholder link https://rzp.io/i/demo<digits of reference>. For "manual", write a personal follow-up the merchant could send.
- You own the decision. Reason about what the signals imply (intent, habit, urgency, risk) and why this channel and timing beat the alternatives — do not just list the signals back.
- recommendation_title: a decision-oriented headline under 60 characters naming the customer's first name and the move, e.g. "Nudge Rahul now — strong payment intent", "Best next move: WhatsApp Priya at 6:15 PM", "Call Vikram personally — high value, low engagement". Never generic.
- recommended_timing: short and specific, e.g. "Now", "Today, 6:15 PM", "After 6 PM today".
- recommendation_reason: 1-2 sentences explaining why this action now, grounded in the signals.
- learning_signal: one sentence on which outcome to record (paid / time-to-pay / response) against which features.`;

const schema = {
  type: "object",
  additionalProperties: false,
  required: [
    "recommendation_title", "recoverability_score", "recommended_channel", "recommended_timing",
    "recommendation_reason", "draft_message", "confidence", "learning_signal",
  ],
  properties: {
    recommendation_title: { type: "string" },
    recoverability_score: { type: "integer", minimum: 0, maximum: 100 },
    recommended_channel: { type: "string", enum: ["whatsapp", "sms", "manual"] },
    recommended_timing: { type: "string" },
    recommendation_reason: { type: "string" },
    draft_message: { type: "string" },
    confidence: { type: "string", enum: ["high", "medium", "low"] },
    learning_signal: { type: "string" },
  },
};

export async function generateRecommendation(input: RecommendationInput): Promise<AiRecommendation> {
  const lovableKey = process.env["LOVABLE_API_KEY"];
  if (!lovableKey) throw new Error("no_ai_key");

  const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: { "Content-Type": "application/json", "Lovable-API-Key": lovableKey, "X-Lovable-AIG-SDK": "fetch" },
    body: JSON.stringify({
      model: "openai/gpt-6-astra",
      instructions: SYSTEM,
      input: `Signals:\n${JSON.stringify(input, null, 2)}`,
      stream: true,
      store: false,
      reasoning: { effort: "low" },
      text: { format: { type: "json_schema", name: "recovery_recommendation", strict: true, schema } },
    }),
  });
  if (!res.ok || !res.body) throw new Error(`ai_status_${res.status}`);

  // Collect streamed output text
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = "";
  let text = "";
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const lines = buf.split("\n");
    buf = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const ev = JSON.parse(data);
        if (ev.type === "response.output_text.delta") text += ev.delta;
        if (ev.type === "error" || ev.type === "response.failed") throw new Error("ai_failed");
      } catch (e) {
        if (e instanceof Error && e.message === "ai_failed") throw e;
      }
    }
  }

  const out = JSON.parse(text) as AiRecommendation;
  // Server-side guardrails
  out.recoverability_score = Math.max(0, Math.min(100, Math.round(out.recoverability_score)));
  if (!input.consent_verified) out.recommended_channel = "manual";
  return out;
}
