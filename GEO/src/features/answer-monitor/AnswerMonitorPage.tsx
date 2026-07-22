import type { ReactNode } from "react"
import { useState } from "react"
import { useLocation } from "react-router-dom"
import { ChevronLeft, ChevronRight, Clock4, Component, Copy, Download, ExternalLink, Search, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import alibabaLogo from "@/assets/geo/alibaba.png"
import amazonLogo from "@/assets/geo/amazon.png"
import geminiLogo from "@/assets/geo/gemini.svg"
import googleAioLogo from "@/assets/geo/google-aio.svg"
import grokLogo from "@/assets/geo/grok.svg"
import metaLogo from "@/assets/geo/meta-ai.png"
import microsoftLogo from "@/assets/geo/microsoft.svg"
import perplexityLogo from "@/assets/geo/perplexity.svg"
import sheinLogo from "@/assets/geo/shein.png"
import shopeeLogo from "@/assets/geo/shopee.jpg"
import shopifyLogo from "@/assets/geo/shopify.png"
import { cn } from "@/lib/utils"

const platforms = [
  { name: "Gemini", count: 142, colorClass: "bg-blue-500", logo: geminiLogo },
  { name: "ChatGPT", count: 421, colorClass: "bg-orange-300", initials: "◎" },
  { name: "Meta AI", count: 1234, colorClass: "bg-orange-500", logo: metaLogo },
  { name: "Perplexity", count: 24, colorClass: "bg-cyan-400", logo: perplexityLogo },
  { name: "Grok", count: 512, colorClass: "bg-lime-300", logo: grokLogo },
  { name: "Microsoft", count: 214, colorClass: "bg-red-500", logo: microsoftLogo },
  { name: "Google AI Mode", count: 621, colorClass: "bg-orange-400", logo: googleAioLogo },
  { name: "Google AI Overview", count: 321, colorClass: "bg-purple-400", logo: googleAioLogo },
]

const rankingRows = [
  { rank: "1", platform: "Wish", logo: microsoftLogo, visibility: "2,120", trend: "-12", trendType: "down" },
  { rank: "2", platform: "Shopify", logo: shopifyLogo, visibility: "1,654", trend: "+32", trendType: "up" },
  { rank: "3", platform: "Shopee", logo: shopeeLogo, visibility: "947", trend: "-12", trendType: "down" },
  { rank: "4", platform: "Amazon", logo: amazonLogo, visibility: "748", trend: "-65", trendType: "down" },
  { rank: "5", platform: "Shein", logo: sheinLogo, visibility: "638", trend: "-25", trendType: "down" },
  { rank: "6", platform: "eBay", visibility: "592", trend: "-42", trendType: "down" },
  { rank: "7", platform: "Wish", logo: microsoftLogo, visibility: "382", trend: "-39", trendType: "down" },
  { rank: "8", platform: "Faire", visibility: "294", trend: "-32", trendType: "down" },
  { rank: "9", platform: "Global Sources", visibility: "294", trend: "-25", trendType: "down" },
  { rank: "10", platform: "Alibaba.com（你）", logo: alibabaLogo, visibility: "132", trend: "+24", trendType: "up" },
]

const relatedPages = [
  { rank: "1", title: "SEO_for_AI - Reddit", domain: "https://www.reddit.com/r/SEO_for_AI/comments/1mtwmd3/built_an_aiseo_audit_tool_honest_opinions_wanted/", count: "211", change: "+22" },
  { rank: "2", title: "Best Ecommerce Platforms UK", domain: "https://startups.co.uk/websites/ecommerce/best-ecommerce-platforms-for-small-business/", count: "132", change: "+19" },
  { rank: "3", title: "B2B Marketplace Comparison", domain: "https://startups.co.uk/websites/ecommerce/best-ecommerce-platforms-comparison/", count: "52", change: "-42" },
  { rank: "4", title: "Wholesale Platform Guide", domain: "https://startups.co.uk/websites/ecommerce/b2b-marketplace-guide/", count: "24", change: "+1" },
  { rank: "5", title: "Wholesale Platforms", domain: "https://startups.co.uk/websites/ecommerce/wholesale-platforms/", count: "21", change: "-32" },
]

const competitorPages = [
  { rank: "1", title: "Best Ecommerce Platforms UK", domain: "https://startups.co.uk/websites/ecommerce/best-ecommerce-platforms-uk/", count: "211", change: "+22" },
  { rank: "2", title: "Best Ecommerce Platforms for Startups", domain: "https://startups.co.uk/websites/ecommerce/best-ecommerce-platforms-for-startups/", count: "132", change: "+19" },
  { rank: "3", title: "Best Ecommerce Platforms Review", domain: "https://startups.co.uk/websites/ecommerce/best-ecommerce-platforms-review/", count: "52", change: "-42" },
  { rank: "4", title: "Marketplace Comparison", domain: "https://startups.co.uk/websites/ecommerce/marketplace-comparison/", count: "24", change: "+1" },
  { rank: "5", title: "Top Storefront Tools", domain: "https://startups.co.uk/websites/ecommerce/top-storefront-tools/", count: "21", change: "-32" },
]

const topDomains = [
  { rank: "1", platform: "Wish", logo: microsoftLogo, count: "211", countChange: "+22", share: "211", shareChange: "+4.6" },
  { rank: "2", platform: "Shopify", logo: shopifyLogo, count: "132", countChange: "+19", share: "132", shareChange: "+9" },
  { rank: "3", platform: "Amazon", logo: amazonLogo, count: "52", countChange: "-42", share: "52", shareChange: "-32" },
  { rank: "4", platform: "Shein", logo: sheinLogo, count: "24", countChange: "+1", share: "24", shareChange: "+1.5" },
  { rank: "5", platform: "Faire", count: "21", countChange: "-32", share: "21", shareChange: "-42" },
]

const popularPages = [
  { rank: "1", title: "Online Wholesale Jewelry & Fashion Accessories", domain: "www.nihaojewelry.com", count: "211", change: "+22", favorite: true },
  { rank: "2", title: "Online Wholesale Jewelry & Fashion Supply", domain: "www.nihaojewelry.com", count: "132", change: "+19", favorite: true },
  { rank: "3", title: "Jewelry Dropshipping 2026: Top Wholesale Sites", domain: "https://www.jewelrybund.com/", count: "52", change: "-42" },
  { rank: "4", title: "Wholesale & Custom Jewelry Marketplace", domain: "www.nihaojewelry.com", count: "24", change: "+1" },
  { rank: "5", title: "Wholesale Jewelry | Discounted Fashion Accessories", domain: "https://www.nonatrading.com/", count: "21", change: "-32" },
]

const watchRows = [
  { domain: "https://startups.co.uk/websites/ecommerce/best-ecommerce-platforms-uk/", category: "Social", count: "211", countChange: "+22", share: "0.0", shareChange: "0.0%", tone: "yellow" },
  { domain: "https://startups.co.uk/websites/ecommerce/best-ecommerce-platforms-uk/", category: "Paid", count: "132", countChange: "+19", share: "132", shareChange: "+9", tone: "pink" },
  { domain: "https://startups.co.uk/websites/ecommerce/best-ecommerce-platforms-uk/", category: "Social", count: "52", countChange: "-42", share: "132", shareChange: "+14", tone: "yellow" },
  { domain: "https://startups.co.uk/websites/ecommerce/best-ecommerce-platforms-uk/", category: "Owned", count: "24", countChange: "+1", share: "132", shareChange: "-42", tone: "green" },
  { domain: "https://startups.co.uk/websites/ecommerce/best-ecommerce-platforms-uk/", category: "Earned", count: "21", countChange: "-32", share: "0.0", shareChange: "0.0%", tone: "blue" },
]

const matrixBrands = [
  { name: "Alibaba.com", logo: alibabaLogo },
  { name: "Shopify", logo: shopifyLogo },
  { name: "Shopee", logo: shopeeLogo },
  { name: "Amazon", logo: amazonLogo },
  { name: "Shein", logo: sheinLogo },
  { name: "eBay" },
  { name: "Wish", logo: microsoftLogo },
  { name: "Faire" },
]

const matrixPlatforms = [
  { name: "Gemini", logo: geminiLogo },
  { name: "Google AIO", logo: googleAioLogo },
  { name: "Google AI Mode", logo: googleAioLogo },
  { name: "Perplexity", logo: perplexityLogo },
  { name: "Grok", logo: grokLogo },
  { name: "Meta AI", logo: metaLogo },
  { name: "Chatgpt" },
  { name: "Microsoft Copilot", logo: microsoftLogo },
]

const matrixScores = [
  [28, 34, 18, 24, 42, 30, 16, 22],
  [15, 24, 44, 30, 18, 22, 26, 32],
  [36, 25, 18, 44, 22, 28, 16, 20],
  [18, 32, 26, 14, 20, 38, 28, 16],
  [20, 18, 30, 24, 34, 16, 22, 26],
  [34, 22, 16, 28, 24, 20, 38, 18],
  [40, 28, 22, 18, 30, 34, 24, 16],
  [26, 20, 34, 22, 18, 28, 32, 24],
]

const platformRankingRows = [
  { rank: "1", platform: "Wish", logo: microsoftLogo, score: "211", change: "+4.6" },
  { rank: "2", platform: "Shopify", logo: shopifyLogo, score: "132", change: "+9" },
  { rank: "3", platform: "Amazon", logo: amazonLogo, score: "52", change: "-32" },
  { rank: "4", platform: "Shein", logo: sheinLogo, score: "24", change: "+1.5" },
  { rank: "5", platform: "Faire", score: "21", change: "-42" },
]

const comparisonBrands = ["Alibaba.com", "Shopify", "Amazon", "Shopee", "Wish", "eBay", "Global Sources", "Shein", "Faire"]

type CitationSource = {
  title: string
  domain: string
  rank?: string
}

const aiQuestions = [
  "哪个平台最有效地人性化AI文本？",
  "哪些引用来源最常影响AI回答排序？",
  "批发电商品牌应该优先建设哪些内容页面？",
  "哪些网站会被AI频繁引用为电商平台参考？",
  "如何提升品牌官网在AI回答中的引用份额？",
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
      <div className="flex h-5 items-center gap-1.5 text-sm font-normal leading-5 text-foreground">
        {icon}
        <span>{label}</span>
      </div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="h-10 w-[180px] border-border bg-background text-sm font-normal text-foreground shadow-none">
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

function Panel({
  title,
  description,
  children,
  className,
  action,
}: {
  title: string
  description?: string
  children: ReactNode
  className?: string
  action?: ReactNode
}) {
  return (
    <section className={cn("overflow-hidden rounded-xl border border-app-border bg-white", className)}>
      <div className="flex h-[86px] items-start justify-between px-4 py-4">
        <div>
          <h2 className="text-lg font-semibold leading-7 text-app-ink">{title}</h2>
          {description ? <p className="mt-1 text-xs font-normal leading-5 text-neutral-600">{description}</p> : null}
        </div>
        {action}
      </div>
      {children}
    </section>
  )
}

function LogoMark({ src, label, initials }: { src?: string; label: string; initials?: string }) {
  if (src) {
    return <img src={src} alt={`${label} 标志`} className="size-5 shrink-0 rounded-[4px] object-contain" />
  }

  return (
    <span className="flex size-5 shrink-0 items-center justify-center rounded-[4px] bg-app-ink text-xs font-medium text-white">
      {initials ?? label.slice(0, 1)}
    </span>
  )
}

function ChangePill({ value }: { value: string }) {
  const positive = value.startsWith("+")

  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-md px-1.5 text-xs font-normal",
        positive ? "bg-app-success-soft text-app-success" : "bg-app-orange-soft text-app-orange",
      )}
    >
      {value}
    </span>
  )
}

function Rank({ value }: { value: string }) {
  return (
    <span className="text-sm font-normal text-app-ink">
      {value}
      <sup className="ml-0.5 text-[10px] text-app-muted">
        {value === "1" ? "st" : value === "2" ? "nd" : value === "3" ? "rd" : "th"}
      </sup>
    </span>
  )
}

function PlatformDots({ filled, colorClass }: { filled: number; colorClass: string }) {
  return (
    <div className="flex items-center justify-end gap-2">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={cn("size-2 rounded-full", index < filled ? colorClass : "bg-slate-100")}
        />
      ))}
    </div>
  )
}

function PaginationFooter() {
  return (
    <div className="flex h-14 items-center justify-end gap-3 px-4 text-xs font-normal text-app-ink">
      <span>显示1-5项，共20项</span>
      <Button variant="outline" size="icon" className="size-8 rounded-md border-app-border shadow-none" aria-label="上一页">
        <ChevronLeft className="size-4" />
      </Button>
      <Button variant="outline" size="icon" className="size-8 rounded-md border-app-border shadow-none" aria-label="下一页">
        <ChevronRight className="size-4" />
      </Button>
    </div>
  )
}

function CitationShareChart() {
  const yLabels = ["56.6%", "55.5%", "54.3%", "53.2%", "52.1%"]
  const xLabels = ["7月7日", "7月14日", "7月21日", "7月28日", "8月5日", "8月12日", "8月19日"]

  return (
    <div className="px-6 pb-6 pt-2">
      <div className="flex items-end gap-2">
        <div className="w-16 space-y-[26px] text-right text-xs font-normal text-app-ink">
          {yLabels.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>
        <div className="relative h-[168px] min-w-0 flex-1">
          <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 960 168" preserveAspectRatio="none" aria-hidden="true">
            {[18, 52, 86, 120, 154].map((y) => (
              <line key={y} x1="0" x2="960" y1={y} y2={y} className="stroke-border" strokeDasharray="6 8" strokeWidth="1" />
            ))}
            <path
              d="M0 78 C120 112 230 96 320 112 C430 132 482 70 590 52 C700 32 760 44 840 76 C888 94 920 104 960 110"
              fill="none"
              className="stroke-app-orange"
              strokeLinecap="round"
              strokeWidth="3"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
        </div>
      </div>
      <div className="ml-16 mt-2 grid grid-cols-7 text-center text-xs font-normal text-app-ink">
        {xLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  )
}

function CompactPanel({
  title,
  children,
  className,
}: {
  title: string
  children: ReactNode
  className?: string
}) {
  return (
    <section className={cn("overflow-hidden rounded-xl border border-border bg-background", className)}>
      <div className="flex h-[58px] items-center px-4">
        <h2 className="text-lg font-medium leading-[26px] text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function MatrixLogoMark({ src, label }: { src?: string; label: string }) {
  if (src) {
    return <img src={src} alt={`${label} 标志`} className="size-6 shrink-0 rounded-[4px] object-contain" />
  }

  return (
    <span className="flex size-6 shrink-0 items-center justify-center rounded-[4px] bg-foreground text-xs font-medium text-background">
      {label.slice(0, 1)}
    </span>
  )
}

function MatrixBubble({ value, brand, platform }: { value: number; brand: string; platform: string }) {
  const size = Math.max(14, Math.min(60, value * 1.25))
  const showLabel = value === 15 || value === 25 || value === 40

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <button type="button" className="relative flex h-[60px] w-[60px] items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-ring" aria-label={`${brand} 在 ${platform} 的引用占比 ${value}%`}>
          <span
            className={cn(
              "absolute rounded-full bg-orange-500",
              value >= 36 && "opacity-100",
              value < 36 && value >= 25 && "opacity-[0.86]",
              value < 25 && "opacity-[0.65]",
            )}
            style={{
              width: size,
              height: size,
            }}
          />
          {showLabel ? <span className="relative z-10 text-sm font-normal text-white">{value}%</span> : null}
        </button>
      </TooltipTrigger>
      <TooltipContent sideOffset={8} className="bg-foreground text-background">
        {brand} / {platform}: {value}%
      </TooltipContent>
    </Tooltip>
  )
}

function CompetitorMatrixPanel() {
  return (
    <TooltipProvider>
      <CompactPanel title="竞争对手分析（按平台划分）" className="h-[785px]">
        <div className="grid h-[711px] grid-cols-[117px_minmax(0,1fr)] px-4">
          <div className="pt-16">
            {matrixBrands.map((brand) => (
              <div key={brand.name} className="flex h-[84px] items-center justify-end gap-2 pr-4 text-sm font-normal leading-5 text-foreground">
                <span>{brand.name}</span>
                <MatrixLogoMark src={brand.logo} label={brand.name} />
              </div>
            ))}
          </div>
          <div className="min-w-0">
            <div className="grid h-16 grid-cols-8">
              {matrixPlatforms.map((platform) => (
                <div key={platform.name} className="flex flex-col items-center justify-start gap-1 text-xs font-normal leading-5 text-foreground">
                  <MatrixLogoMark src={platform.logo} label={platform.name} />
                  <span className="max-w-[112px] truncate">{platform.name}</span>
                </div>
              ))}
            </div>
            <div className="relative grid grid-cols-8">
              <div className="pointer-events-none absolute inset-0 grid grid-rows-8">
                {matrixBrands.map((brand) => (
                  <span key={brand.name} className="border-b border-border" />
                ))}
              </div>
              {matrixScores.flatMap((row, rowIndex) =>
                row.map((value, colIndex) => (
                  <div key={`${rowIndex}-${colIndex}`} className="relative flex h-[84px] items-center justify-center">
                    <MatrixBubble value={value} brand={matrixBrands[rowIndex].name} platform={matrixPlatforms[colIndex].name} />
                  </div>
                )),
              )}
            </div>
          </div>
        </div>
      </CompactPanel>
    </TooltipProvider>
  )
}

function PlatformTrendChart({ xLabels = ["7月7日", "7月14日", "7月21日", "7月28日", "8月5日", "8月12日", "8月19日"] }: { xLabels?: string[] }) {
  const paths = [
    { d: "M0 96 C80 126 150 132 220 118 C300 98 370 74 450 86 C500 94 540 116 622 78", className: "stroke-chart-1", swatch: "bg-chart-1" },
    { d: "M0 50 C90 28 162 44 230 72 C310 108 392 116 452 82 C512 48 564 54 622 36", className: "stroke-green-500", swatch: "bg-green-500" },
    { d: "M0 132 C78 118 150 96 226 108 C302 120 352 152 434 126 C508 102 552 112 622 140", className: "stroke-blue-500", swatch: "bg-blue-500" },
    { d: "M0 76 C90 88 152 58 228 42 C310 26 366 44 432 68 C500 92 548 86 622 62", className: "stroke-purple-500", swatch: "bg-purple-500" },
    { d: "M0 154 C76 138 134 156 206 142 C284 126 360 110 436 118 C522 126 570 104 622 92", className: "stroke-red-500", swatch: "bg-red-500" },
  ]
  const yLabels = ["80%", "60%", "40%", "20%", "0%"]

  return (
    <div className="px-4 pb-6">
      <div className="grid h-[210px] grid-cols-[73px_minmax(0,1fr)]">
        <div className="space-y-6 text-right text-xs font-normal leading-5 text-foreground">
          {yLabels.map((label) => (
            <div key={label}>{label}</div>
          ))}
        </div>
        <div className="relative">
          <svg className="absolute inset-0 size-full overflow-visible" viewBox="0 0 622 196" preserveAspectRatio="none" aria-hidden="true">
            {[10, 54, 98, 142, 186].map((y) => (
              <line key={y} x1="0" x2="622" y1={y} y2={y} className="stroke-border" strokeDasharray="6 8" strokeWidth="1" />
            ))}
            {paths.map((path) => (
              <path
                key={path.d}
                d={path.d}
                fill="none"
                className={path.className}
                strokeLinecap="round"
                strokeWidth="2"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </div>
      </div>
      <div className="ml-[73px] grid grid-cols-7 text-xs font-normal leading-5 text-foreground">
        {xLabels.map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
      <div className="mt-3 grid grid-cols-3 gap-x-8 gap-y-2 text-sm font-normal leading-5 text-foreground">
        {comparisonBrands.map((name, index) => (
          <label key={name} className="flex items-center gap-2">
            <span className={cn("size-3.5 rounded border border-border", paths[index]?.swatch ?? "bg-background")} />
            {name}
          </label>
        ))}
      </div>
    </div>
  )
}

function PlatformSectionHeading({ title, description }: { title: string; description: string }) {
  return (
    <section className="h-[68px] pt-3">
      <h2 className="text-[20px] font-semibold leading-7 text-foreground">{title}</h2>
      <p className="mt-2 text-xs font-normal leading-5 text-muted-foreground">{description}</p>
    </section>
  )
}

function PlatformRankingPanel({
  title = "引用分享排名",
  scoreLabel = "可见度评分",
}: {
  title?: string
  scoreLabel?: string
}) {
  return (
    <CompactPanel title={title} className="h-[432px]">
      <div className="grid h-11 grid-cols-[62px_minmax(0,1fr)_188px] items-center px-4 text-xs font-medium leading-5 text-foreground">
        <span>排名</span>
        <span>平台</span>
        <span className="text-center">{scoreLabel}</span>
      </div>
      <div className="px-4">
        {platformRankingRows.map((row) => (
          <div
            key={row.platform}
            className="grid h-[57px] grid-cols-[62px_minmax(0,1fr)_188px] items-center border-b border-border text-sm font-normal text-foreground"
          >
            <Rank value={row.rank} />
            <div className="flex items-center gap-3">
              <LogoMark src={row.logo} label={row.platform} />
              <span>{row.platform}</span>
            </div>
            <div className="flex items-center justify-center gap-4">
              <span className="w-10 text-right">{row.score}</span>
              <ChangePill value={row.change} />
            </div>
          </div>
        ))}
      </div>
    </CompactPanel>
  )
}

function PlatformChartRow({
  chartTitle,
  rankingTitle,
  scoreLabel,
  xLabels,
}: {
  chartTitle: string
  rankingTitle: string
  scoreLabel: string
  xLabels?: string[]
}) {
  return (
    <div className="grid grid-cols-2 gap-6">
      <CompactPanel title={chartTitle} className="h-[432px]">
        <PlatformTrendChart xLabels={xLabels} />
      </CompactPanel>
      <PlatformRankingPanel title={rankingTitle} scoreLabel={scoreLabel} />
    </div>
  )
}

function PlatformAiCitationStatsPage() {
  const defaultFilters = {
    timeRange: "过去7天",
    comparison: "上一个周期",
  }
  const [filters, setFilters] = useState(defaultFilters)

  const updateFilter = (key: keyof typeof filters) => (value: string) => {
    setFilters((current) => ({ ...current, [key]: value }))
  }

  return (
    <div className="flex h-full min-h-[2571px] flex-col bg-white text-foreground">
      <header className="sticky top-0 z-20 flex h-[110px] shrink-0 items-start bg-white px-6 py-6">
        <div>
          <h1 className="text-2xl font-semibold leading-8 tracking-normal text-foreground">分平台AI引用统计</h1>
          <p className="mt-2 text-sm font-normal leading-[22px] text-foreground">AI回应对www.nihaojewelry.com的积极参考程度</p>
        </div>
      </header>

      <main className="min-h-0 flex-1 px-6 pb-6">
        <section className="flex h-[92px] items-start pt-0">
          <div className="flex gap-4">
            <FilterSelect
              label="时间范围"
              icon={<Clock4 className="size-4 text-muted-foreground" />}
              value={filters.timeRange}
              items={["过去7天", "近 30 天", "近 90 天"]}
              onValueChange={updateFilter("timeRange")}
            />
            <FilterSelect label="比较" value={filters.comparison} items={["上一个周期", "前一个周期", "去年同期"]} onValueChange={updateFilter("comparison")} />
          </div>
        </section>

        <div className="grid gap-6">
          <CompetitorMatrixPanel />

          <PlatformSectionHeading title="各平台的可见性评分" description="您的品牌在每个AI平台上的可见性" />
          <PlatformChartRow chartTitle="可见性得分" rankingTitle="顶级引用域" scoreLabel="可见性得分" />

          <PlatformSectionHeading title="按平台分享引用" description="您的品牌在每个AI平台上的可见度" />
          <PlatformChartRow chartTitle="引用分享" rankingTitle="引用分享排名" scoreLabel="可见度得分" />

          <PlatformSectionHeading title="各平台的正面情绪" description="您的品牌在每个AI平台上的可见度" />
          <PlatformChartRow
            chartTitle="引用分享"
            rankingTitle="引用分享排名"
            scoreLabel="可见度评分"
            xLabels={["Jul7", "Jul14", "Jul21", "Jul28", "Aug5", "Aug12", "Aug19"]}
          />
        </div>
      </main>
    </div>
  )
}

function CitationDetailSheet({
  source,
  onOpenChange,
}: {
  source: CitationSource | null
  onOpenChange: (open: boolean) => void
}) {
  const title = source?.title ?? "SEO_for_AI - Reddit"
  const domain = source?.domain ?? relatedPages[0].domain

  return (
    <Sheet open={Boolean(source)} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-[960px] max-w-[calc(100vw-72px)] gap-0 overflow-y-auto bg-white p-0 sm:max-w-[960px]">
        <SheetHeader className="sticky top-0 z-10 border-b border-app-border-soft bg-white px-6 py-5">
          <SheetTitle className="text-2xl font-semibold leading-8 tracking-normal text-app-ink">引用来源详情</SheetTitle>
          <SheetDescription className="text-sm font-normal leading-[22px] text-app-muted">
            查看该引用来源的引用份额、相关 AI 问题和趋势。
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 px-6 py-5 text-app-ink">
        <div className="flex items-center gap-2 text-xs font-medium leading-5 text-app-ink">
          <span>Citations</span>
          <span>/</span>
          <span>{title}</span>
        </div>

        <section className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="flex size-6 items-center justify-center rounded bg-red-500 text-xs font-semibold text-white">r</span>
            <h2 className="text-2xl font-semibold leading-8 text-app-ink">{title}</h2>
          </div>
          <p className="break-all text-sm font-normal leading-[22px] text-app-muted">{domain}</p>
          <p className="text-xs font-normal leading-5 text-app-ink">最后引用于2025年6月18日</p>
        </section>

        <section className="flex gap-8">
          <FilterSelect
            label="时间范围"
            icon={<Clock4 className="size-4 text-app-muted" />}
            value="过去7天"
            items={["过去7天", "近 30 天", "近 90 天"]}
          />
          <FilterSelect label="比较" value="前一个周期" items={["前一个周期", "上一周期", "去年同期"]} />
        </section>

        <section className="overflow-hidden rounded-xl border border-app-border bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h3 className="text-lg font-semibold leading-7 text-app-ink">引用份额</h3>
            <div className="flex rounded-lg bg-slate-50 p-0.5 text-sm font-medium">
              <span className="rounded-md border border-app-border bg-white px-4 py-1 text-app-ink">分享</span>
              <span className="px-4 py-1 text-app-muted">Count</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1 px-6">
            <span className="text-3xl font-semibold leading-10 text-app-ink">54.1%</span>
            <span className="text-lg font-medium leading-7 text-app-danger">-0.4%</span>
          </div>
          <CitationShareChart />
        </section>

        <section className="overflow-hidden rounded-xl border border-app-border bg-white">
          <div className="flex h-16 items-center justify-between px-4">
            <h3 className="text-lg font-semibold leading-7 text-app-ink">AI问题</h3>
            <Button variant="outline" className="h-8 gap-2 rounded-md border-app-border px-3 text-sm font-medium shadow-none">
              <Download className="size-4" />
              下载
            </Button>
          </div>
          <div className="grid h-10 grid-cols-[64px_minmax(0,1fr)_112px_160px_160px] items-center border-b border-app-border-soft px-6 text-xs font-medium text-app-ink">
            <span>排名</span>
            <span>提示词</span>
            <span />
            <span className="text-center">Count</span>
            <span className="text-center">分享</span>
          </div>
          <div className="px-6">
            {aiQuestions.map((question, index) => (
              <div
                key={question}
                className="grid h-[52px] grid-cols-[64px_minmax(0,1fr)_112px_160px_160px] items-center border-b border-app-border-soft text-sm font-normal text-app-ink"
              >
                <Rank value={String(index + 1)} />
                <span className="truncate">{question}</span>
                <span className="flex items-center justify-center gap-5 text-slate-500">
                  <Copy className="size-4" />
                  <ExternalLink className="size-4" />
                </span>
                <span className="flex items-center justify-center gap-3">
                  211
                  <ChangePill value="+62" />
                </span>
                <span className="flex items-center justify-center gap-3">
                  211
                  <ChangePill value="-0.4%" />
                </span>
              </div>
            ))}
          </div>
          <PaginationFooter />
        </section>
        </div>
      </SheetContent>
    </Sheet>
  )
}

function PageListTable({
  onSelect,
  rows,
}: {
  rows: Array<{
    rank: string
    title: string
    domain: string
    count: string
    change: string
  }>
  onSelect: (source: CitationSource) => void
}) {
  return (
    <>
      <div className="grid h-10 grid-cols-[52px_minmax(0,1fr)_76px_76px_52px] items-center px-4 text-xs font-medium text-app-ink">
        <span>排名</span>
        <span>域名</span>
        <span className="text-right">计数</span>
        <span className="text-right">收藏</span>
        <span />
      </div>
      <div className="px-4">
        {rows.map((row) => (
          <button
            type="button"
            key={`${row.rank}-${row.domain}`}
            className="grid h-[58px] w-full cursor-pointer grid-cols-[52px_minmax(0,1fr)_76px_76px_52px] items-center border-b border-app-border-soft text-left text-sm font-normal text-app-ink"
            aria-label={`打开 ${row.title}`}
            onClick={() => onSelect(row)}
          >
            <Rank value={row.rank} />
            <span className="line-clamp-2 max-w-[360px] text-xs leading-5 text-app-muted underline decoration-app-control-border underline-offset-2">
              {row.domain}
            </span>
            <span className="text-right">{row.count}</span>
            <span className="text-right">
              <ChangePill value={row.change} />
            </span>
            <span className="flex justify-end text-slate-600">
              <Star className="size-4" />
            </span>
          </button>
        ))}
      </div>
      <PaginationFooter />
    </>
  )
}

export function AnswerMonitorPage() {
  const location = useLocation()
  const [selectedSource, setSelectedSource] = useState<CitationSource | null>(null)
  const [isRankingInfoOpen, setIsRankingInfoOpen] = useState(false)
  const searchParams = new URLSearchParams(location.search)

  if (searchParams.get("view") === "platform") {
    return <PlatformAiCitationStatsPage />
  }

  return (
    <div className="flex h-full min-h-[1700px] flex-col bg-white text-app-ink">
      <header className="sticky top-0 z-20 flex h-[110px] shrink-0 items-start bg-white px-6 py-6">
        <div>
          <h1 className="text-2xl font-semibold leading-8 tracking-normal text-app-ink">AI 引用来源</h1>
          <p className="mt-2 text-sm font-normal leading-[22px] text-app-ink">发现哪些网站在AI生成的回复中被引用得最频繁</p>
        </div>
      </header>

      <main className="min-h-0 flex-1 px-6 pb-6">
        <section className="flex h-[92px] items-start gap-8 pt-0">
          <FilterSelect
            label="时间范围"
            icon={<Clock4 className="size-4 text-app-muted" />}
            value="过去7天"
            items={["过去7天", "近 30 天", "近 90 天"]}
          />
          <FilterSelect label="比较" value="前一个周期" items={["前一个周期", "上一周期", "去年同期"]} />
          <FilterSelect
            label="引用平台"
            icon={<Component className="size-4 text-app-muted" />}
            value="平台"
            items={["平台", "Gemini", "ChatGPT", "Meta AI", "Perplexity"]}
          />
        </section>

        <div className="grid gap-6">
          <div className="grid grid-cols-2 gap-6">
            <Panel title="引用平台" className="h-[598px]">
              <div className="grid h-10 grid-cols-[minmax(0,1fr)_120px] px-4 text-sm font-normal text-app-muted">
                <span>平台</span>
                <span className="text-right text-app-ink">引用次数</span>
              </div>
              <div className="px-4">
                {platforms.map((platform) => (
                  <div
                    key={platform.name}
                    className="grid h-[56px] grid-cols-[minmax(0,1fr)_120px] items-center border-b border-app-border-soft text-sm font-normal text-app-ink"
                  >
                    <div className="flex items-center gap-3">
                      <LogoMark src={platform.logo} label={platform.name} initials={platform.initials} />
                      <span>{platform.name}</span>
                    </div>
                    <div className="flex items-center justify-end gap-5">
                      <PlatformDots filled={Math.min(5, Math.max(1, Math.round(platform.count / 250)))} colorClass={platform.colorClass} />
                      <span className="w-10 text-right">{platform.count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel
              title="引用排名"
              className="h-[598px]"
              action={
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsRankingInfoOpen(true)}
                  className="h-7 rounded-full border-app-border px-3 text-xs font-normal shadow-none"
                >
                  了解更多
                </Button>
              }
            >
              <div className="grid h-[436px] grid-cols-[180px_minmax(0,1fr)] px-4">
                <div className="pt-0">
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-semibold leading-10"># 10</span>
                  </div>
                  <div className="mt-5 inline-flex h-6 items-center rounded-md bg-app-success-soft px-2 text-xs text-app-success">+9</div>
                  <div className="mt-5 text-sm font-normal leading-6 text-app-ink">排名上升</div>
                  <div className="mt-1 text-xs font-normal leading-5 text-neutral-600">本周上升9位</div>
                </div>
                <div>
                  <div className="grid h-8 grid-cols-[60px_minmax(0,1fr)_92px_70px] items-center text-xs font-semibold text-app-ink">
                    <span>Visibility</span>
                    <span>竞争对手</span>
                    <span className="text-right">引用次数</span>
                    <span className="text-right" />
                  </div>
                  {rankingRows.map((row) => (
                    <div
                      key={`${row.rank}-${row.platform}`}
                      className="grid h-10 grid-cols-[60px_minmax(0,1fr)_92px_70px] items-center border-b border-app-border-soft text-sm font-normal text-app-ink"
                    >
                      <Rank value={row.rank} />
                      <div className="flex min-w-0 items-center gap-2">
                        <LogoMark src={row.logo} label={row.platform} />
                        <span className="truncate">{row.platform}</span>
                      </div>
                      <span className="text-right">{row.visibility}</span>
                      <span className="text-right">
                        <ChangePill value={row.trend} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Panel>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Panel title="相关引用页面" description="发现最常被引用的网页和影响AI答案的领域" className="h-[514px]">
              <PageListTable rows={relatedPages} onSelect={setSelectedSource} />
            </Panel>
            <Panel
              title="竞争对手引用基准"
              description="比较竞争对手在AI回答中的热门引用页面和域名"
              className="h-[514px]"
              action={
                <Button variant="outline" className="h-9 gap-2 rounded-md border-app-border px-3 text-sm font-normal shadow-none">
                  <LogoMark src={shopeeLogo} label="Shopee" />
                  Shopee
                  <ChevronRight className="size-4 rotate-90 text-app-muted" />
                </Button>
              }
            >
              <PageListTable rows={competitorPages} onSelect={setSelectedSource} />
            </Panel>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Panel title="顶级引用域" description="探索在AI生成的回复中最常被引用的网站" className="h-[544px]">
              <div className="grid h-10 grid-cols-[52px_minmax(0,1fr)_82px_82px_82px_52px] items-center px-4 text-xs font-medium text-app-ink">
                <span>排名</span>
                <span>平台</span>
                <span className="text-right">Count</span>
                <span className="text-right" />
                <span className="text-right">分享</span>
                <span className="text-right">收藏</span>
              </div>
              <div className="px-4">
                {topDomains.map((row) => (
                  <button
                    type="button"
                    key={`${row.rank}-${row.platform}`}
                    className="grid h-[58px] w-full cursor-pointer grid-cols-[52px_minmax(0,1fr)_82px_82px_82px_52px] items-center border-b border-app-border-soft text-left text-sm font-normal text-app-ink"
                    aria-label={`打开 ${row.platform} 引用域`}
                    onClick={() =>
                      setSelectedSource({
                        title: `${row.platform} 引用域`,
                        domain: "https://startups.co.uk/websites/ecommerce/best-ecommerce-platforms-uk/",
                        rank: row.rank,
                      })
                    }
                  >
                    <Rank value={row.rank} />
                    <div className="flex min-w-0 items-center gap-3">
                      <LogoMark src={row.logo} label={row.platform} />
                      <span className="truncate">{row.platform}</span>
                    </div>
                    <span className="text-right">{row.count}</span>
                    <span className="text-right">
                      <ChangePill value={row.countChange} />
                    </span>
                    <span className="text-right">{row.share}</span>
                    <span className="flex justify-end">
                      <ChangePill value={row.shareChange} />
                    </span>
                  </button>
                ))}
              </div>
              <PaginationFooter />
            </Panel>

            <Panel title="热门引用页面" description="探索AI回答中最常被引用的网页" className="h-[544px]">
              <div className="grid h-10 grid-cols-[52px_minmax(0,1fr)_78px_78px_52px] items-center px-4 text-xs font-medium text-app-ink">
                <span>排行</span>
                <span>域名</span>
                <span className="text-right">Count</span>
                <span className="text-right" />
                <span className="text-right">收藏</span>
              </div>
              <div className="px-4">
                {popularPages.map((row) => (
                  <button
                    type="button"
                    key={`${row.rank}-${row.title}`}
                    className="grid h-[58px] w-full cursor-pointer grid-cols-[52px_minmax(0,1fr)_78px_78px_52px] items-center border-b border-app-border-soft text-left text-sm font-normal text-app-ink"
                    aria-label={`打开 ${row.title}`}
                    onClick={() => setSelectedSource({ title: row.title, domain: row.domain, rank: row.rank })}
                  >
                    <Rank value={row.rank} />
                    <div className="min-w-0">
                      <div className="truncate text-sm text-app-muted">{row.title}</div>
                      <div className="truncate text-xs text-app-ink">{row.domain}</div>
                    </div>
                    <span className="text-right">{row.count}</span>
                    <span className="text-right">
                      <ChangePill value={row.change} />
                    </span>
                    <span className="flex justify-end">
                      <Star className={cn("size-4", row.favorite ? "fill-app-orange text-app-orange" : "text-slate-600")} />
                    </span>
                  </button>
                ))}
              </div>
              <PaginationFooter />
            </Panel>
          </div>

          <Panel
            title="特别关注"
            description="监控特定领域的引用表现和趋势"
            className="min-h-[558px]"
            action={
              <div className="relative w-[220px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-app-muted" />
                <Input className="h-9 rounded-md border-app-border bg-white pl-9 text-sm shadow-none" placeholder="筛选域..." />
              </div>
            }
          >
            <div className="grid h-12 grid-cols-[minmax(0,1fr)_140px_72px_72px_72px_72px_52px] items-center px-4 text-xs font-medium text-app-ink">
              <span>域名</span>
              <span>类别</span>
              <span className="text-right">Count</span>
              <span className="text-right" />
              <span className="text-right">Count</span>
              <span className="text-right" />
              <span className="text-right">收藏</span>
            </div>
            <div className="px-4">
              {watchRows.map((row, index) => (
                <button
                  type="button"
                  key={`${row.domain}-${index}`}
                  className="grid h-[68px] w-full cursor-pointer grid-cols-[minmax(0,1fr)_140px_72px_72px_72px_72px_52px] items-center border-b border-app-border-soft text-left text-sm font-normal text-app-ink"
                  aria-label={`打开 ${row.domain}`}
                  onClick={() => setSelectedSource({ title: "Best Ecommerce Platforms UK", domain: row.domain })}
                >
                  <span className="truncate text-xs text-app-muted underline decoration-app-control-border underline-offset-2">{row.domain}</span>
                  <span>
                    <span
                      className={cn(
                        "inline-flex h-5 items-center rounded px-1.5 text-xs",
                        row.tone === "yellow" && "bg-yellow-100 text-app-ink",
                        row.tone === "pink" && "bg-red-100 text-app-ink",
                        row.tone === "green" && "bg-green-100 text-app-ink",
                        row.tone === "blue" && "bg-blue-100 text-app-ink",
                      )}
                    >
                      {row.category}
                    </span>
                  </span>
                  <span className="text-right">{row.count}</span>
                  <span className="text-right">
                    <ChangePill value={row.countChange} />
                  </span>
                  <span className="text-right">{row.share}</span>
                  <span className="flex justify-end">
                    <ChangePill value={row.shareChange} />
                  </span>
                  <span className="flex justify-end">
                    <Star className="size-4 fill-app-orange text-app-orange" />
                  </span>
                </button>
              ))}
            </div>
            <PaginationFooter />
          </Panel>
        </div>
      </main>
      <CitationDetailSheet source={selectedSource} onOpenChange={(open) => !open && setSelectedSource(null)} />
      <Dialog open={isRankingInfoOpen} onOpenChange={setIsRankingInfoOpen}>
        <DialogContent className="max-w-[560px] rounded-xl border-app-border bg-white p-6 text-app-ink">
          <DialogTitle className="text-lg font-semibold leading-7 text-app-ink">引用排名说明</DialogTitle>
          <DialogDescription className="text-sm font-normal leading-[22px] text-app-muted">
            引用排名展示品牌在 AI 回复引用来源中的相对位置、引用次数和排名变化。
          </DialogDescription>
          <div className="mt-4 rounded-lg bg-app-panel p-4 text-sm leading-[22px] text-app-muted">
            排名上升表示本周期内品牌相关页面被 AI 回答引用的频次增加，可结合热门引用页面和特别关注域名继续排查来源。
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
