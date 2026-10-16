import { LayoutGrid, CreditCard, Link2, Radar, Bot, BarChart3, Menu } from "lucide-react";
import { summary } from "@/lib/recovery/mock-data";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

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
    <div className="flex min-w-0 items-center gap-2.5">
      <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-ink text-ink-foreground">
        <Radar className="h-4 w-4" />
      </div>
      <div className="min-w-0 leading-tight">
        <div className="truncate text-sm font-bold text-foreground">Recovery Radar</div>
        <div className="truncate text-[11px] text-muted-foreground">Kiran Home Studio</div>
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

function NavList() {
  return (
    <nav className="flex flex-col gap-0.5">
      {nav.map((n) =>
        n.active ? (
          <button
            key={n.label}
            aria-current="page"
            className="flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2 text-sm font-semibold text-sidebar-accent-foreground transition-colors hover:bg-accent"
          >
            <n.icon className="h-4 w-4" />
            {n.label}
          </button>
        ) : (
          <button
            key={n.label}
            disabled
            aria-disabled="true"
            title="Not part of this prototype"
            className="flex cursor-not-allowed items-center gap-3 rounded-lg px-3 py-2 text-sm text-muted-foreground/70"
          >
            <n.icon className="h-4 w-4" />
            {n.label}
            <span className="ml-auto inline-flex h-5 items-center rounded-full bg-muted px-2 text-[10px] font-semibold text-muted-foreground">Soon</span>
          </button>
        ),
      )}
    </nav>
  );
}

export function AppSidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-5 lg:flex">
      <Logo />
      <div className="mt-8"><NavList /></div>
      <div className="mt-auto">
        <AgentStatus />
      </div>
    </aside>
  );
}

export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-card/90 px-4 py-3 backdrop-blur lg:hidden">
      <Logo />
      <div className="flex items-center gap-2">
        <span className="hidden items-center gap-1.5 rounded-full bg-success-soft px-2.5 py-1 text-[11px] font-semibold text-success min-[400px]:flex">
          <span className="h-1.5 w-1.5 rounded-full bg-success" /> Agent active
        </span>
        <Sheet>
          <SheetTrigger aria-label="Open menu" className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Menu className="h-5 w-5" />
          </SheetTrigger>
          <SheetContent side="left" className="flex w-72 flex-col gap-6 bg-sidebar p-5">
            <SheetTitle className="sr-only">Navigation</SheetTitle>
            <Logo />
            <NavList />
            <div className="mt-auto"><AgentStatus /></div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
