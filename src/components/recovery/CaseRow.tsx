import { ChevronRight } from "lucide-react";
import type { BadgeTone, RecoveryCase } from "@/lib/recovery/types";
import { formatINR } from "@/lib/recovery/mock-data";

const toneClass: Record<BadgeTone, string> = {
  intent: "bg-success-soft text-success",
  timing: "bg-accent text-accent-foreground",
  neutral: "bg-muted text-muted-foreground",
  review: "bg-warning-soft text-warning",
};

export function ReasonBadge({ label, tone }: { label: string; tone: BadgeTone }) {
  return (
    <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${toneClass[tone]}`}>{label}</span>
  );
}

export function scoreColor(score: number) {
  return score >= 80 ? "text-success" : score >= 70 ? "text-primary" : "text-warning";
}

export function CaseRow({ c, rank, onOpen }: { c: RecoveryCase; rank: number; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className="group grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-muted sm:px-6"
    >
      <span className="grid h-8 w-8 place-items-center rounded-full border border-border text-xs font-bold text-muted-foreground">
        {rank}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold text-foreground">{c.customer}</span>
          <span className="font-semibold text-foreground">{formatINR(c.amount)}</span>
        </div>
        <div className="mt-0.5 text-xs text-muted-foreground">
          {c.reference} · {c.status}
        </div>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {c.badges.map((b) => (
            <ReasonBadge key={b.label} {...b} />
          ))}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{c.reason}</p>
      </div>
      <div className="flex items-center gap-3">
        <div className="text-right">
          <div className={`text-xl font-bold ${scoreColor(c.recoverability)}`}>{c.recoverability}%</div>
          <div className="text-[11px] text-muted-foreground">recoverable</div>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}
