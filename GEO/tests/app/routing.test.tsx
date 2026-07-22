import { fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { AppRoutes } from "@/app/router"

describe("AppRoutes", () => {
  it("renders the dashboard route inside the workbench shell", async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByText("营销Agent")).toBeInTheDocument()
    expect(screen.getByText("新建对话")).toBeInTheDocument()
    expect(screen.getByText("今天聚焦哪个品牌？")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("分配一个任务，或 @ 委派给某位 Agent...")).toBeInTheDocument()
    expect(screen.getByText("为品牌生成GEO全量策略方案")).toBeInTheDocument()
    expect(screen.getByTestId("dashboard-ascii-background")).toBeInTheDocument()

    expect(screen.queryByRole("button", { name: "营销Agent" })).not.toBeInTheDocument()
    expect(screen.getByTestId("agent-mode-tabs")).toHaveClass("bg-app-control-bg/80", "backdrop-blur-[2px]")
    expect(screen.getByRole("button", { name: "Multi-Agent" })).toHaveClass("bg-white", "font-normal")
    expect(screen.getByRole("button", { name: "Multi-Agent" })).toHaveClass("text-app-ink")
    expect(screen.getByRole("button", { name: "Multi-Agent" }).querySelector("span")).toHaveClass("rounded-full")
    expect(screen.getByRole("button", { name: "DataAgent" })).toHaveClass("text-app-muted")
    expect(screen.getByRole("button", { name: "DataAgent" })).not.toHaveClass("bg-white")
    expect(screen.getByRole("button", { name: "DataAgent" })).not.toHaveClass("font-medium")
    expect(screen.getByRole("button", { name: "Strategy Agent" })).toHaveClass("text-app-muted")
    expect(screen.getByRole("button", { name: "Strategy Agent" })).not.toHaveClass("bg-white")
    expect(screen.getByRole("button", { name: "Writer Agent" })).toHaveClass("text-app-muted")
    expect(screen.getByRole("button", { name: "Writer Agent" })).not.toHaveClass("bg-white")
    expect(screen.getAllByRole("button", { name: "实时监控alibaba.com排名情况" })[0]).toHaveClass("hover:bg-app-panel")
    expect(screen.getAllByRole("button", { name: "实时监控alibaba.com排名情况" })[0]).toHaveClass("font-normal")
    expect(screen.getAllByRole("button", { name: "实时监控alibaba.com排名情况" })[0]).not.toHaveClass("font-medium")
    expect(screen.getAllByRole("button", { name: "实时监控alibaba.com排名情况" })[0]).not.toHaveClass("bg-app-panel")
    expect(screen.getByRole("button", { name: "数据大盘Data" })).toHaveClass("hover:bg-app-panel")
    expect(screen.getByRole("button", { name: "数据大盘Data" })).toHaveClass("font-normal")
    expect(screen.getByRole("button", { name: "数据大盘Data" })).not.toHaveClass("font-medium")
    expect(screen.getByRole("button", { name: "数据大盘Data" })).not.toHaveClass("bg-app-panel")
    expect(screen.getByText("历史记录").parentElement?.querySelector("svg")).toBeInTheDocument()
    expect(screen.getByText("Data")).toHaveClass("text-xs", "font-normal", "text-app-muted")

    const promptForm = screen.getByPlaceholderText("分配一个任务，或 @ 委派给某位 Agent...").closest("form")
    const promptInputGroup = promptForm?.querySelector("[data-slot='input-group']")
    expect(promptForm).toHaveClass("focus-within:border-app-ink", "shadow-none")
    expect(promptForm).not.toHaveClass("shadow-sm")
    expect(promptInputGroup).toHaveClass("border-0", "shadow-none")
    expect(promptInputGroup?.querySelector("[data-slot='dropdown-menu-trigger']")).toHaveClass(
      "bg-transparent",
      "hover:bg-app-panel",
    )
    expect(promptInputGroup?.querySelector("[data-slot='dropdown-menu-trigger']")).not.toHaveClass("bg-app-panel")

    const strategyButton = screen.getByRole("button", { name: "为品牌生成GEO全量策略方案" })
    const visibilityButton = screen.getByRole("button", { name: "分析竟品AI可见度差距报告" })
    const roadmapButton = screen.getByRole("button", { name: "制定AI平台90天策略优化路线" })
    expect(strategyButton).toHaveClass("shadow-none")
    expect(strategyButton).not.toHaveClass("shadow-sm")
    expect(visibilityButton).toHaveClass("shadow-none")
    expect(roadmapButton).toHaveClass("shadow-none")
    expect(strategyButton.querySelector("svg")).toHaveClass("text-blue-500")
    expect(visibilityButton.querySelector("svg")).toHaveClass("text-emerald-600")
    expect(roadmapButton.querySelector("svg")).toHaveClass("text-orange-500")
    expect(screen.getByTestId("quick-start-suggestions")).toHaveClass("no-scrollbar")

    const mascotImage = screen.getByTestId("strategy-agent-mascot")
    const mascotPoster = screen.getByTestId("strategy-agent-mascot-poster")
    expect(mascotImage).toHaveAttribute("src", expect.stringContaining("multi-agent-mascot-loop.gif"))
    expect(mascotPoster).toHaveAttribute("src", expect.stringContaining("multi-agent-mascot-first-frame.png"))
    expect(mascotImage).toHaveClass("scale-x-[-1]")
    expect(mascotPoster).toHaveClass("scale-x-[-1]")
    expect(mascotImage).toHaveStyle({
      right: "0px",
      top: "-16px",
      width: "160px",
      height: "160px",
    })
    expect(screen.queryByTestId("strategy-agent-mascot-bg")).not.toBeInTheDocument()

    const promptTextarea = screen.getByPlaceholderText("分配一个任务，或 @ 委派给某位 Agent...")
    const submitButton = screen.getByRole("button", { name: "Submit" })
    expect(submitButton).toBeDisabled()
    expect(submitButton).toHaveClass("opacity-60")
    expect(submitButton).not.toHaveClass("opacity-100")

    fireEvent.change(promptTextarea, { target: { value: "生成策略" } })

    expect(submitButton).toBeEnabled()
    expect(submitButton).toHaveClass("opacity-100")
    expect(submitButton).not.toHaveClass("opacity-60")

    expect(screen.queryByText("GEO问题来AgentAlphaRank")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Strategy Agent" }))

    expect(screen.getByText("你的GEO 品牌策略师")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Writer Agent" }))

    expect(screen.getByRole("button", { name: "Writer Agent" })).toHaveClass("bg-white", "text-app-ink")
    expect(screen.getByText("你的内容创作师")).toBeInTheDocument()
    expect(mascotImage).toHaveAttribute("src", expect.stringContaining("writer-agent-mascot-loop.gif"))
    expect(mascotPoster).toHaveAttribute("src", expect.stringContaining("writer-agent-mascot-loop-first-frame.png"))

    await user.click(screen.getByRole("button", { name: "Submit" }))

    expect(screen.getByText("正在理解问题并准备分析上下文...")).toBeInTheDocument()
    expect(screen.queryByText("Thought for 4 seconds")).not.toBeInTheDocument()
    expect(await screen.findByText("Thought for 4 seconds")).toBeInTheDocument()
    expect(await screen.findByText("品牌 AI 可见度 28 天趋势")).toBeInTheDocument()
    expect(screen.queryByTestId("dashboard-ascii-background")).not.toBeInTheDocument()
  })

  it("uses the route agent as the conversation title", async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={["/marketing-agent?agent=writer-agent"]}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole("button", { name: "Writer Agent" })).toHaveClass("bg-white", "text-app-ink")
    expect(screen.getByText("你的内容创作师")).toBeInTheDocument()

    fireEvent.change(screen.getByPlaceholderText("我能为您做些什么？"), { target: { value: "写一篇小红书内容" } })
    await user.click(screen.getByRole("button", { name: "Submit" }))

    expect(await screen.findByText("Writer Agent")).toBeInTheDocument()
    expect(screen.queryByText("DataAgent")).not.toBeInTheDocument()
  })

  it("renders the AI traffic dashboard route", () => {
    render(
      <MemoryRouter initialEntries={["/diagnosis"]}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole("heading", { name: "Alibaba.com AI 流量看板" })).toBeInTheDocument()
    expect(screen.getByText("回答记录")).toBeInTheDocument()
  })

  it("uses the same collapsible product rail on standard product routes", async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={["/diagnosis"]}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole("img", { name: "AlphaRank 标志" })).toBeVisible()
    expect(screen.getByRole("img", { name: "AlphaRank 标志" })).toHaveAttribute(
      "src",
      expect.stringContaining("alpharank-mascot-logo"),
    )
    expect(screen.getByTestId("sidebar-toggle")).toHaveClass("opacity-0")
    expect(screen.getByTestId("sidebar-toggle")).not.toHaveClass("shadow-sm")
    expect(screen.getByTestId("sidebar-toggle")).toHaveClass("shadow-none")
    expect(screen.getByTestId("brand-corner-mask")).toBeInTheDocument()
    expect(screen.getAllByRole("img", { name: "Alibaba.com 标志" })[0]).toHaveAttribute(
      "src",
      expect.stringContaining("alibaba-brand-avatar"),
    )
    expect(screen.getByRole("img", { name: "切换品牌" })).toHaveAttribute("src", expect.stringContaining("caret-sort"))
    expect(screen.getByRole("img", { name: "切换品牌" })).toHaveClass("left-5", "top-5", "size-3")
    expect(screen.getByTestId("sidebar-monitor-shortcut")).toBeInTheDocument()

    const activeCollapsedLink = screen.getByLabelText("数据大盘")
    expect(activeCollapsedLink.querySelector("svg")).toHaveClass("text-app-muted")
    expect(screen.queryByText("营销Agent")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "展开侧边栏" }))

    expect(screen.getByRole("img", { name: "AlphaRank 字标" })).toHaveAttribute(
      "src",
      expect.stringContaining("alpharank-wordmark"),
    )
    expect(screen.getAllByText("Alibaba.com").length).toBeGreaterThan(0)
    expect(screen.getByText("当前用户")).toBeInTheDocument()
    expect(screen.getByText("xuhao199747")).toBeInTheDocument()
    expect(screen.queryByText("数据看板")).not.toBeInTheDocument()
    expect(screen.getByText("诊断")).toBeInTheDocument()
    expect(screen.getByText("GEO诊断")).toBeInTheDocument()
    expect(screen.getByText("品牌监测工作台")).toBeInTheDocument()
    expect(screen.getByText("数据大盘")).toBeInTheDocument()

    const activeExpandedLink = screen.getByLabelText("数据大盘")
    expect(activeExpandedLink.querySelector("svg")).toHaveClass("text-app-muted")
    expect(activeExpandedLink.querySelector("span")).not.toHaveClass("font-medium")

    const inactiveExpandedLink = screen.getByLabelText("品牌提及率")
    expect(inactiveExpandedLink.querySelector("svg")).toHaveClass("text-app-muted")
    expect(inactiveExpandedLink.querySelector("span")).toHaveClass("text-app-ink")
    expect(inactiveExpandedLink.querySelector("span")).not.toHaveClass("font-medium")

    await user.click(screen.getByRole("button", { name: "收起侧边栏" }))

    expect(screen.queryByText("营销Agent")).not.toBeInTheDocument()
    expect(screen.getByRole("img", { name: "AlphaRank 标志" })).toBeVisible()
    expect(screen.getByTestId("sidebar-toggle")).toHaveClass("opacity-0")
    expect(screen.getByTestId("sidebar-toggle")).not.toHaveClass("group-focus-within:opacity-100")
  })

  it("renders the answer monitor route", async () => {
    render(
      <MemoryRouter initialEntries={["/answer-monitor"]}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(await screen.findByRole("heading", { name: "AI 引用来源" })).toBeInTheDocument()
    expect(await screen.findByText("ChatGPT")).toBeInTheDocument()
  })

  it("keeps query-specific sidebar links from double-highlighting", async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={["/answer-monitor?view=platform"]}>
        <AppRoutes />
      </MemoryRouter>,
    )

    const sourceLink = screen.getByLabelText("AI引用来源")
    const platformLink = screen.getByLabelText("分平台AI引用统计")

    expect(sourceLink).not.toHaveClass("bg-app-panel")
    expect(platformLink).toHaveClass("bg-app-panel")

    await user.click(screen.getByRole("button", { name: "展开侧边栏" }))

    expect(screen.getByLabelText("AI引用来源")).not.toHaveClass("bg-app-panel")
    expect(screen.getByLabelText("分平台AI引用统计")).toHaveClass("bg-app-panel")
  })

  it("renders the standalone GEO diagnosis route from the sidebar diagnosis entry", async () => {
    const user = userEvent.setup()

    render(
      <MemoryRouter initialEntries={["/geo-diagnosis"]}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole("heading", { name: "GEO诊断" })).toBeInTheDocument()
    expect(screen.getByText("诊断记录")).toBeInTheDocument()
    expect(screen.getByText("网页诊断")).toBeInTheDocument()
    expect(screen.getByPlaceholderText("输入您的域名（例如，apple.com）")).toBeInTheDocument()
    expect(screen.getByText("GEO诊断是对网站内容在生成式搜索引擎中的可见性、语义匹配度和被AI引用能力进行评估与优化分析的过程。")).toBeInTheDocument()
    expect(screen.queryByText("https://www.allswell.com/collections/mattresses")).not.toBeInTheDocument()
    expect(screen.queryByText("快速胜利")).not.toBeInTheDocument()
    expect(screen.queryByText("30天优化计划")).not.toBeInTheDocument()
    expect(screen.getByText("显示1-5项，共20项")).toBeInTheDocument()
    expect(screen.getByTestId("geo-diagnosis-workbench")).toHaveClass("bg-white")
    expect(screen.getByTestId("sidebar-monitor-shortcut").querySelector("svg")).toHaveClass("size-4")
    expect(screen.getByTestId("geo-diagnosis-controls")).toHaveClass("flex-col", "gap-6")
    expect(screen.getByTestId("geo-diagnosis-controls")).not.toHaveClass("bg-[#f7f7f7]")
    expect(screen.getByTestId("geo-diagnosis-mode-tabs")).toHaveClass("h-10", "w-[184px]", "p-1")
    expect(screen.getByTestId("geo-diagnosis-mode-tabs")).not.toHaveClass("bg-[#f7f7f7]")
    expect(screen.getByRole("button", { name: "网页诊断" })).toHaveClass("bg-app-orange", "text-white")
    expect(screen.getByRole("button", { name: "网页诊断" })).not.toHaveClass("bg-white")
    expect(screen.getByRole("button", { name: "品牌诊断" })).toHaveClass("text-app-muted")
    expect(screen.getByRole("button", { name: "品牌诊断" })).not.toHaveClass("bg-white")
    expect(screen.getByTestId("geo-diagnosis-search-row")).toHaveClass("h-12", "w-full", "bg-white")
    expect(screen.getByTestId("geo-diagnosis-submit")).toHaveClass("size-7", "rounded-md", "bg-app-submit")
    expect(screen.getByTestId("geo-domain-filter-icon")).toHaveClass("lucide-search")
    expect(screen.getByTestId("geo-date-filter-icon")).toHaveClass("lucide-calendar-days")
    expect(screen.getByLabelText("筛选域名").closest("[data-slot='input-group']")).toHaveClass("h-10", "w-[320px]")
    expect(screen.getByLabelText("诊断日期").closest("[data-slot='input-group']")).toHaveClass("h-10", "w-[306px]")

    await user.click(screen.getAllByRole("button", { name: "查看网页诊断详情" })[0])

    expect(screen.getByRole("dialog")).toHaveClass("right-0", "w-[720px]", "sm:max-w-[720px]")
    expect(screen.getByText("网页诊断详情")).toBeInTheDocument()
    expect(screen.getByText("https://www.allswell.com/collections/mattresses")).toBeInTheDocument()
    expect(screen.getByText("快速胜利")).toBeInTheDocument()
    expect(screen.getByText("30天优化计划")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Close" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "展开侧边栏" }))

    const diagnosisLink = screen.getByLabelText("GEO诊断")
    expect(diagnosisLink).toHaveAttribute("href", "/geo-diagnosis")
    expect(diagnosisLink).toHaveClass("bg-app-panel")

    await user.click(screen.getByRole("button", { name: "收起侧边栏" }))
    await user.click(screen.getByRole("button", { name: "品牌诊断" }))

    expect(screen.getByPlaceholderText("例如：小米、大疆、华为......")).toBeInTheDocument()
    expect(screen.getAllByText("Zara").length).toBeGreaterThan(0)
    expect(screen.queryByText("快速胜利")).not.toBeInTheDocument()
    expect(screen.queryByPlaceholderText("输入您的域名（例如，apple.com）")).not.toBeInTheDocument()

    await user.click(screen.getAllByRole("button", { name: "查看品牌诊断详情" })[0])

    expect(screen.getByRole("dialog")).toHaveClass("right-0", "w-[720px]", "sm:max-w-[720px]")
    expect(screen.getByText("品牌诊断详情")).toBeInTheDocument()
    expect(screen.getByText("GEO健康报告")).toBeInTheDocument()
    expect(screen.getByText("各维度评分")).toBeInTheDocument()
    expect(screen.getByText("优化建议")).toBeInTheDocument()

    await user.click(screen.getByRole("tab", { name: "AI问题" }))
    expect(screen.getByText("AI问题推荐")).toBeInTheDocument()
    expect(screen.getByText("哪个品牌的女装设计更时尚")).toBeInTheDocument()

    await user.click(screen.getByRole("tab", { name: "GEO表现纵览" }))
    expect(screen.getByText("品牌提及总数（前十）")).toBeInTheDocument()
    expect(screen.getByText("品牌/站点表现")).toBeInTheDocument()

    await user.click(screen.getByRole("tab", { name: "GEO表现按平台" }))
    expect(screen.getByText("分平台表现")).toBeInTheDocument()
    expect(screen.getByText("ChatGPT")).toBeInTheDocument()

    await user.click(screen.getByRole("tab", { name: "AI回复详情" }))
    expect(screen.getByRole("tab", { name: "AI回复详情" })).toHaveAttribute("aria-selected", "true")
    expect(screen.getByText("哪个平台适合小商家做跨境批发？")).toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "Close" }))
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument()

    await user.click(screen.getByRole("button", { name: "网页诊断" }))

    expect(screen.getByPlaceholderText("输入您的域名（例如，apple.com）")).toBeInTheDocument()
  })
})
