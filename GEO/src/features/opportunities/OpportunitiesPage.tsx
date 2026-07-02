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
  faq_gap: "FAQ 缺口",
  source_evidence_gap: "证据缺口",
  comparison_gap: "对比内容缺口",
  claim_clarity: "主张澄清",
  negative_sentiment_response: "负面回应",
  eeat_gap: "E-E-A-T 缺口",
  structure_schema: "结构化数据",
}

export function OpportunitiesPage() {
  const [items, setItems] = useState<ContentOpportunity[]>(initialOpportunities)
  const [selected, setSelected] = useState<ContentOpportunity | null>(null)

  useEffect(() => {
    void listOpportunities().then(setItems)
  }, [])

  return (
    <div>
      <PageHeader title="内容机会" description="汇总诊断、答案监控和情感分析发现的问题，并转成内容优化 backlog。" />
      <FilterBar searchPlaceholder="搜索机会、Prompt 或 URL" />
      <DataTable empty={items.length === 0}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>机会</TableHead>
              <TableHead>类型</TableHead>
              <TableHead>严重度</TableHead>
              <TableHead>影响分</TableHead>
              <TableHead>影响 Prompt</TableHead>
              <TableHead>状态</TableHead>
              <TableHead>负责人</TableHead>
              <TableHead className="text-right">操作</TableHead>
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
                    {item.severity === "high" ? "高" : item.severity === "medium" ? "中" : "低"}
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
                      aria-label={index === 0 ? "查看机会" : `查看第 ${index + 1} 个机会`}
                      onClick={() => setSelected(item)}
                    >
                      <Eye className="size-4" />
                      {index === 0 ? "查看机会" : "查看"}
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="更多操作">
                          <MoreHorizontal className="size-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>创建任务</DropdownMenuItem>
                        <DropdownMenuItem>标记完成</DropdownMenuItem>
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
