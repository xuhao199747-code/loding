import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/common/StatusBadge"
import type { ContentOpportunity } from "@/lib/types"

type OpportunityDetailSheetProps = {
  opportunity: ContentOpportunity | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function OpportunityDetailSheet({ opportunity, open, onOpenChange }: OpportunityDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>{opportunity?.title ?? "机会详情"}</SheetTitle>
          <SheetDescription>把诊断证据转化为可执行的内容优化动作。</SheetDescription>
        </SheetHeader>
        {opportunity ? (
          <div className="mt-6 space-y-5 text-sm">
            <div className="flex gap-2">
              <StatusBadge tone={opportunity.severity === "high" ? "danger" : "warning"}>{opportunity.severity === "high" ? "高优先级" : "中优先级"}</StatusBadge>
              <StatusBadge tone="info">影响分 {opportunity.impactScore}</StatusBadge>
            </div>
            <section>
              <h3 className="font-medium">原因</h3>
              <p className="mt-2 text-muted-foreground">{opportunity.evidence}</p>
            </section>
            <Separator />
            <section>
              <h3 className="font-medium">建议动作</h3>
              <p className="mt-2 text-muted-foreground">{opportunity.suggestedAction}</p>
            </section>
            <Separator />
            <section>
              <h3 className="font-medium">关联 Prompt</h3>
              <p className="mt-2 text-muted-foreground">{opportunity.affectedPrompts.join("、")}</p>
            </section>
            <section>
              <h3 className="font-medium">关联页面</h3>
              <p className="mt-2 text-muted-foreground">{opportunity.affectedUrls.join("、")}</p>
            </section>
            <Button>创建任务</Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
