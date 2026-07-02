import { Activity, Bot, FileText, Lightbulb, Quote } from "lucide-react"
import { useEffect, useState } from "react"
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"
import { MetricCard } from "@/components/common/MetricCard"
import { PageHeader } from "@/components/common/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { ChartConfig } from "@/components/ui/chart"
import type { ContentOpportunity, DiagnosisRun } from "@/lib/types"
import { formatDateTime, formatScore } from "@/lib/format"
import { getMockOpportunities, getMockScoreTrend } from "@/services/mock-client"
import { getProjectSummary } from "@/features/projects/project-service"

const chartConfig = {
  value: {
    label: "GEO 综合",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function DashboardPage() {
  const [latestRun, setLatestRun] = useState<DiagnosisRun | null>(null)
  const [opportunities, setOpportunities] = useState<ContentOpportunity[]>([])
  const [trend, setTrend] = useState<{ label: string; value: number }[]>([])

  useEffect(() => {
    void Promise.all([getProjectSummary(), getMockOpportunities(), getMockScoreTrend()]).then(
      ([summary, nextOpportunities, nextTrend]) => {
        setLatestRun(summary.latestRun)
        setOpportunities(nextOpportunities)
        setTrend(nextTrend)
      },
    )
  }, [])

  return (
    <div>
      <PageHeader
        title="工作台"
        description="查看当前项目的 GEO 表现、AI 答案变化和最需要推进的内容机会。"
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
        <MetricCard title="GEO 综合" value={latestRun ? formatScore(latestRun.geoScore) : "--"} icon={<Activity className="size-4" />} />
        <MetricCard title="AI 可引用性" value={latestRun ? formatScore(latestRun.aiCitability) : "--"} icon={<Quote className="size-4" />} />
        <MetricCard title="品牌提及率" value="76%" helper="较上周 +8.2%" icon={<Bot className="size-4" />} />
        <MetricCard title="官网引用率" value="61%" helper="3 个 Prompt 待补强" icon={<FileText className="size-4" />} />
        <MetricCard title="内容机会" value={`${opportunities.length}`} helper="2 个高优先级" icon={<Lightbulb className="size-4" />} />
      </div>
      <div className="mt-5 grid gap-4 xl:grid-cols-[1.3fr_1fr]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">GEO 分数趋势</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-64 w-full">
              <AreaChart data={trend}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Area dataKey="value" type="monotone" fill="var(--color-value)" stroke="var(--color-value)" />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">优先内容机会</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>机会</TableHead>
                  <TableHead>优先级</TableHead>
                  <TableHead>影响分</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {opportunities.slice(0, 4).map((opportunity) => (
                  <TableRow key={opportunity.id}>
                    <TableCell className="font-medium">{opportunity.title}</TableCell>
                    <TableCell>
                      <StatusBadge tone={opportunity.severity === "high" ? "danger" : "warning"}>
                        {opportunity.severity === "high" ? "高" : "中"}
                      </StatusBadge>
                    </TableCell>
                    <TableCell>{opportunity.impactScore}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {latestRun ? <p className="mt-4 text-xs text-muted-foreground">最近诊断：{formatDateTime(latestRun.createdAt)}</p> : null}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
