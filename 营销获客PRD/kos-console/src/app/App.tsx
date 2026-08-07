import { useMemo, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { OverviewPage } from "@/components/overview/OverviewPage";
import { MonitorPage } from "@/components/monitor/MonitorPage";
import { ConversationDialog } from "@/components/dialog/ConversationDialog";
import { visitors as seedVisitors, type Channel, type Visitor, type WorkflowStage } from "@/data/tourism";
import type { ViewId } from "./routes";

export default function App() {
  const [view, setView] = useState<ViewId>("overview");
  const [visitors, setVisitors] = useState(seedVisitors);
  const [selected, setSelected] = useState<Visitor | null>(null);
  const [channelByStage, setChannelByStage] = useState<Record<string, Channel>>({ breakthrough: "all", intent: "all" });
  const current = useMemo(() => selected ? visitors.find((visitor) => visitor.id === selected.id) ?? selected : null, [selected, visitors]);
  function advance(visitor: Visitor) { const order: WorkflowStage[] = ["breakthrough", "intent", "plan", "booking", "deal"]; const next = order[Math.min(order.indexOf(visitor.stage) + 1, order.length - 1)]; setVisitors((items) => items.map((item) => item.id === visitor.id ? { ...item, stage: next, status: next === "deal" ? "出行服务" : "待推进" } : item)); }
  return <AppShell view={view} onViewChange={setView} onReport={() => window.alert("今日报告已生成（演示）")}>{view === "overview" ? <OverviewPage onMonitor={() => setView("monitor")} /> : <MonitorPage visitors={visitors} channelByStage={channelByStage} onChannelChange={(stage, channel) => setChannelByStage((state) => ({ ...state, [stage]: channel }))} onOpenVisitor={setSelected} />}<ConversationDialog visitor={current} onClose={() => setSelected(null)} onAdvance={advance} /></AppShell>;
}
