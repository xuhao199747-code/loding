import { Eye, MoreHorizontal } from "lucide-react"
import { useEffect, useState } from "react"
import { DataTable } from "@/components/common/DataTable"
import { FilterBar } from "@/components/common/FilterBar"
import { PageHeader } from "@/components/common/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { OpportunityDetailSheet } from "@/features/opportunities/OpportunityDetailSheet"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ContentOpportunity, OpportunityType } from "@/lib/types"
import { opportunities as initialOpportunities } from "@/lib/mock-data"
import { listOpportunities } from "@/features/opportunities/opportunities-service"

const typeLabels: Record<OpportunityType, string> = {
  faq_gap: "FAQ Gap",
  source_evidence_gap: "Evidence Gap",
  comparison_gap: "Comparison Content Gap",
  claim_clarity: "Claim Clarity",
  negative_sentiment_response: "Negative Response",
  eeat_gap: "E-E-A-T Gap",
  structure_schema: "Structured Data",
}

export function OpportunitiesPage() {
  const [items, setItems] = useState<ContentOpportunity[]>(initialOpportunities)
  const [selected, setSelected] = useState<ContentOpportunity | null>(null)

  useEffect(() => {
    void listOpportunities().then(setItems)
  }, [])

  return (
    <div>
      <PageHeader title="Content Opportunities" description="Collect issues from diagnosis, answer monitoring, and sentiment analysis, then turn them into a content optimization backlog." />
      <FilterBar searchPlaceholder="Search opportunities, prompts, or URLs" />
      <DataTable empty={items.length === 0}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Opportunity</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Impact Score</TableHead>
              <TableHead>Affected Prompts</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Owner</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell>
                  <div className="font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground">{item.affectedUrls[0]}</div>
                </TableCell>
                <TableCell>{typeLabels[item.type]}</TableCell>
                <TableCell>
                  <StatusBadge tone={item.severity === "high" ? "danger" : item.severity === "medium" ? "warning" : "neutral"}>
                    {item.severity === "high" ? "High" : item.severity === "medium" ? "Medium" : "Low"}
                  </StatusBadge>
                </TableCell>
                <TableCell>{item.impactScore}</TableCell>
                <TableCell>{item.affectedPrompts.length}</TableCell>
                <TableCell>
                  <StatusBadge tone={item.status === "done" ? "success" : "info"}>{item.status}</StatusBadge>
                </TableCell>
                <TableCell>{item.owner}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-2"
                      aria-label={index === 0 ? "View Opportunity" : `View opportunity ${index + 1}`}
                      onClick={() => setSelected(item)}
                    >
                      <Eye className="size-4" />
                      {index === 0 ? "View Opportunity" : "View"}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="More actions">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Create Task</DropdownMenuItem>
                        <DropdownMenuItem>Mark Complete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
      <OpportunityDetailSheet opportunity={selected} open={Boolean(selected)} onOpenChange={(open) => !open && setSelected(null)} />
    </div>
  )
}
