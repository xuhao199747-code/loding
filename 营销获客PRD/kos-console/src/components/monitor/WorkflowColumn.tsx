import { Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Channel, Visitor, WorkflowColumn as WorkflowColumnData } from "@/data/tourism";
import { filterVisitors } from "@/lib/filtering";
import { ChannelTabs } from "./ChannelTabs";
import { VisitorCard } from "./VisitorCard";

export function WorkflowColumn({ column, visitors, channel, onChannelChange, onOpenVisitor }: { column: WorkflowColumnData; visitors: Visitor[]; channel: Channel; onChannelChange: (channel: Channel) => void; onOpenVisitor: (visitor: Visitor) => void }) {
  const filtered = filterVisitors(visitors, channel);
  return <Card className="flex min-h-[540px] min-w-0 flex-col overflow-hidden shadow-sm"><CardHeader className="space-y-3 border-b bg-white pb-4"><div className="flex items-center justify-between gap-2"><CardTitle className="flex items-center gap-2 text-base"><span className={`h-2.5 w-2.5 rounded-full ${column.color}`} />{column.title}</CardTitle><Badge variant="secondary"><Users className="mr-1 h-3 w-3" />{filtered.length}</Badge></div>{(column.id === "breakthrough" || column.id === "intent") && <ChannelTabs value={channel} onValueChange={onChannelChange} />}</CardHeader><CardContent className="min-h-0 flex-1 p-3"><ScrollArea className="h-[430px] pr-2"><div className="space-y-3">{filtered.length ? filtered.map((visitor) => <VisitorCard key={visitor.id} visitor={visitor} onOpen={onOpenVisitor} />) : <div className="rounded-lg border border-dashed bg-muted/30 px-4 py-10 text-center text-sm text-muted-foreground">暂无{channel === "all" ? "游客" : "该渠道游客"}</div>}</div></ScrollArea></CardContent></Card>;
}
