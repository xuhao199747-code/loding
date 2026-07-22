import type { ReactNode } from "react"
import { ChevronsLeft, ChevronsRight, ChevronLeft, ChevronRight, Clock4 } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import alibabaLogo from "@/assets/geo/alibaba.png"
import amazonLogo from "@/assets/geo/amazon.png"
import microsoftLogo from "@/assets/geo/microsoft.svg"
import sheinLogo from "@/assets/geo/shein.png"
import shopeeLogo from "@/assets/geo/shopee.jpg"
import { cn } from "@/lib/utils"

const topics = ["所有主题", "AI 博客生成器", "全球贸易解决方案", "批发市场"]

const rankLogos = [
  { name: "Wish", src: microsoftLogo, className: "bg-sky-400" },
  { name: "Shopee", src: shopeeLogo },
  { name: "Amazon", src: amazonLogo },
  { name: "Faire", letter: "F", className: "bg-black text-white" },
  { name: "Shein", src: sheinLogo },
  { name: "Global Sources", letter: "G", className: "bg-[repeating-linear-gradient(135deg,var(--color-red-500)_0_2px,var(--color-background)_2px_4px)] text-transparent" },
  { name: "eBay", letter: "eBay", className: "bg-white text-[9px] font-semibold text-blue-600" },
  { name: "Alibaba.com", src: alibabaLogo },
]

const rows = [
  {
    topic: "AI 博客生成器",
    prompt: "我如何使用 AI 创建完整的博客文章？",
    ranking: [0, 1, 2, 3, 4, 5, 6, 7],
    brand: "#32",
    activeTopic: true,
    highlighted: true,
  },
  {
    topic: "AI 博客生成器",
    prompt: "针对特定行业的最佳 AI 博客构建器是什么？",
    ranking: [5, 6, 1, 7, 0, 4, 3, 2],
    brand: "#12",
  },
  {
    topic: "AI 博客生成器",
    prompt: "谁提供批量博客内容生成服务？",
    ranking: [0, 2, 5, 3, 1, 7, 6, 4],
    brand: "#8",
  },
  {
    topic: "全球贸易解决方案",
    prompt: "针对特定行业的最佳 AI 博客构建器是什么？",
    ranking: [3, 6, 1, 7, 4, 0, 2, 5],
    brand: "#8",
  },
  {
    topic: "全球贸易解决方案",
    prompt: "谁提供带有 SEO 优化的 AI 博客写作？",
    ranking: [3, 4, 5, 6, 2, 1, 7, 0],
    brand: "#42",
  },
  {
    topic: "全球贸易解决方案",
    prompt: "生成大规模博客内容的最佳 AI 工具是什么？",
    ranking: [5, 6, 1, 7, 0, 4, 3, 2],
    brand: "#15",
  },
  {
    topic: "批发市场",
    prompt: "如何安排和发布 AI 生成的博客内容？",
    ranking: [6, 4, 0, 1, 3, 2, 7, 5],
    brand: "#31",
  },
  {
    topic: "批发市场",
    prompt: "如何使用 AI 创建博客大纲和草稿？",
    ranking: [3, 0, 6, 5, 1, 7, 2, 4],
    brand: "#12",
  },
  {
    topic: "批发市场",
    prompt: "哪个平台可以将关键词转化为完整的博客文章？",
    ranking: [5, 7, 1, 3, 0, 4, 6, 2],
    brand: "#2",
  },
  {
    topic: "批发市场",
    prompt: "哪个 AI 工具生成引人入胜的博客开头和结尾？",
    ranking: [4, 5, 3, 6, 1, 7, 2, 0],
    brand: "#30",
  },
]

function FilterSelect({
  icon,
  items,
  label,
  value,
  onValueChange,
}: {
  icon?: ReactNode
  items: string[]
  label: string
  value: string
  onValueChange?: (value: string) => void
}) {
  return (
    <div className="w-[180px] space-y-2">
      <div className="flex h-5 items-center gap-1.5 text-sm font-normal leading-5 text-app-ink">
        {icon}
        <span>{label}</span>
      </div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-10 w-[180px] rounded-md border-app-border bg-white px-3 text-sm font-normal text-app-ink shadow-none">
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

function RankLogo({ index }: { index: number }) {
  const logo = rankLogos[index]

  return (
    <div
      className={cn(
        "flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full border border-transparent bg-white text-[11px] font-medium leading-none text-app-ink",
        logo.className,
      )}
      title={logo.name}
      aria-label={logo.name}
    >
      {logo.src ? <img src={logo.src} alt={`${logo.name} 标志`} className="size-full object-cover" /> : logo.letter}
    </div>
  )
}

function PaginationButton({ children, disabled, onClick }: { children: ReactNode; disabled?: boolean; onClick?: () => void }) {
  return (
    <Button
      type="button"
      variant="outline"
      size="icon-sm"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        "size-8 rounded-md border-app-border bg-white text-app-ink shadow-none hover:bg-white",
        disabled && "opacity-40",
      )}
    >
      {children}
    </Button>
  )
}

export function ReportsPage() {
  const defaultFilters = {
    timeRange: "过去 7 天",
    comparison: "上一个周期",
  }
  const [filters, setFilters] = useState(defaultFilters)
  const [activeTopic, setActiveTopic] = useState("AI 博客生成器")
  const [page, setPage] = useState(1)

  const updateFilter = (key: keyof typeof filters) => (value: string) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="flex min-h-full flex-col bg-white text-app-ink">
      <header className="flex h-[103px] shrink-0 flex-col justify-center px-6">
        <h1 className="text-2xl font-semibold leading-8 tracking-normal text-app-ink">品牌提及率排名</h1>
        <p className="mt-2 text-sm font-normal leading-[22px] text-app-ink">查看各话题下的提示词及品牌排名情况</p>
      </header>

      <main className="flex flex-1 flex-col gap-6 px-6 pb-6">
        <section className="flex h-[75px] items-start">
          <div className="flex gap-4">
            <FilterSelect
              icon={<Clock4 className="size-4 text-app-muted" />}
              items={["过去 7 天", "近 30 天", "近 90 天"]}
              label="时间范围"
              value={filters.timeRange}
              onValueChange={updateFilter("timeRange")}
            />
            <FilterSelect items={["上一个周期", "前一个周期", "去年同期"]} label="对比" value={filters.comparison} onValueChange={updateFilter("comparison")} />
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-app-border bg-white">
          <div className="grid h-11 grid-cols-[clamp(200px,17vw,250px)_minmax(220px,1fr)_clamp(310px,37vw,527px)] items-center border-b border-app-border text-xs font-medium leading-5 text-app-ink">
            <div className="flex items-center px-6">
              <span className="inline-flex items-center gap-2 rounded-md px-3">主题</span>
            </div>
            <div className="px-4">提示词</div>
            <div className="grid grid-cols-[repeat(8,minmax(26px,48px))_minmax(55px,79px)] items-center justify-between">
              {Array.from({ length: 8 }, (_, index) => (
                <span key={index} className="text-center">
                  #{index + 1}
                </span>
              ))}
              <span className="text-center">我的品牌</span>
            </div>
          </div>

          <div className="grid grid-cols-[clamp(200px,17vw,250px)_minmax(220px,1fr)_clamp(310px,37vw,527px)]">
            <aside className="border-r border-app-border px-3 pt-3">
              {topics.map((topic, index) => (
                <Button
                  key={topic}
                  type="button"
                  variant="ghost"
                  aria-pressed={activeTopic === topic}
                  onClick={() => {
                    setActiveTopic(topic)
                  }}
                  className={cn(
                    "flex h-[49px] w-full items-center justify-center rounded-lg px-3 text-sm font-normal leading-[22px] text-app-ink shadow-none hover:bg-app-panel",
                    (activeTopic === topic || (index === 1 && activeTopic === "AI 博客生成器")) && "bg-app-panel",
                  )}
                >
                  {topic}
                </Button>
              ))}
            </aside>

            <div className="col-span-2">
              {rows.map((row) => (
                <div
                  key={`${row.prompt}-${row.brand}`}
                  className={cn(
                    "grid min-h-[48px] w-full grid-cols-[minmax(220px,1fr)_clamp(310px,37vw,527px)] items-center border-b border-app-border text-left text-sm font-normal leading-[22px] text-app-ink",
                    row.highlighted && "bg-app-panel",
                  )}
                >
                  <div className="px-4">{row.prompt}</div>
                  <div className="grid grid-cols-[repeat(8,minmax(26px,48px))_minmax(55px,79px)] items-center justify-between px-4">
                    {row.ranking.map((logoIndex, index) => (
                      <div key={`${row.prompt}-${index}`} className="flex justify-center">
                        <RankLogo index={logoIndex} />
                      </div>
                    ))}
                    <div className="flex justify-center">
                      <span className="inline-flex h-[22px] items-center rounded bg-app-panel px-1.5 text-xs font-medium leading-5 text-app-ink">
                        {row.brand}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              <div className="flex h-16 items-center justify-end gap-8 px-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium leading-[22px] text-app-ink">每页行数</span>
                  <Select defaultValue="10">
                    <SelectTrigger className="h-9 w-[70px] rounded-md border-app-border bg-white px-3 text-sm font-normal shadow-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="20">20</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <span className="text-sm font-medium leading-[22px] text-app-ink">第 {page} 页，共 10 页</span>
                <div className="flex gap-2 opacity-80">
                  <PaginationButton disabled={page === 1} onClick={() => setPage(1)}>
                    <ChevronsLeft className="size-4" />
                  </PaginationButton>
                  <PaginationButton disabled={page === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}>
                    <ChevronLeft className="size-4" />
                  </PaginationButton>
                  <PaginationButton disabled={page === 10} onClick={() => setPage((value) => Math.min(10, value + 1))}>
                    <ChevronRight className="size-4" />
                  </PaginationButton>
                  <PaginationButton disabled={page === 10} onClick={() => setPage(10)}>
                    <ChevronsRight className="size-4" />
                  </PaginationButton>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
