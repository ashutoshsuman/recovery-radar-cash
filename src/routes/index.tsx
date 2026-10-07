import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Check, Settings2 } from "lucide-react";
import { AppSidebar, MobileHeader } from "@/components/recovery/AppSidebar";
import { CaseRow } from "@/components/recovery/CaseRow";
import { CaseDetail } from "@/components/recovery/CaseDetail";
import { cases, formatINR, guardrails, summary } from "@/lib/recovery/mock-data";
import type { RecoveryCase } from "@/lib/recovery/types";
import { toast } from "sonner";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Recovery Radar — AI revenue recovery agent" },
      { name: "description", content: "Rank outstanding payments by recoverability and approve the next best recovery action." },
      { property: "og:title", content: "Recovery Radar — AI revenue recovery agent" },
      { property: "og:description", content: "Rank outstanding payments by recoverability and approve the next best recovery action." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [active, setActive] = useState<RecoveryCase | null>(null);
  const top = cases[0] ?? null;

  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="min-w-0 flex-1">
        <MobileHeader />
        <main className="mx-auto max-w-5xl px-4 py-8 sm:px-8 sm:py-12">
          <header className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <div className="eyebrow">Agent Studio · Recovery Radar</div>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                Recover revenue before it goes cold.
              </h1>
              <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
                The agent ranks outstanding payments by recoverability and recommends the next best action — without sending anything until you approve it.
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => toast("Agent settings", { description: "Review-first mode · max 2 nudges · consented contacts only" })}
                className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground hover:bg-muted"
              >
                <Settings2 className="h-4 w-4" /> Agent settings
              </button>
              <button
                onClick={() => setActive(top)}
                className="rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-ink-foreground hover:opacity-90"
              >
                Review top opportunity
              </button>
            </div>
          </header>

          <section className="surface mt-8 grid gap-6 p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-end">
            <div>
              <div className="text-5xl font-bold tracking-tight text-foreground sm:text-6xl">{formatINR(summary.opportunity)}</div>
              <div className="mt-2 text-sm text-muted-foreground">high-confidence recovery opportunity</div>
              <dl className="mt-6 grid grid-cols-3 gap-4 border-t border-border pt-5 sm:max-w-lg">
                {[
                  [summary.outstanding, "outstanding"],
                  [String(summary.linksAtRisk), "links at risk"],
                  [`${summary.winRate}%`, "agent win-rate*"],
                ].map(([v, l]) => (
                  <div key={l}>
                    <dt className="text-lg font-bold text-foreground sm:text-xl">{v}</dt>
                    <dd className="text-xs text-muted-foreground">{l}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <button
              onClick={() => setActive(top)}
              className="group flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-[15px] font-semibold text-primary-foreground shadow-card transition hover:opacity-90 active:scale-[0.98]"
            >
              Recover {formatINR(summary.opportunity)}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </section>

          <section className="surface mt-6 overflow-hidden">
            <div className="flex items-end justify-between border-b border-border px-5 py-4 sm:px-6">
              <div>
                <h2 className="font-bold text-foreground">Recommended actions</h2>
                <p className="text-xs text-muted-foreground">Ranked by expected recovery × urgency</p>
              </div>
              <span className="text-xs text-muted-foreground">{cases.length} of {summary.linksAtRisk}</span>
            </div>
            <div className="divide-y divide-border">
              {cases.map((c, i) => (
                <CaseRow key={c.id} c={c} rank={i + 1} onOpen={() => setActive(c)} />
              ))}
            </div>
          </section>

          <div className="mt-5 flex flex-wrap gap-2">
            {guardrails.map((g) => (
              <span key={g} className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
                <Check className="h-3 w-3 text-success" /> {g}
              </span>
            ))}
          </div>
          <p className="mt-6 text-xs italic text-muted-foreground">
            *Prototype metric. Replace with controlled experiment data after launch.
          </p>
        </main>
      </div>
      <CaseDetail c={active} onClose={() => setActive(null)} />
    </div>
  );
}
