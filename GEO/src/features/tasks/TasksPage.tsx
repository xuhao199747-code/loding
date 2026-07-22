import {
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"]

const calendarDays = [
  1, 2, 3, 4, 5, 6, 7,
  8, 8, 10, 11, 12, 13, 14,
  15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28,
  29, 30, 31, 1, 2, 3, 4,
  5, 6, 7, 8, 9, 10, 11,
]

const scheduledEventCells = new Map<number, string[]>([
  [9, ["09:00 品牌日报"]],
  [14, ["09:00 品牌日报"]],
  [15, ["09:00 品牌日报"]],
])

const todayTasks = [
  {
    title: "09:00 品牌日报",
    description: "自动生成今日品牌健康报告，并发送到指定会话",
    accentClass: "bg-blue-500",
  },
  {
    title: "13:00 竞品超越预警",
    description: "竞品在文心一言的提及率超过品牌 8%",
    accentClass: "bg-app-danger",
  },
  {
    title: "13:00 竞品超越预警",
    description: "竞品在文心一言的提及率超过品牌 8%",
    accentClass: "bg-amber-500",
  },
]

const upcomingDeliveries = [
  ["品牌日报", "1 天后"],
  ["趋势响应方案", "1 天后"],
  ["品牌日报", "1 天后"],
  ["AI 问题策略清单", "2 天后"],
]

export function TasksPage() {
  return (
    <div className="flex h-screen min-h-[720px] overflow-hidden bg-white text-foreground">
      <section className="flex min-w-0 flex-1 flex-col bg-muted">
        <header className="flex h-16 shrink-0 items-center border-b border-app-border bg-white px-4">
          <h1 className="min-w-0 flex-1 text-base font-medium leading-6">任务日历</h1>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon-sm" className="size-8 text-foreground" aria-label="上个月">
              <ChevronLeft className="size-4" />
            </Button>
            <div className="w-[112px] whitespace-nowrap text-center text-sm leading-[22px]">2026 年 3 月</div>
            <Button variant="ghost" size="icon-sm" className="size-8 text-foreground" aria-label="下个月">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </header>

        <main className="min-h-0 flex-1 p-4">
          <div className="grid h-full grid-cols-7 grid-rows-[44px_repeat(6,minmax(78px,1fr))] overflow-hidden rounded-xl border border-app-border bg-white">
            {weekDays.map((day, index) => (
              <div
                key={day}
                className={cn(
                  "flex items-center justify-center border-b border-app-border text-sm leading-[22px]",
                  index < weekDays.length - 1 && "border-r",
                )}
              >
                {day}
              </div>
            ))}
            {calendarDays.map((day, index) => {
              const events = scheduledEventCells.get(index) ?? []
              const inNextMonth = index >= 31
              const isSelected = index === 9

              return (
                <div
                  key={`${day}-${index}`}
                  className={cn(
                    "min-h-0 border-app-border p-3",
                    index % 7 !== 6 && "border-r",
                    index < 35 && "border-b",
                    inNextMonth && "bg-app-surface",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-[26px] items-center justify-center text-sm leading-[22px]",
                      isSelected && "rounded-full bg-app-orange text-white",
                    )}
                  >
                    {day}
                  </div>
                  <div className="mt-1.5 flex flex-col gap-1">
                    {events.map((event) => (
                      <div key={`${event}-${index}`} className="max-w-[92px] truncate rounded bg-app-panel px-2 py-0.5 text-sm leading-5">
                        {event}
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </main>
      </section>
      <TaskPanel />
    </div>
  )
}

function TaskPanel() {
  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-app-border bg-white">
      <header className="flex h-16 shrink-0 items-center border-b border-app-border px-4">
        <h2 className="min-w-0 flex-1 text-base font-medium leading-6">3 月 14 日，周六</h2>
        <div className="text-sm leading-[22px]">
          <span className="font-medium">2</span> 个任务
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col justify-between gap-6 p-4">
        <section className="flex flex-col gap-4">
          <h3 className="text-base font-medium leading-6">今日任务</h3>
          <div className="flex flex-col gap-3">
            {todayTasks.map((task, index) => (
              <article key={`${task.title}-${index}`} className="flex gap-3 rounded-lg bg-slate-100 p-3">
                <div className={cn("w-1 shrink-0 rounded-full", task.accentClass)} />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-base font-medium leading-6">{task.title}</div>
                  <div className="truncate text-sm leading-[22px] text-app-muted">{task.description}</div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-3">
          <h3 className="text-base font-medium leading-6">未来 7 天到期</h3>
          <div className="flex flex-col">
            {upcomingDeliveries.map(([title, due], index) => (
              <div key={`${title}-${index}`} className="flex h-[37px] items-center justify-between rounded-md px-3 py-2 text-sm leading-[22px]">
                <div className="flex min-w-0 items-center gap-2">
                  <span className="size-1.5 shrink-0 rounded-full bg-blue-500" />
                  <span className="min-w-0 truncate">{title}</span>
                </div>
                <span className="shrink-0 text-xs leading-5">{due}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </aside>
  )
}
