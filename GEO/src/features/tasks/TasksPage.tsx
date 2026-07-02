import { PageHeader } from "@/components/common/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { tasks } from "@/lib/mock-data"

export function TasksPage() {
  return (
    <div>
      <PageHeader title="任务计划" description="把内容机会分配给负责人，并跟踪复测前的执行状态。" />
      <Card className="rounded-lg">
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>任务</TableHead>
                <TableHead>状态</TableHead>
                <TableHead>负责人</TableHead>
                <TableHead>优先级</TableHead>
                <TableHead>截止时间</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tasks.map((task) => (
                <TableRow key={task.id}>
                  <TableCell className="font-medium">{task.title}</TableCell>
                  <TableCell><StatusBadge tone="info">{task.status}</StatusBadge></TableCell>
                  <TableCell>{task.owner}</TableCell>
                  <TableCell><StatusBadge tone="danger">{task.priority}</StatusBadge></TableCell>
                  <TableCell>{task.dueDate}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
