import { useEffect, useState } from "react";
import { CalendarClock, Eye, FileText, LayoutDashboard, MessageSquare, PenLine, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { routes, type ViewId } from "@/app/routes";

type LiveActivity = { id: string; text: string; time: string; tone?: "info" | "success" | "warning"; visitorId?: string };
type AppShellProps = { view: ViewId; onViewChange: (view: ViewId) => void; children: React.ReactNode; onReport: () => void; feedback?: string; activities?: LiveActivity[] };
const icons = { overview: LayoutDashboard, monitor: Eye, advisor: MessageSquare, content: PenLine, schedule: CalendarClock };

export function AppShell({ view, onViewChange, children, onReport, feedback, activities = [] }: AppShellProps) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(timer); }, []);
  const clock = now.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
  return <div className="app-grid">
    <aside className="flex min-h-screen flex-col items-center border-r bg-white py-4">
      <div className="mb-7 grid h-10 w-10 place-items-center rounded-xl bg-primary text-sm font-bold text-primary-foreground shadow-sm">KOS</div>
      <nav className="flex w-full flex-col items-center gap-2" aria-label="主导航">
        {routes.map((route) => { const Icon = icons[route.id]; const active = route.id === view; return <button key={route.id} type="button" aria-label={route.description} aria-current={active ? "page" : undefined} onClick={() => onViewChange(route.id)} className={`group relative flex w-14 flex-col items-center gap-1 rounded-lg px-1 py-2 text-xs transition-colors ${active ? "bg-primary/10 text-primary shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}><Icon className="h-5 w-5" /><span>{route.label}</span>{active && <span className="absolute left-0 top-2 h-7 w-0.5 rounded-r bg-primary" />}</button>; })}
      </nav>
      <div className="mt-auto flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600">TR</div>
    </aside>
    <main className="min-w-0 bg-background">
      <header className="sticky top-0 z-20 flex min-h-12 items-center justify-between gap-4 border-b bg-background/95 px-4 py-2 backdrop-blur md:px-6">
        <div className="min-w-0"><div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-primary" /><h1 className="truncate text-lg font-semibold tracking-tight">今日旅游经营驾驶舱</h1></div><p className="mt-0.5 text-xs text-muted-foreground">游客 · 线路 · 订单 · 出行服务</p></div>
        <div className="flex items-center gap-2"><div className="hidden items-center gap-2 text-xs text-muted-foreground sm:flex"><span className="h-2 w-2 animate-pulse rounded-full bg-emerald-500" />每 30s 同步 · {clock}</div><Button variant="outline" size="sm" onClick={onReport}><FileText className="h-4 w-4" />今日报告</Button></div>
      </header>
      <div className="relative p-3 md:p-4">{feedback && <div role="status" className="fixed bottom-5 right-5 z-40 rounded-lg bg-foreground px-4 py-3 text-sm text-background shadow-lg">{feedback}</div>}<IntelligenceStation activities={activities} />{children}</div>
    </main>
  </div>;
}

function IntelligenceStation({ activities }: { activities: LiveActivity[] }) {
  const [expanded, setExpanded] = useState(false);
  const [index, setIndex] = useState(0);
  useEffect(() => { if (!activities.length) return; setIndex((current) => Math.min(current, activities.length - 1)); }, [activities.length]);
  useEffect(() => { const timer = window.setInterval(() => setIndex((current) => activities.length ? (current + 1) % activities.length : 0), 9000); return () => window.clearInterval(timer); }, [activities.length]);
  const current = activities[index];
  if (!current) return null;
  return <div className={`fixed bottom-5 right-5 z-30 w-[min(340px,calc(100vw-32px))] rounded-2xl border bg-white/95 p-3 shadow-xl backdrop-blur transition-all ${expanded ? "ring-2 ring-emerald-200" : ""}`}><div className="flex items-start gap-3"><div className={`grid h-9 w-9 shrink-0 place-items-center rounded-full text-white ${current.tone === "warning" ? "bg-amber-500" : current.tone === "success" ? "bg-emerald-500" : "bg-primary"}`}>✦</div><div className="min-w-0 flex-1"><div className="flex items-center justify-between gap-2"><p className="text-xs font-semibold">情报站</p><button type="button" aria-label={expanded ? "收起情报站" : "展开情报站"} className="text-muted-foreground hover:text-foreground" onClick={() => setExpanded((value) => !value)}>{expanded ? "−" : "＋"}</button></div><p className="mt-1 text-sm leading-5 text-foreground">{current.text}</p><p className="mt-1 text-[11px] text-muted-foreground">{current.time} · 自动跟进动态</p></div></div>{expanded && <div className="mt-3 border-t pt-3"><p className="text-xs font-medium text-muted-foreground">最近动态</p><div className="mt-2 space-y-2">{activities.slice(0, 4).map((activity) => <p key={activity.id} className="text-xs text-muted-foreground">{activity.time} · {activity.text}</p>)}</div></div>}</div>;
}
