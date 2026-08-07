import { CalendarClock, Eye, FileText, LayoutDashboard, MessageSquare, PenLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { routes, type ViewId } from "@/app/routes";

type AppShellProps = { view: ViewId; onViewChange: (view: ViewId) => void; children: React.ReactNode; onReport: () => void; feedback?: string };
const icons = { overview: LayoutDashboard, monitor: Eye, advisor: MessageSquare, content: PenLine, schedule: CalendarClock };

export function AppShell({ view, onViewChange, children, onReport, feedback }: AppShellProps) {
  return <div className="app-grid">
    <aside className="flex min-h-screen flex-col items-center border-r bg-white py-4">
      <div className="mb-7 grid h-10 w-10 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">KOS</div>
      <nav className="flex w-full flex-col items-center gap-2" aria-label="主导航">
        {routes.map((route) => { const Icon = icons[route.id]; const active = route.id === view; return <button key={route.id} type="button" aria-label={route.description} aria-current={active ? "page" : undefined} onClick={() => onViewChange(route.id)} className={`group relative flex w-14 flex-col items-center gap-1 rounded-lg px-1 py-2 text-xs transition-colors ${active ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="h-5 w-5" /><span>{route.label}</span>{active && <span className="absolute left-0 top-2 h-7 w-0.5 rounded-r bg-primary" />}</button>; })}
      </nav>
      <div className="mt-auto flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">TR</div>
    </aside>
    <main className="min-w-0 bg-background">
      <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between gap-4 border-b bg-background/95 px-5 py-3 backdrop-blur md:px-8">
        <div className="min-w-0"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /><h1 className="truncate text-lg font-semibold tracking-tight">今日旅游经营驾驶舱</h1></div><p className="mt-0.5 text-xs text-muted-foreground">游客 · 线路 · 订单 · 出行服务</p></div>
        <div className="flex items-center gap-2"><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />实时同步 · 30s</div><Button variant="outline" size="sm" onClick={onReport}><FileText className="h-4 w-4" />今日报告</Button></div>
      </header>
      <div className="relative p-4 md:p-6 lg:p-8">{feedback && <div role="status" className="fixed bottom-5 right-5 z-40 rounded-lg bg-foreground px-4 py-3 text-sm text-background shadow-lg">{feedback}</div>}{children}</div>
    </main>
  </div>;
}
