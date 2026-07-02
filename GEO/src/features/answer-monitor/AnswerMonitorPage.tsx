import { Eye } from "lucide-react"
import { useEffect, useState } from "react"
import { DataTable } from "@/components/common/DataTable"
import { FilterBar } from "@/components/common/FilterBar"
import { PageHeader } from "@/components/common/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { AnswerDetailSheet } from "@/features/answer-monitor/AnswerDetailSheet"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { AnswerMonitorItem } from "@/lib/types"
import { PLATFORMS } from "@/lib/constants"
import { answerItems } from "@/lib/mock-data"
import { formatDateTime } from "@/lib/format"
import { listAnswerItems } from "@/features/answer-monitor/answer-monitor-service"

const sentimentTone = {
  positive: "success",
  neutral: "neutral",
  negative: "danger",
} as const

const sentimentLabel = {
  positive: "积极",
  neutral: "中性",
  negative: "负面",
}

export function AnswerMonitorPage() {
  const [items, setItems] = useState<AnswerMonitorItem[]>(answerItems.slice(0, 4))
  const [selectedItem, setSelectedItem] = useState<AnswerMonitorItem | null>(null)

  useEffect(() => {
    void listAnswerItems().then((nextItems) => setItems(nextItems.slice(0, 4)))
  }, [])

  return (
    <div>
      <PageHeader title="AI 答案监控" description="追踪不同 AI 平台在目标 Prompt 下是否提及品牌、引用官网和呈现正负倾向。" />
      <FilterBar searchPlaceholder="搜索 Prompt" filters={<div className="text-sm text-muted-foreground">{PLATFORMS.map((platform) => platform.label).join(" / ")}</div>} />
      <DataTable empty={items.length === 0}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prompt</TableHead>
              <TableHead>平台</TableHead>
              <TableHead>品牌提及</TableHead>
              <TableHead>官网引用</TableHead>
              <TableHead>位置</TableHead>
              <TableHead>情感</TableHead>
              <TableHead>竞品</TableHead>
              <TableHead>最后检查</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id}>
                <TableCell className="max-w-[360px]">
                  <div className="font-medium">{item.prompt}</div>
                  <div className="truncate text-xs text-muted-foreground">{item.answerExcerpt}</div>
                </TableCell>
                <TableCell>{PLATFORMS.find((platform) => platform.value === item.platform)?.label}</TableCell>
                <TableCell>
                  <StatusBadge tone={item.brandMentioned ? "success" : "warning"}>{item.brandMentioned ? "是" : "否"}</StatusBadge>
                </TableCell>
                <TableCell>
                  <StatusBadge tone={item.citedOfficialDomain ? "success" : "danger"}>{item.citedOfficialDomain ? "是" : "否"}</StatusBadge>
                </TableCell>
                <TableCell>{item.answerPosition ? `#${item.answerPosition}` : "-"}</TableCell>
                <TableCell>
                  <StatusBadge tone={sentimentTone[item.sentiment]}>{sentimentLabel[item.sentiment]}</StatusBadge>
                </TableCell>
                <TableCell>{item.competitorsMentioned.join("、") || "-"}</TableCell>
                <TableCell>{formatDateTime(item.checkedAt)}</TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2"
                    aria-label={index === 0 ? "查看答案" : `查看第 ${index + 1} 条答案`}
                    onClick={() => setSelectedItem(item)}
                  >
                    <Eye className="size-4" />
                    {index === 0 ? "查看答案" : "查看"}
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
      <AnswerDetailSheet item={selectedItem} open={Boolean(selectedItem)} onOpenChange={(open) => !open && setSelectedItem(null)} />
    </div>
  )
}
