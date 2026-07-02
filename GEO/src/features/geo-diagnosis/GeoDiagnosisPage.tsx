import { Calendar, Download, Eye, Info, Search } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { DataTable } from "@/components/common/DataTable"
import { PageHeader } from "@/components/common/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { DiagnosisRun } from "@/lib/types"
import { formatDateTime, formatScore } from "@/lib/format"
import { diagnosisRuns } from "@/lib/mock-data"
import { listDiagnosisRuns } from "@/features/geo-diagnosis/diagnosis-service"

export function GeoDiagnosisPage() {
  const [runs, setRuns] = useState<DiagnosisRun[]>(diagnosisRuns)

  useEffect(() => {
    void listDiagnosisRuns().then(setRuns)
  }, [])

  return (
    <div>
      <PageHeader title="GEO 诊断" description="输入域名并查看网页在 AI 答案中的可见度、可引用性和权威信号。" />
      <Tabs defaultValue="web" className="mb-4">
        <TabsList>
          <TabsTrigger value="domain">域名诊断</TabsTrigger>
          <TabsTrigger value="web">网页诊断</TabsTrigger>
        </TabsList>
      </Tabs>
      <Card className="mb-4 rounded-lg">
        <CardContent className="flex items-center gap-3 p-3 max-md:flex-col max-md:items-stretch">
          <div className="flex h-10 items-center rounded-md border border-border px-3 text-sm font-medium">域名</div>
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input className="pl-9" defaultValue="www.nihaojewelry.com" />
          </div>
          <Button variant="outline" className="gap-2">
            <Calendar className="size-4" />
            2026-03-10
          </Button>
          <Button>搜索</Button>
        </CardContent>
      </Card>
      <DataTable empty={runs.length === 0}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>域名</TableHead>
              <TableHead>
                <span className="inline-flex items-center gap-1">
                  GEO 综合 <Info className="size-3" />
                </span>
              </TableHead>
              <TableHead>AI 可引用性</TableHead>
              <TableHead>品牌权威性</TableHead>
              <TableHead>E-E-A-T 信号</TableHead>
              <TableHead>诊断时间</TableHead>
              <TableHead className="text-right">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {runs.map((run) => (
              <TableRow key={run.id}>
                <TableCell>
                  <div className="font-medium">{run.domain}</div>
                  <div className="text-xs text-muted-foreground">{run.summary}</div>
                </TableCell>
                <TableCell className="font-semibold">{formatScore(run.geoScore)}</TableCell>
                <TableCell>{formatScore(run.aiCitability)}</TableCell>
                <TableCell>{formatScore(run.brandAuthority)}</TableCell>
                <TableCell>{formatScore(run.eeatSignal)}</TableCell>
                <TableCell>{formatDateTime(run.createdAt)}</TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button variant="ghost" size="icon" aria-label="下载诊断">
                      <Download className="size-4" />
                    </Button>
                    <Button asChild variant="ghost" size="icon" aria-label="查看结果">
                      <Link to={`/diagnosis/${run.id}`}>
                        <Eye className="size-4" />
                      </Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
      <div className="mt-3">
        <StatusBadge tone="info">共 {runs.length} 次诊断记录</StatusBadge>
      </div>
    </div>
  )
}
