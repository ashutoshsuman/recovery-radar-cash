import { ChevronRight } from "lucide-react";
import type { BadgeTone, RecoveryCase } from "@/lib/recovery/types";
import { formatINR } from "@/lib/recovery/mock-data";
import { bandText, scoreBand } from "@/lib/recovery/score";

const toneClass: Record<BadgeTone, string> = {
  intent: "bg-success-soft text-success",
  timing: "bg-accent text-accent-foreground",
  neutral: "bg-muted text-muted-foreground ring-1 ring-inset ring-border",
  review: "bg-warning-soft text-warning",
};

export function ReasonBadge({ label, tone }: { label: string; tone: BadgeTone }) {
  return (
    <span className={`inline-flex h-5 items-center whitespace-nowrap rounded-full px-2 text-[11px] font-semibold leading-none ${toneClass[tone]}`}>{label}</span>
  );
}


export function CaseRow({ c, rank, onOpen }: { c: RecoveryCase; rank: number; onOpen: () => void }) {
  return (
    <button
      onClick={onOpen}
      className={"group relative grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 px-4 py-4 text-left cursor-pointer transition-colors hover:bg-muted focus-visible:bg-muted focus-visible:outline-none sm:gap-4 sm:px-6 " + (rank === 1 ? "before:absolute before:inset-y-0 before:left-0 before:w-0.5 before:bg-primary" : "")}
    >
      <span className={"grid h-8 w-8 shrink-0 place-items-center rounded-full text-xs font-bold " + (rank === 1 ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground")}>
        {rank}
      </span>
      <div className="min-w-0">
        <div className="flex flex-wrap items-baseline gap-x-2">
          <span className="font-semibold text-foreground">{c.customer}</span>
          <span className="font-semibold text-foreground">{formatINR(c.amount)}</span>
          {rank === 1 && <span className="text-[10px] font-bold uppercase tracking-wider text-primary">Top pick</span>}
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
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <div className="text-right">
          <div className={`text-sm font-bold sm:text-base ${bandText[scoreBand(c.recoverability)]}`}>{scoreBand(c.recoverability)}</div>
          <div className="text-[11px] text-muted-foreground">likelihood · {c.recoverability}</div>
        </div>
        <ChevronRight className="hidden h-4 w-4 sm:block text-muted-foreground transition-transform group-hover:translate-x-0.5" />
      </div>
    </button>
  );
}
