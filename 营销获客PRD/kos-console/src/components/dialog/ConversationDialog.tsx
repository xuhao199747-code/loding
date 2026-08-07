import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { Visitor } from "@/data/tourism";

export function ConversationDialog({ visitor, onClose, onAdvance }: { visitor: Visitor | null; onClose: () => void; onAdvance: (visitor: Visitor) => void }) {
  const [draft, setDraft] = useState("");
  return <Dialog open={Boolean(visitor)} onOpenChange={(open) => { if (!open) onClose(); }}><DialogContent className="max-w-2xl"><DialogHeader><DialogTitle>{visitor?.name}</DialogTitle><DialogDescription>{visitor?.subtitle} · 当前状态：{visitor?.status}</DialogDescription></DialogHeader>{visitor && <div className="space-y-4"><div className="rounded-lg bg-muted/60 p-4 text-sm">游客说：<span className="font-medium">“{visitor.lastMessage}”</span></div><div className="rounded-lg border p-4"><p className="mb-3 text-xs font-medium text-muted-foreground">下一步建议</p><div className="flex items-center gap-2 text-sm"><CheckCircle2 className="h-4 w-4 text-emerald-600" />确认关键信息后推进至下一阶段</div></div><div className="flex gap-2"><Textarea value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="输入给游客的回复…" /><Button size="icon" aria-label="发送回复" onClick={() => setDraft("")}><Send className="h-4 w-4" /></Button></div><div className="flex flex-wrap justify-end gap-2"><Button variant="outline" onClick={onClose}>稍后处理</Button><Button onClick={() => { onAdvance(visitor); onClose(); }}>推进下一阶段</Button></div></div>}</DialogContent></Dialog>;
}
