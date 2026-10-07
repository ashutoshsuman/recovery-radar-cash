import { LayoutGrid, CreditCard, Link2, Radar, Bot, BarChart3, Menu } from "lucide-react";
import { summary } from "@/lib/recovery/mock-data";

const nav = [
  { label: "Overview", icon: LayoutGrid },
  { label: "Payments", icon: CreditCard },
  { label: "Payment Links", icon: Link2 },
  { label: "Recovery Radar", icon: Radar, active: true },
  { label: "Agents", icon: Bot },
  { label: "Reports", icon: BarChart3 },
];

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <div className="grid h-8 w-8 place-items-center rounded-lg bg-ink text-ink-foreground">
        <Radar className="h-4 w-4" />
      </div>
      <div className="leading-tight">
        <div className="text-sm font-bold text-foreground">Recovery Radar</div>
        <div className="text-[11px] text-muted-foreground">Kiran Home Studio</div>
      </div>
    </div>
  );
}

function AgentStatus() {
  return (
    <div className="rounded-xl border border-border bg-muted p-3.5">
      <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
        </span>
        Recovery Agent active
      </div>
      <div className="mt-1.5 text-xs text-muted-foreground">Review-first mode</div>
      <div className="text-xs text-muted-foreground">Last scan · {summary.lastScan}</div>
    </div>
  );
}

export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
      <Logo />
      <nav className="mt-8 flex flex-col gap-0.5">
        {nav.map((n) => (
          <button
            key={n.label}
            className={
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors " +
              (n.active
                ? "bg-sidebar-accent font-semibold text-sidebar-accent-foreground"
                : "text-sidebar-foreground hover:bg-muted")
            }
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </button>
        ))}
      </nav>
      <div className="mt-auto">
        <AgentStatus />
      </div>
    </aside>
  );
}

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
      <Logo />
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> Agent active
        </span>
        <Menu className="h-5 w-5 text-muted-foreground" />
      </div>
    </header>
  );
}
