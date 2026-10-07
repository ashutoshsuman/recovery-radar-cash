import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { toast } from "sonner";
import { Check, X, Sparkles, MessageCircle, MessageSquare, UserRound, ShieldCheck, Activity, UserCheck } from "lucide-react";
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

function Option({ selected, recommended, onClick, children }: { selected: boolean; recommended: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={
        "relative rounded-xl border p-3 text-left transition-all " +
        (selected ? "border-primary bg-accent ring-1 ring-primary" : "border-border bg-card hover:border-input hover:bg-muted")
      }
    >
      {recommended && (
        <span className="absolute -top-2 right-2 rounded-full bg-ink px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-ink-foreground">
          Agent pick
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
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (c) {
      setChannel(c.recommendedChannel);
      setTiming(c.recommendedTiming);
      setDraft(c.draft);
      setDone(false);
    }
  }, [c]);

  const approve = () => {
    setDone(true);
    toast.success("Action logged · review-first approval recorded");
  };

  const actionLabel = channel === "manual" ? "Approve follow-up" : "Approve & send";

  return (
    <Dialog.Root open={!!c} onOpenChange={(o) => !o && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-[2px] data-[state=open]:animate-in data-[state=open]:fade-in-0" />
        <Dialog.Content className="fixed inset-x-0 bottom-0 z-50 max-h-[92vh] overflow-y-auto rounded-t-3xl bg-background shadow-pop outline-none data-[state=open]:animate-in data-[state=open]:slide-in-from-bottom-8 sm:inset-auto sm:left-1/2 sm:top-1/2 sm:w-[min(920px,calc(100vw-3rem))] sm:-translate-x-1/2 sm:-translate-y-1/2 sm:rounded-3xl sm:data-[state=open]:zoom-in-95 sm:data-[state=open]:slide-in-from-bottom-0">
          {c && (
            <>
              <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-border bg-background/95 px-5 py-4 backdrop-blur sm:px-8 sm:py-5">
                <div>
                  <div className="eyebrow flex items-center gap-1.5">
                    <Sparkles className="h-3 w-3 text-primary" /> AI recovery recommendation
                  </div>
                  <Dialog.Title className="mt-1 text-xl font-bold tracking-tight text-foreground sm:text-2xl">
                    {c.customer} · {formatINR(c.amount)}
                  </Dialog.Title>
                  <Dialog.Description className="text-sm text-muted-foreground">
                    {c.reference} · {c.status}
                  </Dialog.Description>
                </div>
                <Dialog.Close className="rounded-full p-2 text-muted-foreground hover:bg-muted" aria-label="Close">
                  <X className="h-4 w-4" />
                </Dialog.Close>
              </div>

              {done ? (
                <SuccessState c={c} onBack={onClose} manual={channel === "manual"} />
              ) : (
                <div className="grid gap-5 p-5 sm:p-8 md:grid-cols-[1fr_1.1fr]">
                  {/* Why this now */}
                  <div className="flex flex-col gap-5">
                    <section className="rounded-2xl bg-ink p-5 text-ink-foreground">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-[0.14em] opacity-70">Why this now</span>
                        <span className="flex items-center gap-1 rounded-full bg-ink-foreground/10 px-2 py-0.5 text-[10px] font-semibold">
                          <Sparkles className="h-3 w-3" /> Recovery Agent
                        </span>
                      </div>
                      <h3 className="mt-3 text-lg font-bold leading-snug">{c.headline}</h3>
                      <p className="mt-2 text-sm leading-relaxed opacity-80">{c.explanation}</p>
                      <div className="mt-4 text-[10px] font-bold uppercase tracking-[0.14em] opacity-60">Signals used by the agent</div>
                      <div className="mt-2 flex flex-wrap gap-1.5">
                        {c.signals.map((s) => (
                          <span key={s} className="flex items-center gap-1.5 rounded-md border border-ink-foreground/15 bg-ink-foreground/5 px-2 py-1 font-mono text-[11px]">
                            <Activity className="h-3 w-3 opacity-60" /> {s}
                          </span>
                        ))}
                      </div>
                    </section>
                    {c.humanReview && (
                      <div className="flex gap-3 rounded-xl border border-warning/30 bg-warning-soft p-4 text-sm">
                        <UserCheck className="h-5 w-5 shrink-0 text-warning" />
                        <div>
                          <div className="font-semibold text-foreground">Human review recommended</div>
                          <div className="text-muted-foreground">Low confidence in an automated nudge for this value. A personal message from you is suggested.</div>
                        </div>
                      </div>
                    )}
                    <section className="surface p-5">
                      <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
                        {["consent verified", "payment amount locked", "no discount invented", "opt-out stops future nudges"].map((g) => (
                          <div key={g} className="flex items-center gap-2 text-foreground">
                            <Check className="h-4 w-4 text-success" /> {g}
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 flex gap-2 text-xs leading-relaxed text-muted-foreground">
                        <ShieldCheck className="h-4 w-4 shrink-0" />
                        Review-first: nothing is sent until approval. The agent can be stopped at any time. Actions are logged for audit.
                      </p>
                    </section>
                  </div>

                  {/* Recommended action */}
                  <section className="surface flex flex-col gap-5 p-5">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-foreground">Recommended action</h3>
                      <span className={`rounded-full bg-muted px-2.5 py-1 text-xs font-bold ${scoreColor(c.recoverability)}`}>
                        {c.recoverability}% confidence
                      </span>
                    </div>
                    <div>
                      <div className="eyebrow mb-2">Channel</div>
                      <div className="grid grid-cols-3 gap-2">
                        {channels.map((ch) => (
                          <Option key={ch.id} selected={channel === ch.id} recommended={c.recommendedChannel === ch.id} onClick={() => setChannel(ch.id)}>
                            <ch.icon className="h-4 w-4 text-primary" />
                            <div className="mt-1.5 text-sm font-semibold text-foreground">{ch.label}</div>
                            <div className="text-[11px] leading-tight text-muted-foreground">{ch.sub}</div>
                          </Option>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className="eyebrow mb-2">Timing</div>
                      <div className="grid grid-cols-3 gap-2">
                        {timings.map((t) => (
                          <Option key={t.id} selected={timing === t.id} recommended={c.recommendedTiming === t.id} onClick={() => setTiming(t.id)}>
                            <div className="text-sm font-semibold text-foreground">{t.label}</div>
                            <div className="text-[11px] leading-tight text-muted-foreground">{t.sub}</div>
                          </Option>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="draft" className="eyebrow mb-2 flex items-center justify-between">
                        <span>Draft message</span>
                        <span className="normal-case tracking-normal font-medium">Editable · {draft.length} chars</span>
                      </label>
                      <textarea
                        id="draft"
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        rows={5}
                        className="w-full resize-none rounded-xl border border-input bg-card p-3.5 text-sm leading-relaxed text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-ring/20"
                      />
                    </div>
                    <div className="mt-auto flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                      <Dialog.Close className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted">
                        Not now
                      </Dialog.Close>
                      <button
                        onClick={approve}
                        disabled={!draft.trim()}
                        className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-card transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50"
                      >
                        {actionLabel}
                      </button>
                    </div>
                  </section>
                </div>
              )}
            </>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

function SuccessState({ c, onBack, manual }: { c: RecoveryCase; onBack: () => void; manual: boolean }) {
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center px-6 py-12 text-center animate-in fade-in-0 zoom-in-95">
      <div className="grid h-14 w-14 place-items-center rounded-full bg-success-soft">
        <Check className="h-7 w-7 text-success" strokeWidth={3} />
      </div>
      <h3 className="mt-5 text-2xl font-bold tracking-tight text-foreground">Recovery action approved</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
        The approved {c.customer} {manual ? "follow-up is queued for you as a task (simulated)" : "outreach is simulated as sent"}. Payment link {c.refCode} is unchanged; no price or discount was altered.
      </p>
      <div className="mt-6 w-full rounded-2xl border border-border bg-muted p-4 text-left">
        <div className="eyebrow flex items-center gap-1.5">
          <Sparkles className="h-3 w-3 text-primary" /> Agent learning signal
        </div>
        <p className="mt-1.5 text-sm text-foreground">
          On payment, record the outcome against {c.firstName}'s response and timing features. Use it to refine future ranking and timing recommendations.
        </p>
      </div>
      <button onClick={onBack} className="mt-6 rounded-xl bg-ink px-5 py-2.5 text-sm font-semibold text-ink-foreground hover:opacity-90">
        Back to recovery queue
      </button>
    </div>
  );
}
