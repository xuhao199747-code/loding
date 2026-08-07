import { ArrowUpRight, CheckCircle2, FileText, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function TodayReportDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return <Dialog open={open} onOpenChange={(value) => !value && onClose()}>
    <DialogContent aria-describedby={undefined}>
      <DialogHeader><DialogTitle className="flex items-center gap-2"><FileText className="h-5 w-5 text-primary" />今日报告</DialogTitle></DialogHeader>
      <div className="grid gap-3 sm:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">经营健康度</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">82<span className="text-sm text-muted-foreground">/100</span></p><Badge variant="secondary" className="mt-2 text-emerald-700">↑ 3</Badge></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">漏斗转化</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold">58% → 16.2%</p><p className="mt-2 text-xs text-muted-foreground">→ 9.4% 成交转化</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-xs text-muted-foreground">高风险占比</CardTitle></CardHeader><CardContent><p className="text-2xl font-bold text-amber-600">2.7%</p><p className="mt-2 text-xs text-amber-700">偏高，需要优先跟进</p></CardContent></Card>
      </div>
      <div className="rounded-lg border bg-muted/30 p-4 text-sm"><p className="flex items-center gap-2 font-medium"><CheckCircle2 className="h-4 w-4 text-emerald-600" />今日建议</p><p className="mt-2 text-muted-foreground">优先处理 8 条高意向咨询，并完成 3 个出发前提醒。</p></div>
      <div className="flex justify-end gap-2"><Button variant="outline" onClick={onClose}><X className="h-4 w-4" />关闭</Button><Button onClick={onClose}>查看跟进队列<ArrowUpRight className="h-4 w-4" /></Button></div>
    </DialogContent>
  </Dialog>;
}
