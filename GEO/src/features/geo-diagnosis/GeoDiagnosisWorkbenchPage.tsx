import { ArrowDownToLine, ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Search } from "lucide-react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

type DiagnosisMode = "brand" | "webpage"

const webpageScoreItems = [
  { label: "GEO综合", value: 41, info: true },
  { label: "AI可引用性", value: 41 },
  { label: "品牌权威性", value: 41 },
  { label: "E-E-A-T信号", value: 41 },
]

const brandScoreItems = [
  { label: "GEO综合得分", value: 41, suffix: "/100", info: true },
  { label: "品牌提及率", value: 36, suffix: "%" },
  { label: "平均提及排名", value: 4.7, suffix: "名" },
  { label: "站点被引用率", value: 36, suffix: "%" },
  { label: "分析引用来源", value: 137, suffix: "个" },
]

const webpageDiagnosisRows = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  primary: "www.allswell.com",
  secondary: "www.allswellallswellallswellallswell.com",
  time: "2026-03-10 14:22",
  expanded: index === 0,
}))

const brandDiagnosisRows = Array.from({ length: 4 }, (_, index) => ({
  id: index + 1,
  primary: "Zara",
  secondary: "",
  time: "2026-03-10 14:22",
  expanded: index === 0,
}))

const webpageDetailMetrics = [
  { title: "AI 可引用性", value: 68, desc: "内容结构清晰，但缺少可直接引用的段落和 FAQ 内容" },
  { title: "品牌权威性", value: 68, desc: "品牌信息不完整，缺少第三方认证和专家评价" },
  { title: "E-E-A-T 信号", value: 68, desc: "作者信息、内容来源和专业性信号需加强" },
  { title: "技术 GEO", value: 68, desc: "页面加载正常，基础技术设施到位，爬虫可正常抓取" },
  { title: "结构化数据", value: 68, desc: "JSON-LD Schema 标记不完善，缺少 FAQ、产品、组织模型" },
  { title: "内容可发现性", value: 68, desc: "内容在 AI 平台训练数据中的覆盖度和可发现性" },
]

const webpageIssues = [
  {
    title: "紧急问题",
    color: "bg-red-500",
    items: ["缺少 Product/Organization Schema 标记，AI 无法理解结构化信息", "无 FAQ 内容区域，错失 AI 直接引用机会", "品牌主页缺少权威性内容支撑"],
  },
  {
    title: "高优问题",
    color: "bg-orange-500",
    items: ["缺少 AggregateRating、BreadcrumbList 等辅助 Schema", "内容过于密集，缺少可扫描的列表和标题结构", "缺少内部链接和主题权威建设"],
  },
  {
    title: "中优问题",
    color: "bg-yellow-400",
    items: ["图片 alt 文本不完整，影响 AI 对图片内容的理解", "内容更新时间标记不明显，影响新鲜度评估", "Open Graph 标签需进一步优化"],
  },
]

const quickWins = ["添加 Organization Schema 和基础产品/服务 Schema", "创建 FAQ 页面或在主要页面内嵌 FAQ 模块", "优化内容结构：使用小标题、要点列表、数据表格", "建立品牌故事页和公司介绍页", "添加内容更新日期和作者信息"]

const optimizationPlan = [
  { title: "第一周.修复技术", items: ["实现基础 Schema 标记", "添加 FAQ 内容区域", "优化 Meta 描述"] },
  { title: "第二周.内容升级", items: ["重构内容格式，增加可扫描结构", "建立品牌故事页", "增加专业内容支撑"] },
  { title: "第三周.权威建设", items: ["添加认证和评价信息", "引入专家评论和第三方认可", "建立内容更新机制"] },
  { title: "第四周.高级优化", items: ["实现 How-To 内容和比较内容", "优化特色片段机会", "多平台内容分发布局"] },
]

const brandHealthTabs = ["GEO健康报告", "AI问题", "GEO表现纵览", "GEO表现按平台", "AI回复详情"]

const brandDimensionScores = [
  { title: "AI 可见度", value: 68, trend: "↗", trendColor: "text-green-600", desc: "品牌在 AI 平台的提及频率和曝光度" },
  { title: "内容权威性", value: 68, trend: "↗", trendColor: "text-green-600", desc: "内容被 AI 引用为权威信源的比例" },
  { title: "结构化数据", value: 68, trend: "⌁", trendColor: "text-red-500", desc: "Schema.org 标记、FAQ、结构化内容完备度" },
]

const brandOptimizationSuggestions = [
  { priority: "高优先级", color: "border-red-500 bg-orange-50 text-app-orange", title: "AI 可见度", desc: "品牌在 AI 平台的提及频率和曝光度" },
  { priority: "中优先级", color: "border-orange-500 bg-orange-50 text-app-orange", title: "AI 可见度", desc: "品牌在 AI 平台的提及频率和曝光度" },
  { priority: "低优先级", color: "border-green-600 bg-green-50 text-green-600", title: "AI 可见度", desc: "品牌在 AI 平台的提及频率和曝光度" },
]

const brandAiQuestions = [
  { keyword: "女装", question: "哪个品牌的女装设计更时尚", heat: "高" },
  { keyword: "跨境采购", question: "Alibaba.com 和 Shopify 哪个平台更适合批量采购", heat: "高" },
  { keyword: "供应链", question: "如何判断一个 B2B 品牌是否具备稳定供应能力", heat: "中" },
  { keyword: "品牌对比", question: "Zara 与 Shein 在海外市场的品牌优势是什么", heat: "中" },
]

const brandOverviewRows = [
  { brand: "Alibaba.com", mentions: "50次", rate: "36%", rank: "4.7名" },
  { brand: "Shopify", mentions: "50次", rate: "34%", rank: "5.1名" },
  { brand: "Shopee", mentions: "50次", rate: "31%", rank: "5.8名" },
  { brand: "Amazon", mentions: "50次", rate: "29%", rank: "6.2名" },
  { brand: "Shein", mentions: "50次", rate: "24%", rank: "7.4名" },
]

const brandPlatformRows = [
  { platform: "ChatGPT", mention: "36%", citation: "137个", sentiment: "正向" },
  { platform: "Perplexity", mention: "32%", citation: "96个", sentiment: "正向" },
  { platform: "Gemini", mention: "28%", citation: "84个", sentiment: "中性" },
  { platform: "豆包", mention: "25%", citation: "72个", sentiment: "中性" },
  { platform: "Kimi", mention: "21%", citation: "58个", sentiment: "中性" },
]

const brandReplyRows = [
  {
    model: "ChatGPT",
    question: "哪个平台适合小商家做跨境批发？",
    response: "Alibaba.com 更适合寻找供应商和批量采购，Shopify 更适合搭建独立站。",
  },
  {
    model: "Perplexity",
    question: "Alibaba.com 的品牌优势是什么？",
    response: "平台覆盖大量供应商目录，并在 B2B 采购场景中拥有较高引用频率。",
  },
  {
    model: "Gemini",
    question: "如何比较 B2B 平台的可信度？",
    response: "可以从供应商认证、评价、交易保障、内容透明度和第三方引用来源判断。",
  },
]

export function GeoDiagnosisWorkbenchPage() {
  const [mode, setMode] = useState<DiagnosisMode>("webpage")
  const [selectedDetail, setSelectedDetail] = useState<{ mode: DiagnosisMode; rowId: number } | null>(null)
  const isBrandMode = mode === "brand"
  const rows = isBrandMode ? brandDiagnosisRows : webpageDiagnosisRows
  const scoreItems = isBrandMode ? brandScoreItems : webpageScoreItems
  const isDetailDrawerOpen = selectedDetail !== null

  return (
    <div className="min-h-screen bg-white text-app-ink" data-testid="geo-diagnosis-workbench">
      <header className="sticky top-0 z-30 flex h-[110px] shrink-0 items-start bg-white px-6 py-6">
        <div>
          <h1 className="text-2xl font-semibold leading-8 tracking-normal text-app-ink">GEO诊断</h1>
          <p className="mt-2 max-w-[960px] text-sm font-normal leading-[22px] text-app-muted">
            GEO诊断是对网站内容在生成式搜索引擎中的可见性、语义匹配度和被AI引用能力进行评估与优化分析的过程。
          </p>
        </div>
      </header>

      <main className="flex w-full flex-col gap-6 px-6 py-6">
        <section data-testid="geo-diagnosis-controls" className="flex w-full flex-col items-start gap-6 overflow-hidden">
          <div
            data-testid="geo-diagnosis-mode-tabs"
            className="flex h-10 w-[184px] shrink-0 items-center rounded-md border border-app-border bg-white p-1"
          >
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setMode("brand")
                setSelectedDetail(null)
              }}
              className={cn(
                "h-8 flex-1 rounded-md px-4 text-sm font-normal shadow-none hover:bg-app-orange hover:text-white",
                isBrandMode ? "bg-app-orange text-white" : "bg-transparent text-app-muted",
              )}
            >
              品牌诊断
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setMode("webpage")}
              className={cn(
                "h-8 flex-1 rounded-md px-4 text-sm font-normal shadow-none hover:bg-app-orange hover:text-white",
                !isBrandMode ? "bg-app-orange text-white" : "bg-transparent text-app-muted",
              )}
            >
              网页诊断
            </Button>
          </div>

          <div
            data-testid="geo-diagnosis-search-row"
            className="flex h-12 w-full min-w-0 flex-1 items-center rounded-lg border border-app-border bg-white pr-2"
          >
            <div className="flex h-full w-[80px] shrink-0 items-center justify-center rounded-l-lg border-r border-app-border bg-white text-sm font-normal text-app-ink">
              {isBrandMode ? "品牌名" : "域名"}
            </div>
            <Input
              aria-label={isBrandMode ? "诊断品牌名" : "诊断域名"}
              placeholder={isBrandMode ? "例如：小米、大疆、华为......" : "输入您的域名（例如，apple.com）"}
              className="h-11 min-w-0 flex-1 border-0 bg-transparent px-5 text-sm font-normal text-app-ink shadow-none placeholder:text-app-muted focus-visible:ring-0"
            />
            <Button
              data-testid="geo-diagnosis-submit"
              size="icon-sm"
              className="size-7 rounded-md bg-app-submit text-white shadow-none hover:bg-app-submit"
            >
              <ArrowUpRight className="size-3.5" />
            </Button>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-app-border bg-white">
          <div className="flex h-16 items-center gap-4 p-4">
            <h2 className="mr-auto text-lg font-normal leading-7 text-app-ink">诊断记录</h2>
            <InputGroup className="h-10 w-[320px] rounded-lg border-app-border bg-white shadow-none">
              <InputGroupAddon align="inline-start" className="pl-4 pr-2 text-app-muted">
                <Search data-testid="geo-domain-filter-icon" className="size-5" />
              </InputGroupAddon>
              <InputGroupInput
                aria-label="筛选域名"
                placeholder="筛选域名..."
                className="h-9 px-2 text-sm font-normal text-app-ink placeholder:text-neutral-400"
              />
            </InputGroup>
            <InputGroup className="h-10 w-[306px] rounded-lg border-app-border bg-white shadow-none">
              <InputGroupAddon align="inline-start" className="pl-4 pr-2 text-app-muted">
                <CalendarDays data-testid="geo-date-filter-icon" className="size-5" />
              </InputGroupAddon>
              <InputGroupInput
                aria-label="诊断日期"
                value="2024年10月10日"
                readOnly
                className="h-9 px-2 text-sm font-normal text-app-ink"
              />
            </InputGroup>
            <Button className="h-8 rounded-md bg-app-orange px-3 text-sm font-normal text-white shadow-none hover:bg-app-orange">
              搜索
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="h-10 border-app-border-soft bg-app-surface hover:bg-app-surface">
                <TableHead className="w-[196px] px-7 text-xs font-normal text-app-muted">{isBrandMode ? "品牌" : "域名"}</TableHead>
                <TableHead className="text-center text-xs font-normal text-app-muted">提示词</TableHead>
                <TableHead className="w-[184px] text-right text-xs font-normal text-app-muted">诊断时间</TableHead>
                <TableHead className="w-[72px] text-right text-xs font-normal text-app-muted">下载</TableHead>
                <TableHead className="w-[96px] text-right text-xs font-normal text-app-muted">查看结果</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <DiagnosisRow
                  key={row.id}
                  row={row}
                  scoreItems={scoreItems}
                  detailMode={mode}
                  onOpen={() => setSelectedDetail({ mode, rowId: row.id })}
                />
              ))}
            </TableBody>
          </Table>

          <div className="flex h-16 items-center justify-end px-7">
            <div className="flex items-center gap-4">
              <span className="text-sm font-normal text-app-muted">显示1-5项，共20项</span>
              <Button variant="outline" size="icon-sm" className="size-8 rounded-md border-app-border bg-white text-neutral-400 opacity-50 shadow-none hover:bg-white">
                <ChevronLeft className="size-4" />
              </Button>
              <Button variant="outline" size="icon-sm" className="size-8 rounded-md border-app-border bg-white text-app-ink shadow-none hover:bg-white">
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Sheet open={isDetailDrawerOpen} onOpenChange={(open) => !open && setSelectedDetail(null)}>
        <SheetContent side="right" className="w-[720px] gap-0 overflow-y-auto bg-white p-0 sm:max-w-[720px]">
          <SheetHeader className="border-b border-app-border-soft px-6 py-5">
            <SheetTitle className="text-xl font-normal leading-7 text-app-ink">
              {selectedDetail?.mode === "brand" ? "品牌诊断详情" : "网页诊断详情"}
            </SheetTitle>
            <SheetDescription className="text-sm font-normal text-app-muted">
              {selectedDetail?.mode === "brand" ? "查看品牌 GEO 健康报告、AI 问题和表现详情" : "查看网页 GEO 评分、问题和优化计划"}
            </SheetDescription>
          </SheetHeader>
          {selectedDetail?.mode === "brand" ? <BrandDiagnosisDetail /> : <WebpageDiagnosisDetail layout="drawer" />}
        </SheetContent>
      </Sheet>
    </div>
  )
}

function DiagnosisRow({
  row,
  scoreItems,
  detailMode,
  onOpen,
}: {
  row: (typeof webpageDiagnosisRows)[number]
  scoreItems: typeof webpageScoreItems | typeof brandScoreItems
  detailMode: DiagnosisMode
  onOpen: () => void
}) {
  return (
    <TableRow className="h-[68px] border-app-border-soft bg-white hover:bg-white">
      <TableCell className="px-7">
        <div className="max-w-40 truncate text-sm font-normal leading-5 text-app-ink">{row.primary}</div>
        {row.secondary ? <div className="mt-1 max-w-40 truncate text-xs font-normal leading-4 text-app-muted">{row.secondary}</div> : null}
      </TableCell>
      <TableCell>
        <div className="flex items-center justify-between">
          {scoreItems.map((score) => (
            <div key={score.label} className="w-20 shrink-0">
              <div className="flex items-end gap-1 text-base font-normal leading-6 text-app-ink">
                {score.value}
                <span className="pb-0.5 text-xs font-normal leading-4 text-app-muted">{"suffix" in score ? score.suffix : "/100"}</span>
              </div>
              <div className="mt-1 flex items-center gap-1 text-xs font-normal leading-4 text-app-muted">
                {score.label}
                {score.info ? (
                  <span className="flex size-3 items-center justify-center rounded-full border border-neutral-400 text-[8px] leading-none text-neutral-400">i</span>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </TableCell>
      <TableCell className="text-right text-sm font-normal text-app-ink">{row.time}</TableCell>
      <TableCell className="text-right">
        <Button variant="ghost" size="icon-sm" className="size-7 text-app-muted hover:bg-transparent">
          <ArrowDownToLine className="size-4" />
        </Button>
      </TableCell>
      <TableCell className="text-right">
        <Button
          type="button"
          variant="ghost"
          size="icon-sm"
          onClick={onOpen}
          aria-label={detailMode === "brand" ? "查看品牌诊断详情" : "查看网页诊断详情"}
          className="size-7 text-app-muted shadow-none hover:bg-transparent"
        >
          <ChevronRight className="size-4" />
        </Button>
      </TableCell>
    </TableRow>
  )
}

function BrandDiagnosisDetail() {
  return (
    <Tabs defaultValue={brandHealthTabs[0]} className="px-6 py-5 text-app-ink">
      <TabsList variant="line" className="h-9 w-full justify-start gap-8 rounded-none border-0 bg-transparent p-0">
        {brandHealthTabs.map((tab) => (
          <TabsTrigger
            key={tab}
            value={tab}
            className="h-9 rounded-none border-0 bg-transparent px-0 text-sm font-semibold text-app-ink shadow-none after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:w-full after:translate-x-0 after:rounded-full after:bg-app-orange focus-visible:border-transparent focus-visible:ring-0 focus-visible:outline-none data-[state=active]:bg-transparent data-[state=active]:text-app-orange data-[state=active]:shadow-none"
          >
            {tab}
          </TabsTrigger>
        ))}
      </TabsList>

      <TabsContent value="GEO健康报告" className="mt-5 space-y-5">
        <div className="flex items-end gap-2">
          <div className="text-[40px] font-normal leading-[46px] text-foreground">45</div>
          <div className="pb-1 text-lg font-normal text-app-ink">/100</div>
          <span className="mb-2 rounded-md bg-orange-50 px-2 py-1 text-xs font-normal text-app-orange">高优先级</span>
        </div>
        <div className="text-sm font-normal text-app-muted">GEO 总分 — 基于 6 个维度的全面评估</div>

        <section className="rounded-lg border border-app-border bg-white p-4">
          <h3 className="text-lg font-normal leading-7 text-app-ink">各维度评分</h3>
          <div className="mt-4 grid grid-cols-1 gap-4">
            {brandDimensionScores.map((metric) => (
              <div key={metric.title} className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-normal text-app-muted">{metric.title}</span>
                  <span className="flex items-center gap-2 text-sm font-normal text-app-ink">
                    <span className={cn("text-sm", metric.trendColor)}>{metric.trend}</span>
                    {metric.value}%
                  </span>
                </div>
                <div className="h-2 rounded-full bg-app-panel">
                  <div className="h-full w-[58%] rounded-full bg-app-orange" />
                </div>
                <p className="text-xs font-normal leading-5 text-app-muted">{metric.desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-app-border bg-white p-4">
          <h3 className="text-lg font-normal leading-7 text-app-ink">优化建议</h3>
          <div className="mt-4 grid grid-cols-1 gap-3">
            {brandOptimizationSuggestions.map((suggestion) => (
              <div key={`${suggestion.priority}-${suggestion.title}`} className="rounded-lg border border-app-border-soft bg-white p-3">
                <div className="flex items-center gap-3">
                  <span className={cn("rounded-md border px-2 py-1 text-xs font-normal", suggestion.color)}>{suggestion.priority}</span>
                  <span className="text-sm font-normal text-app-ink">{suggestion.title}</span>
                </div>
                <p className="mt-2 text-xs font-normal leading-5 text-app-muted">{suggestion.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </TabsContent>

      <TabsContent value="AI问题" className="mt-5">
        <DiagnosisMiniTable
          title="AI问题推荐"
          description="向 AI 咨询的问题，根据品牌信息与品牌词，结合用户搜索习惯生成。"
          headers={["核心词", "AI问题", "问题热度"]}
          rows={brandAiQuestions.map((item) => [item.keyword, item.question, item.heat])}
        />
      </TabsContent>

      <TabsContent value="GEO表现纵览" className="mt-5 space-y-4">
        <section className="rounded-lg border border-app-border bg-white p-4">
          <h3 className="text-lg font-normal leading-7 text-app-ink">品牌提及总数（前十）</h3>
          <div className="mt-4 space-y-3">
            {brandOverviewRows.map((item) => (
              <div key={item.brand} className="grid grid-cols-[1fr_80px_80px] items-center gap-4 text-sm font-normal">
                <span className="text-app-ink">{item.brand}</span>
                <span className="text-right text-app-ink">{item.mentions}</span>
                <span className="text-right text-app-muted">{item.rank}</span>
              </div>
            ))}
          </div>
        </section>
        <DiagnosisMiniTable
          title="品牌/站点表现"
          headers={["品牌/站点", "提及率", "平均排名"]}
          rows={brandOverviewRows.map((item) => [item.brand, item.rate, item.rank])}
        />
      </TabsContent>

      <TabsContent value="GEO表现按平台" className="mt-5">
        <DiagnosisMiniTable
          title="分平台表现"
          description="按 AI 平台查看品牌提及、引用来源与情感倾向。"
          headers={["平台", "提及率", "引用来源", "情感倾向"]}
          rows={brandPlatformRows.map((item) => [item.platform, item.mention, item.citation, item.sentiment])}
        />
      </TabsContent>

      <TabsContent value="AI回复详情" className="mt-5">
        <DiagnosisMiniTable
          title="AI回复详情"
          description="查看不同模型回答中对品牌与竞品的引用方式。"
          headers={["模型", "AI问题", "回复摘要"]}
          rows={brandReplyRows.map((item) => [item.model, item.question, item.response])}
          wide
        />
      </TabsContent>
    </Tabs>
  )
}

function DiagnosisMiniTable({
  title,
  description,
  headers,
  rows,
  wide = false,
}: {
  title: string
  description?: string
  headers: string[]
  rows: string[][]
  wide?: boolean
}) {
  return (
    <section className="rounded-lg border border-app-border bg-white p-4">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-normal leading-7 text-app-ink">{title}</h3>
        {description ? <p className="text-xs font-normal leading-5 text-app-muted">{description}</p> : null}
      </div>
      <div className="mt-4 overflow-hidden rounded-lg border border-app-border-soft">
        <div
          className={cn(
            "grid border-b border-app-border-soft bg-app-surface px-4 py-3 text-xs font-normal text-app-muted",
            wide ? "grid-cols-[96px_180px_1fr]" : headers.length === 4 ? "grid-cols-4" : "grid-cols-3",
          )}
        >
          {headers.map((header) => (
            <div key={header}>{header}</div>
          ))}
        </div>
        {rows.map((row) => (
          <div
            key={row.join("-")}
            className={cn(
              "grid border-b border-app-border-soft px-4 py-3 text-sm font-normal text-app-ink last:border-b-0",
              wide ? "grid-cols-[96px_180px_1fr]" : headers.length === 4 ? "grid-cols-4" : "grid-cols-3",
            )}
          >
            {row.map((cell, index) => (
              <div key={`${cell}-${index}`} className={cn(index > 0 && "text-app-muted", index === row.length - 1 && wide && "leading-5")}>
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  )
}

function WebpageDiagnosisDetail({ layout = "inline" }: { layout?: "inline" | "drawer" }) {
  const metricGridClassName = layout === "drawer" ? "grid grid-cols-2 gap-4" : "grid grid-cols-3 gap-4"
  const sectionGridClassName = layout === "drawer" ? "grid grid-cols-1 gap-4" : "grid grid-cols-2 gap-4"
  const planGridClassName = layout === "drawer" ? "mt-4 grid grid-cols-2 gap-3" : "mt-4 grid grid-cols-4 gap-3"

  return (
    <div className={cn("space-y-4 text-app-ink", layout === "drawer" ? "px-6 py-5" : "px-4 pb-5 pt-4")}>
      <div className="text-sm font-normal text-app-muted">https://www.allswell.com/collections/mattresses</div>
      <div className="flex items-end gap-2">
        <div className="text-[40px] font-normal leading-[46px] text-foreground">45</div>
        <div className="pb-1 text-lg font-normal text-app-ink">/100</div>
        <span className="mb-2 rounded-md bg-orange-50 px-2 py-1 text-xs font-normal text-app-orange">高优先级</span>
      </div>
      <div className="text-sm font-normal text-app-muted">GEO 总分 — 基于 6 个维度的全面评估</div>

      <div className={metricGridClassName}>
        {webpageDetailMetrics.map((metric) => (
          <div key={metric.title} className="rounded-lg border border-app-border bg-white p-4">
            <div className="text-lg font-normal leading-7 text-app-ink">{metric.title}</div>
            <div className="mt-4 text-2xl font-normal leading-8 text-app-ink">{metric.value}%</div>
            <div className="mt-3 h-2 rounded-full bg-app-panel">
              <div className="h-full w-[58%] rounded-full bg-app-orange" />
            </div>
            <p className="mt-3 text-xs font-normal leading-5 text-app-muted">{metric.desc}</p>
          </div>
        ))}
      </div>

      <div className={sectionGridClassName}>
        <section className="rounded-lg border border-app-border bg-white p-4">
          <h3 className="text-lg font-normal leading-7 text-app-ink">问题</h3>
          <div className="mt-4 space-y-4">
            {webpageIssues.map((group) => (
              <div key={group.title}>
                <div className="flex items-center gap-2 text-sm font-normal text-app-ink">
                  <span className={cn("size-2 rounded-full", group.color)} />
                  {group.title}
                </div>
                <ul className="mt-2 space-y-2 pl-4 text-sm font-normal leading-5 text-app-muted">
                  {group.items.map((item) => (
                    <li key={item} className="list-disc">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-lg border border-app-border bg-white p-4">
          <h3 className="text-lg font-normal leading-7 text-app-ink">快速胜利</h3>
          <ul className="mt-4 space-y-2 pl-4 text-sm font-normal leading-5 text-app-muted">
            {quickWins.map((item) => (
              <li key={item} className="list-disc">
                {item}
              </li>
            ))}
          </ul>
        </section>
      </div>

      <section className="rounded-lg border border-app-border bg-white p-4">
        <h3 className="text-lg font-normal leading-7 text-app-ink">30天优化计划</h3>
        <div className={planGridClassName}>
          {optimizationPlan.map((week) => (
            <div key={week.title} className="rounded-lg border border-app-border bg-app-surface p-4">
              <div className="text-sm font-normal text-app-ink">{week.title}</div>
              <ul className="mt-3 space-y-2 pl-4 text-sm font-normal leading-5 text-neutral-600">
                {week.items.map((item) => (
                  <li key={item} className="list-disc">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
