import { workflowColumns, type Channel, type Visitor } from "@/data/tourism";
import { WorkflowColumn } from "./WorkflowColumn";

export function MonitorPage({ visitors, channelByStage, onChannelChange, onOpenVisitor }: { visitors: Visitor[]; channelByStage: Record<string, Channel>; onChannelChange: (stage: string, channel: Channel) => void; onOpenVisitor: (visitor: Visitor) => void }) {
  return <div className="content-grid"><div><p className="text-sm font-medium text-primary">游客流程监控</p><h2 className="mt-1 text-2xl font-bold tracking-tight">五阶段经营看板</h2><p className="mt-2 text-sm text-muted-foreground">按渠道查看游客状态，点击卡片进入对话并推进下一步。</p></div><div className="grid min-w-0 gap-4 xl:grid-cols-5 md:grid-cols-2">{workflowColumns.map((column) => <WorkflowColumn key={column.id} column={column} visitors={visitors.filter((visitor) => visitor.stage === column.id)} channel={channelByStage[column.id] ?? "all"} onChannelChange={(channel) => onChannelChange(column.id, channel)} onOpenVisitor={onOpenVisitor} />)}</div></div>;
}
