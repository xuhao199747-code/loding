import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { OverviewPage } from "@/components/overview/OverviewPage";
import { MonitorPage } from "@/components/monitor/MonitorPage";
import { ConversationDialog } from "@/components/dialog/ConversationDialog";
import { AdvisorPage } from "@/components/advisor/AdvisorPage";
import { ContentPage } from "@/components/content/ContentPage";
import { SchedulePage } from "@/components/schedule/SchedulePage";
import { TodayReportDialog } from "@/components/report/TodayReportDialog";
import { visitors as seedVisitors, type Channel, type Visitor, type WorkflowStage } from "@/data/tourism";
import type { ViewId } from "./routes";

export default function App() {
  const [view, setView] = useState<ViewId>("overview");
  const [visitors, setVisitors] = useState(seedVisitors);
  const [selected, setSelected] = useState<Visitor | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [channelByStage, setChannelByStage] = useState<Record<string, Channel>>({ breakthrough: "all", intent: "all" });
  const current = useMemo(() => selected ? visitors.find((visitor) => visitor.id === selected.id) ?? selected : null, [selected, visitors]);
  function advance(visitor: Visitor) { const order: WorkflowStage[] = ["breakthrough", "intent", "plan", "booking", "deal"]; const next = order[Math.min(order.indexOf(visitor.stage) + 1, order.length - 1)]; setVisitors((items) => items.map((item) => item.id === visitor.id ? { ...item, stage: next, status: next === "deal" ? "出行服务" : "待推进" } : item)); }
  const page = view === "overview" ? <OverviewPage onMonitor={() => setView("monitor")} /> : view === "monitor" ? <MonitorPage visitors={visitors} channelByStage={channelByStage} onChannelChange={(stage, channel) => setChannelByStage((state) => ({ ...state, [stage]: channel }))} onOpenVisitor={setSelected} /> : view === "advisor" ? <AdvisorPage /> : view === "content" ? <ContentPage /> : <SchedulePage />;
  return <AppShell view={view} onViewChange={setView} onReport={() => setReportOpen(true)}>{page}<ConversationDialog visitor={current} onClose={() => setSelected(null)} onAdvance={advance} /><TodayReportDialog open={reportOpen} onClose={() => setReportOpen(false)} /></AppShell>;
}
