import { Download } from "lucide-react"
import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const reports = ["周报", "月报", "诊断报告", "竞品报告"]

export function ReportsPage() {
  return (
    <div>
      <PageHeader title="报告中心" description="生成面向团队和客户的 GEO 表现报告。" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {reports.map((report) => (
          <Card key={report} className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-base">{report}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-muted-foreground">
              <p>包含 GEO 分数、AI 引用、情感变化和内容机会进展。</p>
              <Button variant="outline" size="sm" className="gap-2">
                <Download className="size-4" />
                导出
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
