import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { StatusBadge } from "@/components/common/StatusBadge"
import type { AnswerMonitorItem } from "@/lib/types"

type AnswerDetailSheetProps = {
  item: AnswerMonitorItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AnswerDetailSheet({ item, open, onOpenChange }: AnswerDetailSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
        <SheetHeader>
          <SheetTitle>AI Response Details</SheetTitle>
          <SheetDescription>{item?.prompt ?? "Select an AI answer to view details"}</SheetDescription>
        </SheetHeader>
        {item ? (
          <Tabs defaultValue="answer" className="mt-6">
            <TabsList>
              <TabsTrigger value="answer">Answer</TabsTrigger>
              <TabsTrigger value="sources">Citation Sources</TabsTrigger>
              <TabsTrigger value="claims">Extracted Claims</TabsTrigger>
            </TabsList>
            <TabsContent value="answer" className="space-y-4">
              <div className="rounded-lg border border-border bg-muted/40 p-4 text-sm leading-6">{item.fullAnswer}</div>
              <div className="flex gap-2">
                <StatusBadge tone={item.brandMentioned ? "success" : "warning"}>
                  {item.brandMentioned ? "Brand mentioned" : "Brand not mentioned"}
                </StatusBadge>
                <StatusBadge tone={item.citedOfficialDomain ? "success" : "danger"}>
                  {item.citedOfficialDomain ? "Official cited" : "Official not cited"}
                </StatusBadge>
              </div>
            </TabsContent>
            <TabsContent value="sources" className="space-y-3">
              {item.citedSources.map((source) => (
                <div key={source} className="rounded-md border border-border p-3 text-sm">
                  {source}
                </div>
              ))}
            </TabsContent>
            <TabsContent value="claims" className="space-y-3">
              {item.extractedClaims.map((claim) => (
                <div key={claim}>
                  <div className="text-sm">{claim}</div>
                  <Separator className="mt-3" />
                </div>
              ))}
            </TabsContent>
          </Tabs>
        ) : null}
      </SheetContent>
    </Sheet>
  )
}
