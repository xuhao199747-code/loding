import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { PageHeader } from "@/components/common/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

const competitorData = [
  { name: "Nihao", mentions: 76, citations: 61 },
  { name: "Faire", mentions: 82, citations: 70 },
  { name: "Alibaba", mentions: 69, citations: 65 },
  { name: "FashionTIY", mentions: 41, citations: 36 },
]

const chartConfig = {
  mentions: { label: "提及率", color: "var(--chart-1)" },
  citations: { label: "引用率", color: "var(--chart-2)" },
} satisfies ChartConfig

export function CompetitorsPage() {
  return (
    <div>
      <PageHeader title="竞争分析" description="比较品牌和竞品在 AI 答案中的提及、引用与话题优势。" />
      <div className="grid gap-4 xl:grid-cols-[1fr_420px]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">竞品份额</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-72 w-full">
              <BarChart data={competitorData}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="name" tickLine={false} axisLine={false} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="mentions" fill="var(--color-mentions)" radius={4} />
                <Bar dataKey="citations" fill="var(--color-citations)" radius={4} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">高风险 Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Prompt</TableHead>
                  <TableHead>领先竞品</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>Best wholesale jewelry suppliers</TableCell>
                  <TableCell>Faire</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>Reliable bulk jewelry supplier</TableCell>
                  <TableCell>Alibaba</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
