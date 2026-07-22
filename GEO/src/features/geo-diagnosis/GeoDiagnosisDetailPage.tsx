import { useEffect, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { PageHeader } from "@/components/common/PageHeader"
import { ScoreCard } from "@/components/common/ScoreCard"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import type { DiagnosisRun } from "@/lib/types"
import { formatDateTime, formatScore } from "@/lib/format"
import { diagnosisRuns, scoreTrend } from "@/lib/mock-data"
import { getMockScoreTrend } from "@/services/mock-client"
import { getLatestDiagnosisRun } from "@/features/geo-diagnosis/diagnosis-service"

const chartConfig = {
  value: {
    label: "GEO 综合分",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig

export function GeoDiagnosisDetailPage() {
  const [run, setRun] = useState<DiagnosisRun | null>(diagnosisRuns[0])
  const [trend, setTrend] = useState<{ label: string; value: number }[]>(scoreTrend)

  useEffect(() => {
    let isMounted = true

    void Promise.all([getLatestDiagnosisRun(), getMockScoreTrend()]).then(([nextRun, nextTrend]) => {
      if (!isMounted) return
      setRun(nextRun)
      setTrend(nextTrend)
    })

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <div>
      <PageHeader title="诊断详情" description={run ? `${run.domain} · ${formatDateTime(run.createdAt)}` : "正在加载诊断结果"} />
      {run ? (
        <>
          <Card className="mb-4 rounded-lg">
            <CardContent className="flex items-center justify-between gap-4 p-5 max-md:flex-col max-md:items-start">
              <div>
                <div className="text-sm text-muted-foreground">GEO 综合分</div>
                <div className="mt-1 text-4xl font-semibold tracking-normal">{formatScore(run.geoScore)}</div>
              </div>
              <div className="max-w-3xl text-sm text-muted-foreground">{run.summary}</div>
              <StatusBadge tone="danger">高优先级</StatusBadge>
            </CardContent>
          </Card>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <ScoreCard label="AI 可引用性" score={run.aiCitability} helper="官网内容被 AI 作为回答来源引用的可能性" />
            <ScoreCard label="品牌权威度" score={run.brandAuthority} helper="品牌是否被持续识别并建立信任" />
            <ScoreCard label="E-E-A-T 信号" score={run.eeatSignal} helper="经验、专业性、权威性与可信度信号" />
            <ScoreCard label="内容结构" score={66} helper="标题、FAQ、证据与结构化数据的清晰度" />
          </div>
          <div className="mt-4 grid gap-4 xl:grid-cols-[1fr_420px]">
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="text-base">优化建议</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible defaultValue={run.recommendations[0]?.id}>
                  {run.recommendations.map((recommendation) => (
                    <AccordionItem key={recommendation.id} value={recommendation.id}>
                      <AccordionTrigger>{recommendation.title}</AccordionTrigger>
                      <AccordionContent>
                        <div className="space-y-3 text-sm text-muted-foreground">
                          <p>{recommendation.reason}</p>
                          <p className="text-foreground">{recommendation.action}</p>
                          <div>影响提问：{recommendation.affectedPrompts.join(", ")}</div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
            <Card className="rounded-lg">
              <CardHeader>
                <CardTitle className="text-base">评分趋势</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfig} className="h-64 w-full">
                  <BarChart data={trend}>
                    <CartesianGrid vertical={false} />
                    <XAxis dataKey="label" tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="value" fill="var(--color-value)" radius={4} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </>
      ) : null}
    </div>
  )
}
