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
          <SheetTitle>{opportunity?.title ?? "Opportunity Details"}</SheetTitle>
          <SheetDescription>Turn diagnostic evidence into actionable content optimization steps.</SheetDescription>
        </SheetHeader>
        {opportunity ? (
          <div className="mt-6 space-y-5 text-sm">
            <div className="flex gap-2">
              <StatusBadge tone={opportunity.severity === "high" ? "danger" : "warning"}>{opportunity.severity === "high" ? "High Priority" : "Medium Priority"}</StatusBadge>
              <StatusBadge tone="info">Impact Score {opportunity.impactScore}</StatusBadge>
            </div>
            <section>
              <h3 className="font-medium">Reason</h3>
              <p className="mt-2 text-muted-foreground">{opportunity.evidence}</p>
            </section>
            <Separator />
            <section>
              <h3 className="font-medium">Recommended Action</h3>
              <p className="mt-2 text-muted-foreground">{opportunity.suggestedAction}</p>
            </section>
            <Separator />
            <section>
              <h3 className="font-medium">Related Prompts</h3>
              <p className="mt-2 text-muted-foreground">{opportunity.affectedPrompts.join(", ")}</p>
            </section>
            <section>
              <h3 className="font-medium">Related Pages</h3>
              <p className="mt-2 text-muted-foreground">{opportunity.affectedUrls.join(", ")}</p>
            </section>
            <Button>Create Task</Button>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
