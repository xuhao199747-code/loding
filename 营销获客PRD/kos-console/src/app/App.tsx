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
import { applyVisitorAction, appendMessage, type ConversationMessage, type TimelineEvent, type TourismAction } from "@/lib/tourism-state";
import type { ViewId } from "./routes";

export default function App() {
  const [view, setView] = useState<ViewId>("overview");
  const [visitors, setVisitors] = useState(seedVisitors);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [timeline, setTimeline] = useState<Record<string, TimelineEvent[]>>({});
  const [feedback, setFeedback] = useState("");
  const [selected, setSelected] = useState<Visitor | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [channelByStage, setChannelByStage] = useState<Record<string, Channel>>({ breakthrough: "all", intent: "all" });
  const current = useMemo(() => selected ? visitors.find((visitor) => visitor.id === selected.id) ?? selected : null, [selected, visitors]);
  const runAction = (visitorId: string, action: TourismAction) => {
    const next = applyVisitorAction({ visitors, messages, timeline }, visitorId, action);
    setVisitors(next.visitors); setTimeline(next.timeline); setFeedback(next.feedback ?? "");
  };
  function advance(visitor: Visitor) { runAction(visitor.id, "qualify"); }
  const sendMessage = (visitorId: string, text: string) => setMessages((items) => appendMessage({ visitors, messages: items, timeline }, visitorId, text).messages);
  const page = view === "overview" ? <OverviewPage onMonitor={() => setView("monitor")} onReport={() => setReportOpen(true)} /> : view === "monitor" ? <MonitorPage visitors={visitors} channelByStage={channelByStage} onChannelChange={(stage, channel) => setChannelByStage((state) => ({ ...state, [stage]: channel }))} onOpenVisitor={setSelected} /> : view === "advisor" ? <AdvisorPage /> : view === "content" ? <ContentPage /> : <SchedulePage />;
  return <AppShell view={view} onViewChange={setView} onReport={() => setReportOpen(true)} feedback={feedback}>{page}<ConversationDialog visitor={current} timeline={current ? timeline[current.id] : []} messages={messages} onClose={() => setSelected(null)} onAdvance={advance} onAction={(action) => current && runAction(current.id, action)} onSend={(text) => current && sendMessage(current.id, text)} /><TodayReportDialog open={reportOpen} onClose={() => setReportOpen(false)} onGoSchedule={() => setView("schedule")} /></AppShell>;
}
