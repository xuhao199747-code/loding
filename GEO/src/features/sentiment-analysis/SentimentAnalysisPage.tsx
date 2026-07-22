import { useState, type ReactNode } from "react"
import { ChevronDown, ChevronLeft, ChevronRight, Clock4, Component, Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

const sentimentRows = [
  { topic: "运输延迟", sentiment: "负面", count: "58", change: "-4.9%" },
  { topic: "响应迅速的客户服务", sentiment: "积极", count: "57", change: "+14.6%" },
  { topic: "无最低订单数量", sentiment: "负面", count: "58", change: "-4.9%" },
  { topic: "实惠的价格", sentiment: "积极", count: "32", change: "0.0%" },
  { topic: "竞争性定价", sentiment: "负面", count: "21", change: "-12.9%" },
  { topic: "工厂直销定价", sentiment: "负面", count: "12", change: "-2.9%" },
]

function FilterSelect({
  label,
  icon,
  value,
  items,
  onValueChange,
}: {
  label: string
  icon?: ReactNode
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
        <SelectTrigger className="h-10 w-[180px] rounded-md border-app-border bg-white text-sm font-normal text-app-ink shadow-none">
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

function CardShell({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn("rounded-xl border border-app-border bg-white", className)}>{children}</section>
}

function SentimentLineCard() {
  const xLabels = ["7月7日", "7月14日", "7月21日", "7月28日", "8月5日", "8月12日", "8月19日"]
  const yLabels = ["80%", "60%", "40%", "20%", "0%"]

  return (
    <CardShell className="h-[370px] min-w-0 overflow-hidden">
      <div className="flex h-[58px] items-center px-4">
        <h2 className="text-lg font-medium leading-[26px] text-app-ink">积极情绪</h2>
      </div>
      <div className="px-4 pb-4">
        <div className="flex h-12 items-center">
          <span className="w-[117px] text-[40px] font-semibold leading-[48px] text-app-ink">54.1%</span>
          <span className="self-end pb-1 text-lg font-medium leading-[26px] text-app-danger">-0.4%</span>
        </div>
        <div className="mt-6 grid h-[204px] grid-cols-[73px_minmax(0,1fr)]">
          <div className="flex flex-col items-center gap-6 border-r border-app-border text-right text-xs font-normal leading-5 text-app-ink">
            {yLabels.map((label) => (
              <span key={label} className="w-full pr-4">
                {label}
              </span>
            ))}
          </div>
          <div className="relative min-w-0 pl-0">
            <svg className="absolute inset-0 h-[164px] w-full overflow-visible" viewBox="0 0 604 164" preserveAspectRatio="none" aria-hidden="true">
              {[10, 44, 78, 112, 146].map((y) => (
                <line key={y} x1="0" x2="604" y1={y} y2={y} className="stroke-app-border-soft" strokeDasharray="6 8" strokeWidth="1" />
              ))}
              <path
                d="M0 55 C58 86 115 90 165 88 C215 86 245 113 294 77 C340 42 399 22 457 32 C511 41 538 70 604 84"
                fill="none"
                className="stroke-app-orange"
                strokeLinecap="round"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            </svg>
            <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs font-normal leading-5 text-app-ink">
              {xLabels.map((label) => (
                <span key={label}>{label}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </CardShell>
  )
}

function SentimentRatioCard() {
  return (
    <CardShell className="flex h-[370px] w-[636px] shrink-0 items-center justify-center p-4">
      <div className="flex w-full flex-col gap-10">
        <div className="flex h-[46px] gap-2">
          <div className="w-[131px] rounded-md bg-app-peach" />
          <div className="flex-1 rounded-md bg-app-mint" />
        </div>
        <div className="space-y-2 text-app-ink">
          <p className="text-base font-normal leading-6">28.6% 消极</p>
          <p className="text-sm font-normal leading-[22px]">缺乏用户评价，用户反馈有限，免费套餐有限</p>
        </div>
        <div className="space-y-2 text-app-ink">
          <p className="text-base font-normal leading-6">61.3% 积极</p>
          <p className="text-sm font-normal leading-[22px]">人性化的AI文本，多语言支持，语境感知的改写</p>
        </div>
      </div>
    </CardShell>
  )
}

function SentimentBadge({ sentiment }: { sentiment: string }) {
  const negative = sentiment === "负面"

  return (
    <Badge
      className={cn(
        "h-[22px] rounded-md border-0 px-1.5 text-xs font-normal leading-5",
        negative ? "bg-app-danger-soft text-app-danger" : "bg-app-success-soft text-app-success",
      )}
    >
      {sentiment}
    </Badge>
  )
}

function ChangeBadge({ value }: { value: string }) {
  const positive = value.startsWith("+")
  const neutral = value === "0.0%"

  return (
    <Badge
      className={cn(
        "h-[22px] rounded-md border-0 px-1.5 text-xs font-normal leading-5",
        positive && "bg-app-success-soft text-app-success",
        !positive && !neutral && "bg-app-danger-soft text-app-danger",
        neutral && "bg-app-panel text-app-muted",
      )}
    >
      {value}
    </Badge>
  )
}

function SentimentTopicsTable({ onOpenAnswer }: { onOpenAnswer: () => void }) {
  const [expandedTopic, setExpandedTopic] = useState("运输延迟")

  return (
    <CardShell className="overflow-hidden">
      <div className="h-[86px] px-4 py-4">
        <h2 className="text-lg font-medium leading-[26px] text-app-ink">情感模式</h2>
        <p className="mt-2 text-xs font-normal leading-5 text-app-muted">识别AI回复中反复出现的品牌情感主题、倾向和发生次数。</p>
      </div>

      <div className="px-4">
        <div className="grid h-11 grid-cols-[minmax(0,1fr)_328px_328px] items-center border-b border-app-border px-3 text-xs font-medium leading-5 text-app-ink">
          <span>模式</span>
          <span className="text-center">情感</span>
          <span className="text-center">发生次数</span>
        </div>

        {sentimentRows.map((row) => {
          const expanded = row.topic === expandedTopic

          return (
            <div key={row.topic} className="border-b border-app-border-soft">
              <button
                type="button"
                className="grid h-[46px] w-full grid-cols-[minmax(0,1fr)_328px_328px] items-center px-3 text-left text-sm font-normal leading-[22px] text-app-ink"
                onClick={() => setExpandedTopic(expanded ? "" : row.topic)}
              >
                <span className="flex min-w-0 items-center gap-3">
                  <ChevronDown className={cn("size-4 text-app-muted transition-transform", !expanded && "-rotate-90")} />
                  <span className="truncate">{row.topic}</span>
                </span>
                <span className="flex justify-center">
                  <SentimentBadge sentiment={row.sentiment} />
                </span>
                <span className="flex items-center justify-center gap-3">
                  <span className="w-[158px] text-right">{row.count}</span>
                  <span className="w-[158px] text-left">
                    <ChangeBadge value={row.change} />
                  </span>
                </span>
              </button>

              {expanded ? <ExpandedTopic onOpenAnswer={onOpenAnswer} /> : null}
            </div>
          )
        })}

        <div className="flex h-16 items-center justify-end gap-3 px-4 text-xs font-normal leading-5 text-app-muted">
          <span>0 of 100 row(s) selected.</span>
          <Button variant="outline" size="icon" className="size-8 rounded-md border-app-border shadow-none" aria-label="上一页">
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="outline" size="icon" className="size-8 rounded-md border-app-border shadow-none" aria-label="下一页">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>
    </CardShell>
  )
}

function ExpandedTopic({ onOpenAnswer }: { onOpenAnswer: () => void }) {
  return (
    <div className="bg-white pb-4">
      <div className="flex h-[76px] items-center justify-between px-3">
        <div>
          <h3 className="text-base font-normal leading-6 text-app-ink">运输延迟</h3>
          <p className="mt-2 text-xs font-normal leading-5 text-app-muted">围绕物流时效、承运商和配送体验产生的负面反馈。</p>
        </div>
        <Button
          type="button"
          variant="outline"
          onClick={onOpenAnswer}
          className="h-10 rounded-md border-app-border px-4 text-sm font-normal text-app-ink shadow-none"
        >
          <Eye className="size-4" />
          查看完整答案
        </Button>
      </div>
      <div className="mx-4 rounded-md border border-app-border bg-white p-4 text-sm font-normal leading-[22px] text-app-ink">
        <p>
          Nihao Jewelry 是一个受欢迎的在线批发平台，提供时尚珠宝和配饰，价格具有竞争力。他们全球发货，使用 DHL、FedEx 和 UPS
          等承运商，运输时间根据选择的交付方式从 8 到 35 个工作日不等。
        </p>
        <p className="mt-2">Pros:</p>
        <p className="mt-2 text-app-muted">
          产品种类丰富：超过 100,000 种款式可供选择，每天都有新商品添加 价格竞争力：价格实惠，有些商品低至 0.50 美元
          无最低订单：可以单件购买或大宗采购 响应迅速的客户服务：24/7 支持，配备个人客户经理
        </p>
      </div>
    </div>
  )
}

export function SentimentAnalysisPage({
  title = "情感分析",
  description = "AI响应对www.nihaojewelry.com的积极引用程度",
}: {
  title?: string
  description?: string
}) {
  const defaultFilters = {
    timeRange: "过去7天",
    comparison: "上一个周期",
    platform: "全部平台",
  }
  const [filters, setFilters] = useState(defaultFilters)
  const [isAnswerOpen, setIsAnswerOpen] = useState(false)

  const updateFilter = (key: keyof typeof filters) => (value: string) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="flex h-full min-h-[1424px] flex-col bg-white text-app-ink">
      <header className="sticky top-0 z-20 flex h-[110px] shrink-0 items-start justify-between bg-white px-6 py-6">
        <div>
          <h1 className="text-2xl font-semibold leading-8 tracking-normal text-app-ink">{title}</h1>
          <p className="mt-2 text-sm font-normal leading-[22px] text-app-muted">{description}</p>
        </div>
      </header>

      <main className="min-h-0 flex-1 px-6 pb-6">
        <section className="flex h-[92px] items-start pt-0">
          <div className="flex gap-4">
            <FilterSelect
              label="时间范围"
              icon={<Clock4 className="size-4 text-app-muted" />}
              value={filters.timeRange}
              items={["过去7天", "近 30 天", "近 90 天"]}
              onValueChange={updateFilter("timeRange")}
            />
            <FilterSelect label="比较" value={filters.comparison} items={["上一个周期", "前一个周期", "去年同期"]} onValueChange={updateFilter("comparison")} />
            <FilterSelect
              label="平台"
              icon={<Component className="size-4 text-app-muted" />}
              value={filters.platform}
              items={["全部平台", "Gemini", "ChatGPT"]}
              onValueChange={updateFilter("platform")}
            />
          </div>
        </section>

        <div className="grid gap-6">
          <section className="grid grid-cols-[minmax(0,1fr)_636px] gap-6">
            <SentimentLineCard />
            <SentimentRatioCard />
          </section>
          <SentimentTopicsTable onOpenAnswer={() => setIsAnswerOpen(true)} />
        </div>
      </main>

      <Sheet open={isAnswerOpen} onOpenChange={setIsAnswerOpen}>
        <SheetContent side="right" className="w-[640px] gap-0 overflow-y-auto bg-white p-0 sm:max-w-[640px]">
          <SheetHeader className="border-b border-app-border-soft px-6 py-5">
            <SheetTitle className="text-xl font-normal leading-7 text-app-ink">完整答案</SheetTitle>
            <SheetDescription className="text-sm font-normal text-app-muted">
              运输延迟相关情感证据和 AI 回复原文。
            </SheetDescription>
          </SheetHeader>
          <div className="space-y-4 px-6 py-5 text-sm font-normal leading-[22px] text-app-ink">
            <div className="rounded-lg border border-app-border bg-white p-4">
              Nihao Jewelry 是一个受欢迎的在线批发平台，提供时尚珠宝和配饰。用户反馈中较常提及运输时间、承运商选择和跨境交付体验。
            </div>
            <div className="rounded-lg bg-app-panel p-4 text-app-muted">
              证据摘要：负面情绪主要来自物流不确定性、免费套餐限制和缺少更多真实用户评价。
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}
