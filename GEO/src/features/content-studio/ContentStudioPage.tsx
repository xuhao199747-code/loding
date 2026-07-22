import { ArrowDownUp, Clock4, Component, Download, MapPin, Plus } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const topics = [
  { name: "AI 博客生成器", prompts: "53 个提示", share: "15.7%" },
  { name: "AI 内容检测", prompts: "52 个提示", share: "5.7%" },
  { name: "批发市场", prompts: "53 个提示", share: "15.7%" },
]

const rows = [
  { prompt: "哪个是针对细分行业的最佳 AI 博客构建器？", score: "12.3%", trend: "-1.4%", monthly: 5, average: "高", data: "44" },
  { prompt: "如何为 B2B 批发市场批量生成 SEO 博客？", score: "12.3%", trend: "-1.4%", monthly: 4, average: "低", data: "44" },
  { prompt: "哪些 AI 写作工具更适合跨境电商品牌？", score: "12.3%", trend: "-1.4%", monthly: 5, average: "高", data: "44" },
  { prompt: "AI 生成内容如何提升 Alibaba.com 店铺可见性？", score: "12.3%", trend: "-1.4%", monthly: 5, average: "中", data: "44" },
  { prompt: "批发采购场景下用户最常问哪些产品问题？", score: "12.3%", trend: "-1.4%", monthly: 5, average: "低", data: "44" },
  { prompt: "如何让品牌内容更容易被 AI 回答引用？", score: "12.3%", trend: "-1.4%", monthly: 5, average: "中", data: "44" },
  { prompt: "哪些内容结构会影响 AI 对品牌的推荐概率？", score: "12.3%", trend: "-1.4%", monthly: 5, average: "高", data: "44" },
  { prompt: "竞品在 AI 搜索回答中通常被如何描述？", score: "12.3%", trend: "-1.4%", monthly: 5, average: "缺失", data: "44" },
  { prompt: "平台型商家如何建立可被引用的 FAQ 内容？", score: "12.3%", trend: "-1.4%", monthly: 5, average: "中", data: "44" },
]

function MetricDots({ value }: { value: number }) {
  return (
    <div className="flex items-center justify-center gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={cn("size-2 rounded-full", index < value ? "bg-app-orange" : "bg-app-border")}
        />
      ))}
    </div>
  )
}

function AveragePill({ value }: { value: string }) {
  const styles: Record<string, string> = {
    高: "bg-app-green-soft text-app-green",
    中: "bg-app-warning-soft text-app-warning",
    低: "bg-app-red-soft text-app-red",
    缺失: "bg-app-panel text-muted-foreground",
  }

  return (
    <span className={cn("inline-flex h-[22px] items-center rounded-md px-1.5 text-xs font-normal", styles[value])}>
      {value}
    </span>
  )
}

function FilterSelect({
  label,
  icon,
  value,
  items,
  onValueChange,
}: {
  label: string
  icon?: React.ReactNode
  value: string
  items: string[]
  onValueChange?: (value: string) => void
}) {
  return (
    <div className="w-[180px] space-y-2">
      <div className="flex h-5 items-center gap-1.5 text-sm font-normal leading-5 text-app-ink">
        {icon}
        <span>{label}</span>
      </div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-10 w-[180px] border-app-border bg-white text-sm font-normal text-app-ink shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function QuestionFilterSelect({
  label,
  icon,
  value,
  items,
}: {
  label: string
  icon: React.ReactNode
  value: string
  items: string[]
}) {
  return (
    <div className="w-full space-y-2">
      <div className="flex h-5 items-center gap-1.5 text-sm font-normal leading-5 text-app-muted">
        {icon}
        <span>{label}</span>
      </div>
      <Select value={value}>
        <SelectTrigger className="h-10 w-full rounded-md border-app-border bg-white text-sm font-normal text-app-ink shadow-none">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {items.map((item) => (
            <SelectItem key={item} value={item}>
              {item}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

function MentionRateChart() {
  const xLabels = ["07月01日", "07月02日", "07月03日", "07月04日"]
  const yLabels = ["100%", "75%", "50%", "25%", "0%"]

  return (
    <div className="h-[300px] rounded-lg border border-app-border bg-white p-4">
      <h3 className="text-lg font-semibold leading-7 text-app-ink">品牌提及率</h3>
      <div className="mt-5 flex items-baseline gap-2">
        <span className="text-2xl font-semibold leading-8 text-app-ink">100.0%</span>
        <span className="text-sm font-normal text-app-success">+100.0%</span>
      </div>
      <div className="mt-6 grid h-[156px] grid-cols-[42px_minmax(0,1fr)]">
        <div className="flex h-[132px] flex-col justify-between text-right text-xs text-app-muted">
          {yLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className="ml-3">
          <div className="relative h-[132px]">
          <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 312 132" preserveAspectRatio="none" aria-hidden="true">
            {[0, 33, 66, 99, 132].map((y) => (
              <line key={y} x1="0" x2="312" y1={y} y2={y} className="stroke-app-border-soft" strokeWidth="1" />
            ))}
            <path d="M0 0 L312 0" fill="none" className="stroke-app-orange" strokeLinecap="round" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </svg>
          </div>
          <div className="mt-2 flex justify-between text-xs text-app-muted">
            {xLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PlatformMentionChart() {
  const platforms = [
    { label: "G", className: "bg-app-orange" },
    { label: "百", className: "bg-red-500" },
    { label: "N", className: "bg-violet-500" },
    { label: "豆", className: "bg-blue-100" },
    { label: "K", className: "bg-black" },
    { label: "✹", className: "bg-teal-600" },
  ]

  return (
    <div className="h-[300px] rounded-lg border border-app-border bg-white p-4">
      <h3 className="text-lg font-semibold leading-7 text-app-ink">按平台的品牌提及率</h3>
      <div className="mt-5 grid h-[216px] grid-cols-[42px_minmax(0,1fr)]">
        <div className="flex h-[186px] flex-col justify-between text-right text-xs text-app-muted">
          {["100%", "75%", "50%", "25%", "0%"].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
        <div className="ml-3 flex h-[216px] items-end justify-around">
          {platforms.map((item) => (
            <div key={item.label} className="flex h-full flex-col items-center justify-end gap-3">
              <div className={cn("h-[176px] w-8 rounded-md", item.className)} />
              <span className="flex size-5 items-center justify-center text-xs text-app-ink">{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function QuestionDataTable({ question }: { question: (typeof rows)[number] }) {
  const tableRows = [
    { mentioned: "是", answer: "ID 智能手机迁移需要先进行云备份，并确认账号同步状态。", platform: "Kimi", region: "中国", date: "2026-07-04" },
    { mentioned: "是", answer: "建议通过官方迁移工具完成联系人、照片和应用数据转移。", platform: "豆包", region: "中国", date: "2026-07-03" },
    { mentioned: "否", answer: question.prompt, platform: "Google AI", region: "美国", date: "2026-07-02" },
  ]

  return (
    <div className="rounded-lg border border-app-border bg-white">
      <div className="flex h-14 items-center justify-between border-b border-app-border px-4">
        <h3 className="text-lg font-semibold leading-7 text-app-ink">数据</h3>
        <button
          type="button"
          aria-label="导出"
          className="flex size-8 items-center justify-center rounded-md text-app-ink hover:bg-app-panel"
        >
          <Download className="size-5" />
        </button>
      </div>
      <div className="grid h-10 grid-cols-[80px_minmax(0,1fr)_120px_100px_120px] items-center border-b border-app-border-soft px-4 text-xs font-medium text-app-ink">
        <span>已提及</span>
        <span>AI 回答</span>
        <span className="text-center">平台</span>
        <span className="text-center">地区</span>
        <span className="text-right">日期</span>
      </div>
      {tableRows.map((row, index) => (
        <div
          key={`${row.platform}-${index}`}
          className="grid h-14 grid-cols-[80px_minmax(0,1fr)_120px_100px_120px] items-center border-b border-app-border-soft px-4 text-sm font-normal text-app-ink"
        >
          <span>{row.mentioned}</span>
          <span className="truncate pr-5 text-app-muted">{row.answer}</span>
          <span className="text-center">{row.platform}</span>
          <span className="text-center">{row.region}</span>
          <span className="text-right">{row.date}</span>
        </div>
      ))}
    </div>
  )
}

function QuestionDetailSheet({ question }: { question: (typeof rows)[number] }) {
  return (
    <>
      <SheetHeader className="sticky top-0 z-10 border-b border-app-border-soft bg-white px-6 py-5">
        <SheetTitle className="text-2xl font-semibold leading-8 tracking-normal text-app-ink">AI 问题</SheetTitle>
        <SheetDescription className="text-sm font-normal text-app-muted">
          查看该问题的品牌提及率、平台分布和 AI 回复数据。
        </SheetDescription>
      </SheetHeader>
      <div className="space-y-4 px-6 py-5 text-sm font-normal leading-[22px] text-app-ink">
        <h2 className="text-xl font-semibold leading-7 text-app-ink">{question.prompt}</h2>

        <section>
          <div className="grid grid-cols-3 gap-4">
            <QuestionFilterSelect
              label="时间范围"
              icon={<Clock4 className="size-4" />}
              value="最近 7 天"
              items={["最近 7 天", "近 30 天", "近 90 天"]}
            />
            <QuestionFilterSelect
              label="平台"
              icon={<Component className="size-4" />}
              value="选择平台"
              items={["选择平台", "Google AI", "Kimi", "豆包", "DeepSeek"]}
            />
            <QuestionFilterSelect
              label="地区"
              icon={<MapPin className="size-4" />}
              value="选择地区"
              items={["选择地区", "中国", "美国", "欧洲"]}
            />
          </div>
        </section>

        <section className="grid grid-cols-2 gap-4">
          <MentionRateChart />
          <PlatformMentionChart />
        </section>

        <section>
          <QuestionDataTable question={question} />
        </section>
      </div>
    </>
  )
}

export function ContentStudioPage() {
  const defaultFilters = {
    timeRange: "近 30 天",
    comparison: "上一周期",
    platform: "全部平台",
  }
  const [filters, setFilters] = useState(defaultFilters)
  const [activeTopic, setActiveTopic] = useState(topics[0]?.name ?? "")
  const [isAddQuestionOpen, setIsAddQuestionOpen] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<(typeof rows)[number] | null>(null)

  const updateFilter = (key: keyof typeof filters) => (value: string) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="flex h-full min-h-[800px] flex-col bg-white text-app-ink">
      <header className="sticky top-0 z-20 flex h-[110px] shrink-0 items-start justify-between bg-white px-6 py-6">
        <div>
          <h1 className="text-2xl font-semibold leading-8 tracking-normal text-app-ink">AI对话记录</h1>
          <p className="mt-2 text-sm font-normal leading-[22px] text-app-muted">265个提示，涵盖8个主题，每天运行</p>
        </div>
        <Button
          type="button"
          onClick={() => setIsAddQuestionOpen(true)}
          className="mt-[11px] h-10 gap-2 rounded-md bg-app-ink px-4 text-sm font-medium text-white shadow-none hover:bg-app-ink-soft"
        >
          <Plus className="size-4" />
          添加问题
        </Button>
      </header>

      <main className="min-h-0 flex-1 px-6 pt-0">
        <section className="flex h-[92px] items-start pt-0">
          <div className="flex h-[68px] gap-4">
            <FilterSelect
              label="时间范围"
              icon={<Clock4 className="size-4 text-app-muted" />}
              value={filters.timeRange}
              items={["近 7 天", "近 30 天", "近 90 天"]}
              onValueChange={updateFilter("timeRange")}
            />
            <FilterSelect label="比较" value={filters.comparison} items={["上一周期", "上月", "去年同期"]} onValueChange={updateFilter("comparison")} />
            <FilterSelect
              label="平台"
              icon={<Component className="size-4 text-app-muted" />}
              value={filters.platform}
              items={["全部平台", "ChatGPT", "Google AI", "Perplexity", "豆包"]}
              onValueChange={updateFilter("platform")}
            />
          </div>
        </section>

        <section className="grid h-[684px] min-h-0 grid-cols-[180px_minmax(0,1fr)] overflow-hidden rounded-xl border border-app-border bg-white">
          <aside className="border-r border-app-border">
            <div className="flex h-[72px] items-center justify-between border-b border-app-border px-4">
              <span className="text-sm font-medium leading-[22px] text-app-ink">Topics</span>
              <ArrowDownUp className="size-3 text-app-muted" />
            </div>
            <div className="p-1">
              {topics.map((topic, index) => (
                <Button
                  key={`${topic.name}-${index}`}
                  type="button"
                  variant="ghost"
                  aria-pressed={activeTopic === topic.name}
                  onClick={() => {
                    setActiveTopic(topic.name)
                  }}
                  className={cn(
                    "mb-2 h-[58px] w-full justify-start rounded-md px-3 py-2 text-left font-normal shadow-none hover:bg-app-panel",
                    activeTopic === topic.name && "bg-app-panel",
                  )}
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium leading-[22px] text-app-ink">{topic.name}</div>
                    <div className="mt-0.5 flex items-center gap-3 text-xs font-normal leading-5 text-app-muted">
                      <span>{topic.prompts}</span>
                      <span>{topic.share}</span>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </aside>

          <div className="min-w-0 overflow-hidden">
            <div className="grid h-[72px] grid-cols-[250px_repeat(5,minmax(120px,1fr))] border-b border-app-border text-xs font-medium text-app-ink">
              <div className="flex items-center px-4">问题</div>
              <div className="flex items-center justify-center gap-2">
                可见性得分
                <ArrowDownUp className="size-3 text-app-muted" />
              </div>
              <div className="flex items-center justify-center gap-2">
                可见性趋势
                <ArrowDownUp className="size-3 text-app-muted" />
              </div>
              <div className="flex items-center justify-center gap-2 text-center leading-5">
                每月流量<br />更新于10号
                <ArrowDownUp className="size-3 text-app-muted" />
              </div>
              <div className="flex items-center justify-center">平均</div>
              <div className="flex items-center justify-center gap-2">
                数据
                <ArrowDownUp className="size-3 text-app-muted" />
              </div>
            </div>

            <div className="h-[612px] overflow-auto">
              {rows.map((row, index) => (
                <button
                  type="button"
                  key={`${row.prompt}-${index}`}
                  onClick={() => setSelectedQuestion(row)}
                  className="grid h-[68px] w-full grid-cols-[250px_repeat(5,minmax(120px,1fr))] border-b border-app-border-soft text-left text-sm font-normal leading-[22px] text-app-ink hover:bg-app-surface"
                >
                  <div className="flex items-center px-4">
                    <span className="line-clamp-2 max-w-[226px] whitespace-normal">{row.prompt}</span>
                  </div>
                  <div className="flex items-center justify-center">{row.score}</div>
                  <div className="flex items-center justify-center">
                    <span className="inline-flex h-5 items-center rounded-md bg-app-red-soft px-1.5 text-xs text-red-600">
                      {row.trend}
                    </span>
                  </div>
                  <div className="flex items-center justify-center">
                    <MetricDots value={row.monthly} />
                  </div>
                  <div className="flex items-center justify-center">
                    <AveragePill value={row.average} />
                  </div>
                  <div className="flex items-center justify-center">{row.data}</div>
                </button>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Dialog open={isAddQuestionOpen} onOpenChange={setIsAddQuestionOpen}>
        <DialogContent className="max-w-[520px] rounded-xl border-app-border bg-white p-6 text-app-ink">
          <DialogTitle className="text-lg font-semibold leading-7 text-app-ink">添加问题</DialogTitle>
          <DialogDescription className="text-sm font-normal leading-[22px] text-app-muted">
            创建新的监控问题后，会加入当前主题并按周期运行。
          </DialogDescription>
          <div className="mt-4 rounded-lg border border-app-border bg-white p-4 text-sm leading-[22px] text-app-muted">
            示例：哪些 AI 写作工具更适合跨境电商品牌？
          </div>
        </DialogContent>
      </Dialog>

      <Sheet open={Boolean(selectedQuestion)} onOpenChange={(open) => !open && setSelectedQuestion(null)}>
        <SheetContent side="right" className="w-[960px] max-w-[calc(100vw-72px)] gap-0 overflow-y-auto bg-white p-0 sm:max-w-[960px]">
          {selectedQuestion ? <QuestionDetailSheet question={selectedQuestion} /> : null}
        </SheetContent>
      </Sheet>
    </div>
  )
}
