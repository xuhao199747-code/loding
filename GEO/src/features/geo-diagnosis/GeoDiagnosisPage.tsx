import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  Expand,
  Search,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import alibabaLogo from "@/assets/geo/alibaba.png"
import amazonLogo from "@/assets/geo/amazon.png"
import geminiLogo from "@/assets/geo/gemini.svg"
import googleAioLogo from "@/assets/geo/google-aio.svg"
import grokLogo from "@/assets/geo/grok.svg"
import metaAiLogo from "@/assets/geo/meta-ai.png"
import microsoftLogo from "@/assets/geo/microsoft.svg"
import perplexityLogo from "@/assets/geo/perplexity.svg"
import sheinLogo from "@/assets/geo/shein.png"
import shopeeLogo from "@/assets/geo/shopee.jpg"
import shopifyLogo from "@/assets/geo/shopify.png"

const competitors = [
  { rank: 1, page: "Alibaba.com", visibility: "19%", citation: "1247", logo: alibabaLogo },
  { rank: 2, page: "Shopify", visibility: "18.5%", citation: "1201", logo: shopifyLogo },
  { rank: 3, page: "Shopee", visibility: "17.6%", citation: "1120", logo: shopeeLogo },
  { rank: 4, page: "Amazon", visibility: "15.9%", citation: "1031", logo: amazonLogo },
  { rank: 5, page: "Shein", visibility: "15.4%", citation: "980", logo: sheinLogo },
]

const responseRows = [
  {
    model: "Meta AI",
    logo: metaAiLogo,
    mentioned: false,
    prompt: "分析该品类的竞争格局...",
    response: "如果你是一家正在寻找 B2B...",
  },
  {
    model: "Microsoft",
    logo: microsoftLogo,
    mentioned: true,
    prompt: "适合小型企业的 B2B 电商平台...",
    response: "完整的 B2B 电商平台通常...",
  },
  {
    model: "Gemini",
    logo: geminiLogo,
    mentioned: true,
    prompt: "推荐基础和进阶功能...",
    response: "B2B 电商领域呈现出三类...",
  },
  {
    model: "Perplexity",
    logo: perplexityLogo,
    mentioned: false,
    prompt: "设计完整的 B2B 电商方案...",
    response: "对于面向零售商的小型制造商...",
  },
  {
    model: "Google AIO",
    logo: googleAioLogo,
    mentioned: true,
    prompt: "比较 SaaS 与定制开发...",
    response: "优秀的 B2B 体验应参考成功...",
  },
  {
    model: "Grok",
    logo: grokLogo,
    mentioned: false,
    prompt: "制定客户获取策略...",
    response: "下面是针对这些问题的示例回答...",
  },
]

const platformFilters = [
  { key: "google", label: "Google 平台筛选", logo: googleAioLogo },
  { key: "microsoft", label: "Microsoft 平台筛选", logo: microsoftLogo },
  { key: "xai", label: "xAI 平台筛选", logo: grokLogo },
  { key: "gemini", label: "Gemini 平台筛选", logo: geminiLogo },
  { key: "perplexity", label: "Perplexity 平台筛选", logo: perplexityLogo },
  { key: "google-muted", label: "Google 弱化平台筛选", logo: googleAioLogo, muted: true },
  { key: "xai-muted", label: "xAI 弱化平台筛选", logo: grokLogo, muted: true },
  { key: "meta", label: "Meta AI 平台筛选", logo: metaAiLogo },
] as const

export function GeoDiagnosisPage() {
  return (
    <div className="flex min-h-screen bg-white text-app-ink">
      <main className="min-w-0 flex-1 bg-white px-6 pb-[26px]">
        <header
          data-testid="geo-dashboard-header"
          className="sticky top-0 z-30 -mx-6 mb-5 flex items-start justify-between gap-6 bg-white px-6 pb-5 pt-[26px]"
        >
          <div>
            <h1 className="text-2xl font-semibold leading-8 tracking-normal">Alibaba.com AI 流量看板</h1>
            <p className="mt-1 text-sm leading-[22px] text-muted-foreground">
              监测品牌可见度与 AI 平台表现
            </p>
          </div>
          <Button variant="outline" className="h-10 min-w-[180px] justify-between rounded-lg border-border bg-white px-3 text-sm font-normal text-foreground">
            近 7 天
            <ChevronDown className="size-4 text-muted-foreground" />
          </Button>
        </header>

        <section data-testid="geo-score-cards" className="grid h-[314px] grid-cols-3 gap-6">
          <MetricCard
            title="可见度评分"
            data-testid="visibility-score-card"
            titleTestId="visibility-score-card-title"
            className="h-full bg-gradient-to-b from-white to-orange-50"
          >
            <div data-testid="visibility-score-value" className="mt-1 text-[30px] font-semibold leading-[38px] tracking-normal">19%</div>
            <VisibilityGauge />
          </MetricCard>

          <MetricCard
            title="情感评分"
            data-testid="sentiment-score-card"
            titleTestId="sentiment-score-card-title"
            className="h-full bg-gradient-to-b from-white to-sky-50"
          >
            <div className="mt-1 text-[30px] font-semibold leading-[38px] tracking-normal">61.3%</div>
            <SentimentBars />
          </MetricCard>

          <MetricCard title="AI 建议" data-testid="ai-advice-card" titleTestId="ai-advice-card-title" className="relative h-full pb-[54px]">
            <p className="mt-4 max-w-[390px] text-sm leading-[22px] text-slate-500">
              Alibaba 维持品类综合排名第 3，可见度评分提升 1.53% 至 19.57%。其中“定制指甲贴纸”上升至第 2，增长 3.4%，
              “男士非洲服饰”和“散热器”等主题表现稳定。尽管主题排名有所提升，Alibaba 自有域名的日均引用占比仍小幅下滑...
            </p>
            <p data-testid="ai-advice-footer" className="absolute bottom-4 left-4 right-4 text-sm leading-[22px] text-muted-foreground">由 AlphaRank 生成于 <span className="text-foreground">4\10\13:38</span></p>
          </MetricCard>
        </section>

        <section data-testid="geo-secondary-cards" className="mt-6 grid grid-cols-2 gap-6">
          <MetricCard
            title="竞品分析（按可见度）"
            className="min-h-[344px]"
            titleTestId="competitor-card-title"
            showExpand
          >
            <CompetitorTable />
          </MetricCard>

          <MetricCard title="可见度评分" className="min-h-[344px]" titleTestId="trend-card-title">
            <div className="mt-2 flex items-end gap-2">
              <div data-testid="trend-score-value" className="text-[30px] font-semibold leading-[38px] tracking-normal">54.1%</div>
              <div className="pb-1.5 text-sm font-medium leading-5 text-red-500">-0.4%</div>
            </div>
            <TrendChart />
          </MetricCard>
        </section>

        <section data-testid="geo-responses-card" className="mt-6 rounded-xl border border-border bg-white">
          <div className="flex items-start gap-4 px-4 pb-3 pt-4">
            <div className="mr-auto">
              <h2 className="text-xl font-semibold leading-7">回答记录</h2>
              <div className="mt-2 flex items-center gap-1.5">
                {platformFilters.map((filter) => (
                  <button
                    key={filter.key}
                    type="button"
                    aria-label={filter.label}
                    className={cn(
                      "flex size-6 items-center justify-center rounded-md border border-border bg-white",
                      "muted" in filter && filter.muted && "opacity-35",
                    )}
                  >
                    <img src={filter.logo} alt="" className="size-4 object-contain" />
                  </button>
                ))}
              </div>
            </div>
            <div className="relative mt-[14px] w-[320px]">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                aria-label="搜索相关页面"
                placeholder="搜索相关页面..."
                className="h-9 rounded-lg border-border pl-9 text-sm shadow-none"
              />
            </div>
          </div>
          <ResponsesTable />
          <div className="flex items-center justify-end gap-3 border-t border-app-border px-5 py-4 text-sm text-muted-foreground">
            <span>显示 1-5 / 共 20 项</span>
            <Button variant="outline" size="icon-sm" className="size-8 rounded-lg border-border">
              <ChevronLeft className="size-4" />
            </Button>
            <Button variant="outline" size="icon-sm" className="size-8 rounded-lg border-border">
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </section>
      </main>
    </div>
  )
}

function MetricCard({
  title,
  className,
  titleTestId,
  showExpand = false,
  children,
  ...props
}: {
  title: string
  className?: string
  titleTestId?: string
  showExpand?: boolean
  children: React.ReactNode
} & React.HTMLAttributes<HTMLElement>) {
  return (
    <article className={cn("rounded-xl border border-border bg-white p-4", className)} {...props}>
      <div className="flex items-center gap-2">
        <h2
          data-testid={titleTestId}
          className="mr-auto text-[18px] font-medium leading-7 text-slate-900"
        >
          {title}
        </h2>
        <IconButton label={`${title} 下载`} icon={Download} />
        {showExpand ? <IconButton label={`${title} 展开`} icon={Expand} /> : null}
      </div>
      {children}
    </article>
  )
}

function IconButton({ label, icon: Icon }: { label: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <Button variant="ghost" size="icon-xs" className="size-7 text-foreground hover:bg-transparent" aria-label={label}>
      <Icon className="size-4" />
    </Button>
  )
}

function VisibilityGauge() {
  return (
    <div data-testid="visibility-gauge" className="mx-auto mt-4 h-[180px] w-[360px] max-w-full">
      <svg className="h-full w-full overflow-visible" viewBox="0 0 360 180" aria-hidden="true">
        <path
          d="M58 142 A122 122 0 0 1 302 142"
          fill="none"
          pathLength="100"
          className="stroke-slate-100"
          strokeLinecap="round"
          strokeWidth="40"
        />
        <path
          d="M58 142 A122 122 0 0 1 302 142"
          fill="none"
          pathLength="100"
          className="stroke-app-orange"
          strokeDasharray="19 100"
          strokeLinecap="round"
          strokeWidth="40"
        />
        <text x="22" y="150" className="fill-slate-500" fontSize="16" fontWeight="500" textAnchor="middle">0</text>
        <text x="72" y="34" className="fill-slate-500" fontSize="16" fontWeight="500" textAnchor="middle">25</text>
        <text x="288" y="34" className="fill-slate-500" fontSize="16" fontWeight="500" textAnchor="middle">75</text>
        <text x="338" y="150" className="fill-slate-500" fontSize="16" fontWeight="500" textAnchor="middle">100</text>
        <text x="180" y="123" textAnchor="middle" className="fill-app-ink" fontSize="24" fontWeight="600">
          <tspan>😕 偏低</tspan>
        </text>
        <text x="180" y="154" textAnchor="middle" className="fill-muted-foreground" fontSize="18" fontWeight="400">
          <tspan className="fill-slate-800">19</tspan>
          <tspan> / 100</tspan>
        </text>
      </svg>
    </div>
  )
}

function SentimentBars() {
  const bars = Array.from({ length: 20 }, (_, index) => index)

  return (
    <div data-testid="sentiment-bars" className="mx-auto mt-1 h-[170px] w-full max-w-full px-5">
      <div className="relative h-full">
        <div
          data-testid="sentiment-tooltip"
          className="absolute left-1/2 top-0 z-10 -translate-x-1/2 whitespace-nowrap rounded-xl border border-border bg-white px-4 py-2 text-left text-[18px] font-normal leading-6 text-slate-700 shadow-md"
        >
          <span>😄 正向</span>
          <span className="ml-2">61.3%</span>
        </div>
        <div className="absolute inset-x-0 top-[82px] flex gap-0.5">
          {bars.map((bar) => {
            const active = bar < 13
            return (
              <div
                key={bar}
                data-testid={`sentiment-bar-${bar}`}
                className={cn(
                  "h-[52px] min-w-0 flex-1 rounded-full border",
                  active ? "border-blue-500 bg-blue-500" : "border-border bg-white",
                )}
              />
            )
          })}
        </div>
        <div className="absolute inset-x-0 bottom-0 flex justify-between text-[16px] font-medium leading-5 text-slate-500">
          <span>0</span>
          <span>25</span>
          <span>50</span>
          <span>75</span>
          <span>100</span>
        </div>
      </div>
    </div>
  )
}

function CompetitorTable() {
  return (
    <Table className="mt-5 text-sm">
      <TableHeader>
        <TableRow className="border-app-border hover:bg-transparent">
          <TableHead className="h-10 w-[70px] px-0 text-xs font-normal text-foreground">排名</TableHead>
          <TableHead className="h-10 text-xs font-normal text-foreground">页面</TableHead>
          <TableHead className="h-10 text-right text-xs font-normal text-foreground">可见度</TableHead>
          <TableHead className="h-10 text-right text-xs font-normal text-foreground">引用数</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {competitors.map((competitor) => (
          <TableRow key={competitor.page} className="h-[46px] border-app-border-soft hover:bg-app-surface">
            <TableCell className="px-0 font-normal text-foreground">
              {competitor.rank}
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2.5">
                <img
                  src={competitor.logo}
                  alt={`${competitor.page} 标志`}
                  className="size-6 rounded object-contain"
                />
                <span className="font-medium text-gray-800">{competitor.page}</span>
              </div>
            </TableCell>
            <TableCell className="text-right font-normal text-gray-800">{competitor.visibility}</TableCell>
            <TableCell className="text-right text-muted-foreground">{competitor.citation}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function TrendChart() {
  const yLabels = ["56.6", "55.5", "54.3", "53.2", "52.1"]
  const xLabels = ["7月7日", "7月14日", "7月21日", "7月28日", "8月5日", "8月12日", "8月19日"]

  return (
    <div className="mt-6 grid grid-cols-[38px_1fr] gap-2">
      <div className="flex h-[190px] flex-col justify-between pt-1 text-xs text-muted-foreground">
        {yLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div>
        <svg className="h-[190px] w-full overflow-visible" viewBox="0 0 560 190" preserveAspectRatio="none" aria-hidden="true">
          {[20, 57, 94, 131, 168].map((y) => (
            <line key={y} x1="0" x2="560" y1={y} y2={y} className="stroke-border" strokeDasharray="4 4" />
          ))}
          <path
            d="M4 64 C58 92 104 84 156 92 C210 100 248 122 296 116 C344 108 356 70 406 52 C456 34 498 46 530 76 C542 86 550 90 558 92"
            fill="none"
            className="stroke-app-orange"
            strokeLinecap="round"
            strokeWidth="3"
          />
        </svg>
        <div className="mt-1 grid grid-cols-7 text-center text-xs text-muted-foreground">
          {xLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}

function ResponsesTable() {
  return (
    <Table>
      <TableHeader>
        <TableRow className="border-app-border bg-white hover:bg-white">
          <TableHead className="h-12 w-[180px] px-5 text-center text-xs font-normal text-foreground">模型</TableHead>
          <TableHead className="h-12 w-[130px] text-center text-xs font-normal text-foreground">是否提及</TableHead>
          <TableHead className="h-12 w-[210px] text-center text-xs font-normal text-foreground">提及竞品</TableHead>
          <TableHead className="h-12 text-xs font-normal text-foreground">提问</TableHead>
          <TableHead className="h-12 text-xs font-normal text-foreground">回答</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {responseRows.map((row, index) => (
          <TableRow
            key={row.model}
            data-testid={`response-row-${row.model}`}
            className="h-[50px] border-app-border-soft text-sm hover:bg-app-surface"
          >
            <TableCell className="px-5">
              <div
                data-testid={`model-pill-${row.model}`}
                className="inline-flex h-6 items-center gap-1 rounded-full border border-border bg-white px-2 text-sm font-normal text-slate-700"
              >
                <img src={row.logo} alt={`${row.model} 标志`} className="size-4 object-contain" />
                <span>{row.model}</span>
              </div>
            </TableCell>
            <TableCell>
              <span
                className={cn(
                  "inline-flex h-[22px] min-w-[34px] items-center justify-center rounded px-1.5 text-xs font-medium",
                  row.mentioned ? "bg-green-400/10 text-green-400" : "bg-orange-500/10 text-orange-600",
                )}
              >
                {row.mentioned ? "是" : "否"}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex justify-center -space-x-1.5">
                {competitors.slice(0, index === 4 ? 1 : index === 5 ? 3 : 6).map((competitor) => (
                  <img
                    key={`${row.model}-${competitor.page}`}
                    src={competitor.logo}
                    alt=""
                    className="size-6 rounded border border-border bg-white object-contain"
                  />
                ))}
              </div>
            </TableCell>
            <TableCell className="max-w-[320px] truncate text-gray-600">{row.prompt}</TableCell>
            <TableCell className="max-w-[360px] truncate text-gray-600">{row.response}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
