import { useEffect, useMemo, useRef, useState } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { OverviewPage } from "@/components/overview/OverviewPage";
import { MonitorPage } from "@/components/monitor/MonitorPage";
import { ConversationDialog } from "@/components/dialog/ConversationDialog";
import { AdvisorPage } from "@/components/advisor/AdvisorPage";
import { ContentPage, initialQueue, type ContentItem } from "@/components/content/ContentPage";
import { SchedulePage, initialTasks, type Task } from "@/components/schedule/SchedulePage";
import { TodayReportDialog } from "@/components/report/TodayReportDialog";
import { visitors as seedVisitors, type Channel, type Visitor, type WorkflowStage } from "@/data/tourism";
import { applyVisitorAction, appendMessage, type ConversationMessage, type TimelineEvent, type TourismAction } from "@/lib/tourism-state";
import type { ViewId } from "./routes";

type LiveActivity = { id: string; text: string; time: string; tone?: "info" | "success" | "warning"; visitorId?: string };
const initialActivities: LiveActivity[] = [
  { id: "seed-1", text: "小红书游客刚刚收藏了川西路线攻略", time: "刚刚", tone: "info" },
  { id: "seed-2", text: "奶爸不躺平进入高意向，建议确认出行日期", time: "1 分钟前", tone: "success", visitorId: "v4" },
  { id: "seed-3", text: "企业微信新增 1 条亲子旅行咨询", time: "2 分钟前", tone: "info" },
];

export default function App() {
  const [view, setView] = useState<ViewId>("overview");
  const [visitors, setVisitors] = useState(seedVisitors);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [timeline, setTimeline] = useState<Record<string, TimelineEvent[]>>({});
  const [feedback, setFeedback] = useState("");
  const [selected, setSelected] = useState<Visitor | null>(null);
  const [reportOpen, setReportOpen] = useState(false);
  const [channelByStage, setChannelByStage] = useState<Record<string, Channel>>({ breakthrough: "all", intent: "all" });
  const [contentQueue, setContentQueue] = useState<ContentItem[]>(initialQueue);
  const [scheduleTasks, setScheduleTasks] = useState<Task[]>(initialTasks);
  const [activities, setActivities] = useState<LiveActivity[]>(initialActivities);
  const liveCursor = useRef(0);
  const current = useMemo(() => selected ? visitors.find((visitor) => visitor.id === selected.id) ?? selected : null, [selected, visitors]);
  const runAction = (visitorId: string, action: TourismAction) => {
    const next = applyVisitorAction({ visitors, messages, timeline }, visitorId, action);
    setVisitors(next.visitors); setTimeline(next.timeline); setFeedback(next.feedback ?? "");
    const changed = next.visitors.find((visitor) => visitor.id === visitorId);
    if (changed) { const tone: LiveActivity["tone"] = "success"; setActivities((items) => [{ id: `activity-${Date.now()}`, text: `${changed.name}已完成${next.feedback?.split("：")[1] ?? "状态更新"}`, time: "刚刚", tone, visitorId }, ...items].slice(0, 8)); }
  };
  function advance(visitor: Visitor) { runAction(visitor.id, "qualify"); }
  const sendMessage = (visitorId: string, text: string) => setMessages((items) => appendMessage({ visitors, messages: items, timeline }, visitorId, text).messages);
  useEffect(() => {
    const timer = window.setInterval(() => {
      setVisitors((items) => {
        if (!items.length) return items;
        const visitor = items[liveCursor.current % items.length];
        liveCursor.current += 1;
        const tone: LiveActivity["tone"] = visitor.tags?.includes("高风险") ? "warning" : "info";
        setActivities((current) => [{ id: `activity-${Date.now()}`, text: `${visitor.name}有新的旅行动态，${visitor.status}状态持续更新`, time: "刚刚", tone, visitorId: visitor.id }, ...current].slice(0, 8));
        return items;
      });
    }, 9000);
    return () => window.clearInterval(timer);
  }, []);
  const page = view === "overview" ? <OverviewPage visitors={visitors} onMonitor={() => setView("monitor")} onReport={() => setReportOpen(true)} /> : view === "monitor" ? <MonitorPage visitors={visitors} channelByStage={channelByStage} onChannelChange={(stage, channel) => setChannelByStage((state) => ({ ...state, [stage]: channel }))} onOpenVisitor={setSelected} /> : view === "advisor" ? <AdvisorPage visitors={visitors} onVisitorAction={runAction} onSendMessage={sendMessage} /> : view === "content" ? <ContentPage sharedQueue={contentQueue} onQueueChange={setContentQueue} /> : <SchedulePage sharedTasks={scheduleTasks} onTasksChange={setScheduleTasks} />;
  return <AppShell view={view} onViewChange={setView} onReport={() => setReportOpen(true)} feedback={feedback} activities={activities}>{page}<ConversationDialog visitor={current} timeline={current ? timeline[current.id] : []} messages={messages} onClose={() => setSelected(null)} onAdvance={advance} onAction={(action) => current && runAction(current.id, action)} onSend={(text) => current && sendMessage(current.id, text)} /><TodayReportDialog open={reportOpen} onClose={() => setReportOpen(false)} onGoSchedule={() => setView("schedule")} /></AppShell>;
}
