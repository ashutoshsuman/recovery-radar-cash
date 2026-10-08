import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { getRecoveryRecommendation } from "@/lib/recovery/recommendation.functions";
import type { AiRecommendation } from "@/lib/recovery/types";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";
import {
  Check, X, Sparkles, MessageCircle, MessageSquare, UserRound, ShieldCheck, Activity,
  UserCheck, Lock, Pencil, Loader2, ScrollText, BrainCircuit,
} from "lucide-react";
import type { Channel, RecoveryCase, Timing } from "@/lib/recovery/types";
import { formatINR } from "@/lib/recovery/mock-data";
import { scoreColor } from "./CaseRow";

const channels: { id: Channel; label: string; sub: string; icon: typeof MessageCircle }[] = [
  { id: "whatsapp", label: "WhatsApp", sub: "Best response rate", icon: MessageCircle },
  { id: "sms", label: "SMS", sub: "Fallback channel", icon: MessageSquare },
  { id: "manual", label: "Manual", sub: "Merchant follow-up", icon: UserRound },
];

const timings: { id: Timing; label: string; sub: string }[] = [
  { id: "now", label: "Now", sub: "Within current window" },
  { id: "evening", label: "6:15 PM", sub: "Customer's prior window" },
  { id: "tomorrow", label: "Tomorrow", sub: "Lower urgency" },
];

function Step({ n, label, tag, tone = "ai" }: { n: number; label: string; tag?: string; tone?: "ai" | "you" }) {
  return (
    <div className="mb-3 flex items-center gap-2.5">
      <span
        className={
          "grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold " +
          (tone === "ai" ? "bg-primary text-primary-foreground" : "bg-ink text-ink-foreground")
        }
      >
        {n}
      </span>
      <span className="text-sm font-bold text-foreground">{label}</span>
      {tag && (
        <span
          className={
            "ml-auto flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold " +
            (tone === "ai" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground")
          }
        >
          {tone === "ai" ? <Sparkles className="h-3 w-3" /> : <Pencil className="h-3 w-3" />}
          {tag}
        </span>
      )}
    </div>
  );
}

function Option({ selected, recommended, onClick, children }: { selected: boolean; recommended: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={
        "relative min-w-0 rounded-xl border p-3 text-left transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " +
        (selected
          ? "border-primary bg-accent ring-1 ring-primary"
          : "border-border bg-card hover:-translate-y-px hover:border-input hover:shadow-card")
      }
    >
      {recommended && (
        <span className="absolute -top-2 right-2 flex items-center gap-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-primary-foreground">
          <Sparkles className="h-2.5 w-2.5" /> AI pick
        </span>
      )}
      {children}
    </button>
  );
}

export function CaseDetail({ c, onClose }: { c: RecoveryCase | null; onClose: () => void }) {
  const [channel, setChannel] = useState<Channel>("whatsapp");
  const [timing, setTiming] = useState<Timing>("now");
  const [draft, setDraft] = useState("");
  const [state, setState] = useState<"review" | "approving" | "done">("review");
  const [ai, setAi] = useState<AiRecommendation | null>(null);
  const [aiStatus, setAiStatus] = useState<"loading" | "ai" | "fallback">("loading");
  const fetchRec = useServerFn(getRecoveryRecommendation);
  const reqId = useRef(0);

  useEffect(() => {
    if (!c) return;
    setChannel(c.recommendedChannel);
    setTiming(c.recommendedTiming);
    setDraft(c.draft);
    setState("review");
    setAi(null);
    setAiStatus("loading");
    const id = ++reqId.current;
    fetchRec({ data: c.input })
      .then((r) => {
        if (id !== reqId.current) return;
        if (r.ok) {
          setAi(r.recommendation);
          setChannel(r.recommendation.recommended_channel);
          setTiming(mapTiming(r.recommendation.recommended_timing));
          setDraft(r.recommendation.draft_message);
          setAiStatus("ai");
        } else setAiStatus("fallback");
      })
      .catch(() => id === reqId.current && setAiStatus("fallback"));
  }, [c, fetchRec]);

  const view = c && {
    score: ai?.recoverability_score ?? c.recoverability,
    headline: ai?.recommendation_title || c.headline,
    confidence: ai?.confidence,
    reason: ai?.recommendation_reason ?? c.explanation,
    recChannel: ai?.recommended_channel ?? c.recommendedChannel,
    recTiming: ai ? mapTiming(ai.recommended_timing) : c.recommendedTiming,
    timingText: ai?.recommended_timing,
    learning: ai?.learning_signal ?? c.learning,
    baseDraft: ai?.draft_message ?? c.draft,
  };
  const loading = aiStatus === "loading";

  const approve = () => {
    setState("approving");
    setTimeout(() => {
      setState("done");
      toast.success("Action logged · review-first approval recorded");
    }, 700);
  };

  const manual = channel === "manual";
  const actionLabel = manual ? "Approve follow-up" : "Approve & send";
  const edited = view ? draft !== view.baseDraft : false;

  return (
    <Dialog.Root open={!!c} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/55 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 flex max-h-[94dvh] flex-col overflow-hidden rounded-t-3xl bg-background shadow-pop outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-8 md:inset-auto md:left-1/2 md:top-1/2 md:max-h-[90dvh] md:w-[min(1000px,calc(100vw-3rem))] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-3xl md:data-[state=open]:zoom-in-95 md:data-[state=open]:slide-in-from-bottom-0">
          {c && view && (
            <>
              {/* Header */}
              <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border px-5 py-4 md:px-7">
                <div className="min-w-0">
                  <div className="eyebrow flex items-center gap-1.5 text-primary">
                    <Sparkles className="h-3 w-3" /> AI recovery recommendation
                  </div>
                  <Dialog.Title className="mt-1 truncate text-xl font-bold tracking-tight text-foreground md:text-2xl">
                    {c.customer} · {formatINR(c.amount)}
                  </Dialog.Title>
                  <Dialog.Description className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Lock className="h-3 w-3" /> {c.reference} · {c.status}
                  </Dialog.Description>
                </div>
                <Dialog.Close className="shrink-0 rounded-full p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground" aria-label="Close">
                  <X className="h-4 w-4" />
                </Dialog.Close>
              </div>

              {state === "done" ? (
                <div className="overflow-y-auto">
                  <SuccessState c={c} score={view.score} recChannel={view.recChannel} learning={view.learning} onBack={onClose} manual={manual} channel={channel} timing={timing} edited={edited} />
                </div>
              ) : (
                <>
                  <div className="grid min-h-0 flex-1 gap-5 overflow-y-auto p-5 md:grid-cols-2 md:p-7">
                    {/* AI side */}
                    <div className="flex min-w-0 flex-col gap-5">
                      <section>
                        <Step n={1} label="AI recommendation" tag="AI decision" />
                        {loading ? <AiLoading /> : (
                        <div className="rounded-2xl bg-ink p-5 text-ink-foreground animate-in fade-in-0">
                          <div className="flex items-start justify-between gap-3">
                            <h3 className="text-lg font-bold leading-snug">{view.headline}</h3>
                            <div className="shrink-0 text-right">
                              <div className="text-2xl font-bold leading-none">{view.score}%</div>
                              <div className="mt-1 text-[10px] uppercase tracking-wider opacity-60">recoverable</div>
                              {view.confidence && <div className="mt-1.5 rounded-full bg-ink-foreground/10 px-2 py-0.5 text-[10px] font-semibold">{cap(view.confidence)} confidence</div>}
                            </div>
                          </div>
                          <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] opacity-60">Why this recommendation</div>
                          <p className="mt-1 text-sm leading-relaxed opacity-85">{view.reason}</p>
                          {view.timingText && (
                            <p className="mt-3 text-xs opacity-70">Suggested timing: <span className="font-semibold opacity-100">{view.timingText}</span></p>
                          )}
                          {aiStatus === "fallback" && (
                            <p className="mt-3 text-[11px] opacity-60">Showing the agent's saved recommendation.</p>
                          )}
                        </div>
                        )}
                      </section>
                      <section>
                        <Step n={2} label="Signals used" tag="Agent inputs" />
                        <div className="grid grid-cols-2 gap-2">
                          {c.signals.map((s) => (
                            <div key={s} className="flex min-w-0 items-center gap-2 rounded-lg border border-accent-foreground/15 bg-accent px-2.5 py-2 font-mono text-[11px] text-accent-foreground">
                              <Activity className="h-3 w-3 shrink-0" /> <span className="min-w-0">{s}</span>
                            </div>
                          ))}
                        </div>
                      </section>
                      {c.humanReview && (
                        <div className="flex gap-3 rounded-xl border border-warning/30 bg-warning-soft p-4 text-sm">
                          <UserCheck className="h-5 w-5 shrink-0 text-warning" />
                          <div>
                            <div className="font-semibold text-foreground">Human review recommended</div>
                            <div className="text-muted-foreground">Weak intent for a high-value invoice. A personal message from you is suggested.</div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Merchant side */}
                    <div className="flex min-w-0 flex-col gap-5">
                      <section>
                        <Step n={3} label="Recommended action" tag="AI pick · you can change" />
                        <div className="eyebrow mb-2">Channel</div>
                        <div className="grid grid-cols-3 gap-2">
                          {channels.map((ch) => (
                            <Option key={ch.id} selected={channel === ch.id} recommended={!loading && view.recChannel === ch.id} onClick={() => setChannel(ch.id)}>
                              <ch.icon className="h-4 w-4 text-primary" />
                              <div className="mt-1.5 text-sm font-semibold text-foreground">{ch.label}</div>
                              <div className="text-[11px] leading-tight text-muted-foreground">{ch.sub}</div>
                            </Option>
                          ))}
                        </div>
                        <div className="eyebrow mb-2 mt-4">Timing</div>
                        <div className="grid grid-cols-3 gap-2">
                          {timings.map((t) => (
                            <Option key={t.id} selected={timing === t.id} recommended={!loading && view.recTiming === t.id} onClick={() => setTiming(t.id)}>
                              <div className="text-sm font-semibold text-foreground">{t.label}</div>
                              <div className="text-[11px] leading-tight text-muted-foreground">{t.sub}</div>
                            </Option>
                          ))}
                        </div>
                      </section>
                      <section>
                        <Step n={4} label="Merchant control" tag={edited ? "Edited by you" : "Editable"} tone="you" />
                        <label htmlFor="draft" className="eyebrow mb-2 flex items-center justify-between">
                          <span>Draft message</span>
                          <span className="font-medium normal-case tracking-normal">{draft.length} chars</span>
                        </label>
                        <textarea
                          id="draft"
                          value={loading ? "Recovery Agent is drafting a message…" : draft}
                          disabled={loading}
                          onChange={(e) => setDraft(e.target.value)}
                          rows={4}
                          className="w-full resize-none rounded-xl border border-dashed border-input bg-card p-3.5 text-sm leading-relaxed text-foreground outline-none transition hover:border-muted-foreground focus:border-solid focus:border-primary focus:ring-2 focus:ring-ring/20 disabled:animate-pulse disabled:text-muted-foreground"
                        />
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs">
                            <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span className="text-muted-foreground">Amount</span>
                            <span className="ml-auto font-semibold text-foreground">{formatINR(c.amount)}</span>
                          </div>
                          <div className="flex items-center gap-2 rounded-lg bg-muted px-3 py-2 text-xs">
                            <Lock className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                            <span className="text-muted-foreground">Link</span>
                            <span className="ml-auto font-semibold text-foreground">{c.refCode}</span>
                          </div>
                        </div>
                        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-foreground">
                          {["Consent verified", "Amount locked", "No discount invented", "Opt-out stops nudges"].map((g) => (
                            <span key={g} className="flex items-center gap-1.5">
                              <Check className="h-3.5 w-3.5 text-success" /> {g}
                            </span>
                          ))}
                        </div>
                      </section>
                    </div>
                  </div>

                  {/* Step 5 · Approve */}
                  <div className="flex shrink-0 flex-col gap-3 border-t border-border bg-card px-5 py-4 md:flex-row md:items-center md:justify-between md:px-7">
                    <div className="flex min-w-0 items-start gap-2.5">
                      <span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-ink text-[10px] font-bold text-ink-foreground">5</span>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        <span className="flex items-center gap-1 font-semibold text-foreground">
                          <ShieldCheck className="h-3.5 w-3.5 text-success" /> Merchant approval required — nothing is sent until you approve.
                        </span>
                        The agent can be stopped at any time. Actions are logged for audit.
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-2">
                      <Dialog.Close className="flex-1 rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted md:flex-none">
                        Not now
                      </Dialog.Close>
                      <button
                        onClick={approve}
                        disabled={loading || !draft.trim() || state === "approving"}
                        className="flex flex-[2] items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60 md:flex-none"
                      >
                        {state === "approving" ? (
                          <><Loader2 className="h-4 w-4 animate-spin" /> Recording approval…</>
                        ) : (
                          <><Check className="h-4 w-4" /> {actionLabel}</>
                        )}
                      </button>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SuccessState({ c, score, recChannel, learning, onBack, manual, channel, timing, edited }: { c: RecoveryCase; score: number; recChannel: Channel; learning: string; onBack: () => void; manual: boolean; channel: Channel; timing: Timing; edited: boolean }) {
  const chLabel = channels.find((x) => x.id === channel)?.label;
  const tLabel = timings.find((x) => x.id === timing)?.label;
  const audit = [
    ["9:14 AM", `Agent recommended ${channels.find((x) => x.id === recChannel)?.label} · ${score}% recoverability`],
    ["9:14 AM", `Merchant ${edited ? "edited message and " : ""}approved ${chLabel} · ${tLabel}`],
    ["9:14 AM", manual ? "Follow-up task created (simulated)" : "Outreach simulated as sent"],
  ];
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-6 py-10 text-center animate-in fade-in-0 zoom-in-95">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-success-soft ring-8 ring-success-soft/50">
        <Check className="h-7 w-7 text-success" strokeWidth={3} />
      </div>
      <h3 className="mt-5 text-2xl font-bold tracking-tight text-foreground">Action approved</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        The approved {c.customer} {manual ? "follow-up is queued for you as a task (simulated)" : "outreach is simulated as sent"}. Payment link {c.refCode} is unchanged; no price or discount was altered.
      </p>
      <div className="mt-6 w-full rounded-2xl border border-accent-foreground/15 bg-accent p-4 text-left">
        <div className="eyebrow flex items-center gap-1.5 text-accent-foreground">
          <BrainCircuit className="h-3.5 w-3.5" /> Learning signal recorded
        </div>
        <p className="mt-1.5 text-sm text-foreground">
          {learning}
        </p>
      </div>
      <div className="mt-3 w-full rounded-2xl border border-border bg-card p-4 text-left">
        <div className="eyebrow flex items-center gap-1.5">
          <ScrollText className="h-3.5 w-3.5" /> Audit trail
        </div>
        <ul className="mt-2 space-y-1.5">
          {audit.map(([t, e]) => (
            <li key={e} className="flex gap-3 font-mono text-[11px] text-muted-foreground">
              <span className="shrink-0">{t}</span>
              <span className="text-foreground">{e}</span>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={onBack} className="mt-6 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-ink-foreground transition hover:opacity-90 active:scale-[0.98]">
        Back to recovery queue
      </button>
    </div>
  );
}

function cap(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function mapTiming(t: string): Timing {
  const s = t.toLowerCase();
  if (s.includes("tomorrow")) return "tomorrow";
  if (/evening|pm|6|after/.test(s) && !/^now|immediately/.test(s)) return "evening";
  return "now";
}

function AiLoading() {
  return (
    <div className="rounded-2xl bg-ink p-5 text-ink-foreground" aria-live="polite">
      <div className="flex items-center gap-2 text-sm font-semibold">
        <Loader2 className="h-4 w-4 animate-spin" /> Recovery Agent is analysing signals…
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 w-11/12 animate-pulse rounded bg-ink-foreground/15" />
        <div className="h-3 w-9/12 animate-pulse rounded bg-ink-foreground/15" />
        <div className="h-3 w-10/12 animate-pulse rounded bg-ink-foreground/15" />
      </div>
    </div>
  );
}
