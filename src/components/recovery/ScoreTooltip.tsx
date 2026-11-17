import * as Tooltip from "@radix-ui/react-tooltip";
import { Info } from "lucide-react";

export const SCORE_NOTE =
  "Calculated in code from signals (payment history, link views, reminders, timing). Illustrative, mock data.";

export function ScoreTooltip({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return (
    <Tooltip.Provider delayDuration={150}>
      <Tooltip.Root>
        <Tooltip.Trigger asChild>
          <span
            className={"inline-flex cursor-help items-center gap-1 rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring " + className}
            title={SCORE_NOTE}
          >
            {children}
            <Info className="h-3 w-3 shrink-0 opacity-70" aria-hidden />
          </span>
        </Tooltip.Trigger>
        <Tooltip.Portal>
          <Tooltip.Content
            side="top"
            sideOffset={8}
            className="z-[80] max-w-[16rem] rounded-lg bg-ink px-3 py-2 text-[11px] font-medium leading-snug text-ink-foreground shadow-pop animate-in fade-in-0 zoom-in-95"
          >
            {SCORE_NOTE}
            <Tooltip.Arrow className="fill-ink" />
          </Tooltip.Content>
        </Tooltip.Portal>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
}
