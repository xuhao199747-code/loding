import { ChevronDown } from "lucide-react"
import { Fragment } from "react"
import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { DataTable } from "@/components/common/DataTable"
import { FilterBar } from "@/components/common/FilterBar"
import { PageHeader } from "@/components/common/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { TopicInsight } from "@/lib/types"
import { topicInsights } from "@/lib/mock-data"
import { formatPercent } from "@/lib/format"
import { listTopicInsights } from "@/features/sentiment-analysis/sentiment-service"

const sentimentLabel = {
  positive: "积极",
  neutral: "中性",
  negative: "负面",
}

const sentimentTone = {
  positive: "success",
  neutral: "neutral",
  negative: "danger",
} as const

const chartConfig = {
  occurrences: {
    label: "发生次数",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function SentimentAnalysisPage() {
  const [topics, setTopics] = useState<TopicInsight[]>(topicInsights)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  useEffect(() => {
    void listTopicInsights().then(setTopics)
  }, [])

  return (
    <div>
      <PageHeader title="情感与话题" description="按 AI 答案中的高频模式聚合正负面情绪、发生次数和证据。" />
      <FilterBar searchPlaceholder="搜索话题、答案或情感模式" />
      <div className="mb-4 grid gap-4 xl:grid-cols-[1fr_420px]">
        <DataTable empty={topics.length === 0}>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>模式</TableHead>
                <TableHead>情感</TableHead>
                <TableHead>发生次数</TableHead>
                <TableHead>变化</TableHead>
                <TableHead className="text-right">操作</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topics.map((topic) => (
                <Fragment key={topic.id}>
                  <TableRow key={topic.id}>
                    <TableCell className="font-medium">{topic.topic}</TableCell>
                    <TableCell>
                      <StatusBadge tone={sentimentTone[topic.sentiment]}>{sentimentLabel[topic.sentiment]}</StatusBadge>
                    </TableCell>
                    <TableCell>{topic.occurrences}</TableCell>
                    <TableCell>
                      <StatusBadge tone={topic.changePercent < 0 ? "danger" : topic.changePercent > 0 ? "success" : "neutral"}>
                        {formatPercent(topic.changePercent)}
                      </StatusBadge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-2"
                        aria-label={`展开 ${topic.topic}`}
                        onClick={() => setExpandedId(expandedId === topic.id ? null : topic.id)}
                      >
                        <ChevronDown className="size-4" />
                        展开
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedId === topic.id ? (
                    <TableRow>
                      <TableCell colSpan={5}>
                        <div className="rounded-lg bg-muted/40 p-4 text-sm">
                          <div className="font-medium">{topic.topic}</div>
                          <p className="mt-2 text-muted-foreground">{topic.summary}</p>
                          <div className="mt-4 rounded-md border border-border bg-background p-3">{topic.evidence[0]}</div>
                          <Button variant="outline" size="sm" className="mt-4">
                            查看完整答案
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : null}
                </Fragment>
              ))}
            </TableBody>
          </Table>
        </DataTable>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">话题发生次数</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <BarChart data={topics}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="id" tickLine={false} axisLine={false} tickFormatter={() => ""} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="occurrences" fill="var(--color-occurrences)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
