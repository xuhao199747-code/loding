import { useEffect, useMemo, useState } from "react";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { workflowColumns, type Channel, type Visitor } from "@/data/tourism";
import { VisitorPoolReportDialog } from "@/components/report/VisitorPoolReportDialog";
import { WorkflowColumn } from "./WorkflowColumn";

export function MonitorPage({ visitors, channelByStage, onChannelChange, onOpenVisitor }: { visitors: Visitor[]; channelByStage: Record<string, Channel>; onChannelChange: (stage: string, channel: Channel) => void; onOpenVisitor: (visitor: Visitor) => void }) {
  const [filter, setFilter] = useState("all");
  const [reportOpen, setReportOpen] = useState(false);
  const [liveNotice, setLiveNotice] = useState("AI 正在扫描游客行为，自动标记高意向与超时风险");
  useEffect(() => { const notices = ["AI 正在扫描游客行为，自动标记高意向与超时风险", "实时消息：有游客刚刚更新了旅行需求", "Agent 正在为高意向游客匹配可订行程", "渠道同步完成：小红书、抖音、企业微信均已更新"]; let index = 0; const timer = window.setInterval(() => { index = (index + 1) % notices.length; setLiveNotice(notices[index]); }, 4500); return () => window.clearInterval(timer); }, []);
  const filtered = useMemo(() => visitors.filter((visitor) => filter === "all" || (filter === "intent" && visitor.tags?.some((tag) => tag.includes("高意向"))) || (filter === "risk" && (visitor.status.includes("风险") || visitor.status.includes("确认中"))) || (filter === "overdue" && (visitor.status.includes("超时") || visitor.tags?.some((tag) => tag.includes("待跟进"))))), [filter, visitors]);
  return <div className="content-grid"><div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-medium text-primary">游客流程监控</p><h2 className="mt-1 text-2xl font-bold tracking-tight">五阶段经营看板</h2><p className="mt-2 text-sm text-muted-foreground">按渠道和经营风险查看游客状态，点击卡片进入对话并推进下一步。</p></div><Button variant="outline" onClick={() => setReportOpen(true)}><FileText className="h-4 w-4" />游客池体检报告</Button></div><div role="status" className="flex items-center gap-2 rounded-lg border border-sky-200 bg-sky-50 px-3 py-2 text-xs text-sky-700"><span className="h-2 w-2 animate-pulse rounded-full bg-sky-500" />{liveNotice}<span className="ml-auto text-[11px] text-sky-500">实时</span></div><Tabs value={filter} onValueChange={setFilter} className="w-full"><TabsList><TabsTrigger value="all">全部</TabsTrigger><TabsTrigger value="intent">高意向</TabsTrigger><TabsTrigger value="risk">高风险</TabsTrigger><TabsTrigger value="overdue">超时</TabsTrigger></TabsList></Tabs><div className="grid min-w-0 gap-4 xl:grid-cols-5 md:grid-cols-2">{workflowColumns.map((column) => <WorkflowColumn key={column.id} column={column} visitors={filtered.filter((visitor) => visitor.stage === column.id)} channel={channelByStage[column.id] ?? "all"} onChannelChange={(channel) => onChannelChange(column.id, channel)} onOpenVisitor={onOpenVisitor} />)}</div><VisitorPoolReportDialog open={reportOpen} onClose={() => setReportOpen(false)} /></div>;
}
