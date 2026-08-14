import { useEffect, useState } from "react";
import { Bot, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Channel, Visitor, WorkflowColumn as WorkflowColumnData } from "@/data/tourism";
import { filterVisitors } from "@/lib/filtering";
import { ChannelTabs } from "./ChannelTabs";
import { VisitorCard } from "./VisitorCard";

export function WorkflowColumn({ column, visitors, channel, onChannelChange, onOpenVisitor }: { column: WorkflowColumnData; visitors: Visitor[]; channel: Channel; onChannelChange: (channel: Channel) => void; onOpenVisitor: (visitor: Visitor) => void }) {
  const filtered = filterVisitors(visitors, channel);
  const [liveIndex, setLiveIndex] = useState(0);
  useEffect(() => { setLiveIndex(0); const timer = window.setInterval(() => setLiveIndex((index) => index + 1), 3500); return () => window.clearInterval(timer); }, [channel, filtered.length]);
  const liveVisitorId = filtered.length ? filtered[liveIndex % filtered.length]?.id : undefined;
  const actionText = column.id === "breakthrough" ? "建立信任" : column.id === "intent" ? "需求确认" : column.id === "plan" ? "匹配方案" : column.id === "booking" ? "核对资料" : "出行服务跟进";
  return <Card className="flex min-h-[540px] min-w-0 flex-col overflow-hidden shadow-sm"><CardHeader className="space-y-3 border-b bg-white pb-4"><div className="flex items-center justify-between gap-2"><CardTitle className="flex items-center gap-2 text-base"><span className={`h-2.5 w-2.5 rounded-full ${column.color}`} />{column.title}</CardTitle><Badge variant="secondary"><Users className="mr-1 h-3 w-3" />{filtered.length}</Badge></div><div className="flex items-center justify-between gap-2 rounded-md bg-sky-50 px-2 py-1.5 text-[11px] text-sky-700"><span className="flex items-center gap-1"><Bot className="h-3 w-3" />AI 当前动作：{actionText}</span><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-sky-500" /></div><ChannelTabs value={channel} onValueChange={onChannelChange} /></CardHeader><CardContent className="min-h-0 flex-1 p-3"><ScrollArea className="h-[430px] pr-2"><div className="space-y-3">{filtered.length ? filtered.map((visitor) => <VisitorCard key={visitor.id} visitor={visitor} live={visitor.id === liveVisitorId} liveAction={actionText} onOpen={onOpenVisitor} />) : <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">暂无{channel === "all" ? "游客" : "该渠道游客"}</div>}</div></ScrollArea></CardContent></Card>;
}
