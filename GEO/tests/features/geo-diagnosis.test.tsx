import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { GeoDiagnosisDetailPage } from "@/features/geo-diagnosis/GeoDiagnosisDetailPage"
import { GeoDiagnosisPage } from "@/features/geo-diagnosis/GeoDiagnosisPage"

describe("GEO diagnosis", () => {
  it("renders diagnosis list metrics", async () => {
    render(<GeoDiagnosisPage />, { wrapper: MemoryRouter })

    await waitFor(() => expect(screen.getByRole("heading", { name: "Alibaba.com AI 流量看板" })).toBeInTheDocument())
    expect(screen.getAllByText("可见度评分")[0]).toBeInTheDocument()
    expect(screen.getByText("情感评分")).toBeInTheDocument()
    expect(screen.getByText("AI 建议")).toBeInTheDocument()
    expect(screen.getByText("竞品分析（按可见度）")).toBeInTheDocument()
    expect(screen.getByText("回答记录")).toBeInTheDocument()
    expect(screen.getByText("Meta AI")).toBeInTheDocument()
    expect(screen.getByText("Grok")).toBeInTheDocument()
    expect(screen.getByText("显示 1-5 / 共 20 项")).toBeInTheDocument()
    expect(screen.getByLabelText("Google 平台筛选")).toBeInTheDocument()
    expect(screen.getByLabelText("Meta AI 平台筛选")).toBeInTheDocument()
    expect(screen.getByLabelText("Perplexity 平台筛选")).toBeInTheDocument()
    expect(screen.getByLabelText("Google 平台筛选")).toHaveClass("rounded-md", "border-border")
    expect(screen.getByLabelText("Google 平台筛选")).not.toHaveClass("rounded-full", "border-[#ff6b1a]")

    expect(screen.getByTestId("geo-score-cards")).toHaveClass("gap-6", "h-[314px]")
    expect(screen.getByTestId("geo-dashboard-header")).toHaveClass("sticky", "top-0", "z-30", "bg-white")
    expect(screen.getByTestId("geo-secondary-cards")).toHaveClass("mt-6", "gap-6")
    expect(screen.getByTestId("geo-responses-card")).toHaveClass("mt-6")
    expect(screen.getByTestId("visibility-score-card")).toHaveClass("bg-gradient-to-b", "from-white", "to-orange-50")
    expect(screen.getByTestId("sentiment-score-card")).toHaveClass("bg-gradient-to-b", "from-white", "to-sky-50")
    expect(screen.getByTestId("ai-advice-card")).toHaveClass("relative", "h-full", "pb-[54px]")
    expect(screen.getByTestId("ai-advice-footer")).toHaveClass("absolute", "bottom-4", "left-4", "right-4")
    expect(screen.queryByLabelText(/刷新/)).not.toBeInTheDocument()
    expect(screen.getByTestId("visibility-score-card-title")).toHaveClass("text-[18px]", "font-medium", "leading-7", "text-slate-900")
    expect(screen.getByTestId("sentiment-score-card-title")).toHaveClass("text-[18px]", "font-medium", "leading-7", "text-slate-900")
    expect(screen.getByTestId("competitor-card-title")).toHaveClass("text-[18px]", "font-medium", "leading-7", "text-slate-900")
    expect(screen.getByTestId("trend-card-title")).toHaveClass("text-[18px]", "font-medium", "leading-7", "text-slate-900")
    expect(screen.getByTestId("ai-advice-card-title")).toHaveClass("text-[18px]", "font-medium", "leading-7", "text-slate-900")
    expect(screen.getByTestId("visibility-gauge")).toHaveClass("h-[180px]", "w-[360px]", "mt-4")
    expect(screen.getByTestId("sentiment-bars")).toHaveClass("h-[170px]", "w-full", "px-5")
    expect(screen.getByTestId("sentiment-tooltip")).toHaveClass("whitespace-nowrap", "text-[18px]")
    expect(screen.getByTestId("sentiment-bar-0")).toHaveClass("h-[52px]", "flex-1", "min-w-0")
    expect(screen.getByTestId("visibility-score-value")).toHaveClass("text-[30px]", "leading-[38px]")
    expect(screen.getByTestId("trend-score-value")).toHaveClass("text-[30px]", "leading-[38px]")
    expect(screen.getByTestId("response-row-Meta AI")).toHaveClass("h-[50px]")
    expect(screen.getByTestId("response-row-Meta AI")).not.toHaveClass("bg-[#f2f2f2]")
    expect(screen.getByTestId("model-pill-Meta AI")).toHaveClass("h-6", "rounded-full", "border")
    expect(screen.getByAltText("Alibaba.com 标志")).toHaveAttribute("src", expect.stringContaining("alibaba"))
    expect(screen.getByAltText("Meta AI 标志")).toHaveAttribute("src", expect.stringContaining("meta-ai"))
  })

  it("renders diagnosis detail recommendations", async () => {
    render(<GeoDiagnosisDetailPage />, { wrapper: MemoryRouter })

    await waitFor(() => expect(screen.getByText("诊断详情")).toBeInTheDocument())
    expect(screen.getByText("高优先级")).toBeInTheDocument()
  })
})
