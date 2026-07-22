import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { CompetitorsPage } from "@/features/competitors/CompetitorsPage"
import { ContentStudioPage } from "@/features/content-studio/ContentStudioPage"
import { ReportsPage } from "@/features/reports/ReportsPage"
import { SettingsPage } from "@/features/settings/SettingsPage"
import { TasksPage } from "@/features/tasks/TasksPage"

describe("supporting pages", () => {
  it("renders competitor analysis", () => {
    render(<CompetitorsPage />, { wrapper: MemoryRouter })
    expect(screen.getByRole("heading", { name: "Competitive Analysis" })).toBeInTheDocument()
  })

  it("renders AI conversation records", () => {
    render(<ContentStudioPage />, { wrapper: MemoryRouter })
    expect(screen.getByRole("heading", { name: "AI对话记录" })).toBeInTheDocument()
    expect(screen.getByText("265个提示，涵盖8个主题，每天运行")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: "添加问题" })).toBeInTheDocument()
    expect(screen.getByText("时间范围")).toBeInTheDocument()
    expect(screen.getByText("Topics")).toBeInTheDocument()
    expect(screen.getByText("可见性趋势")).toBeInTheDocument()
    expect(screen.getAllByText("12.3%").length).toBeGreaterThan(0)
  })

  it("renders tasks, reports, and settings", () => {
    render(<TasksPage />, { wrapper: MemoryRouter })
    expect(screen.getByRole("heading", { name: "任务日历" })).toBeInTheDocument()
    expect(screen.getByText("2026 年 3 月")).toBeInTheDocument()
    expect(screen.getByText("3 月 14 日，周六")).toBeInTheDocument()
    expect(screen.getByText("今日任务")).toBeInTheDocument()
    expect(screen.getAllByText("09:00 品牌日报").length).toBeGreaterThan(0)
    expect(screen.getByText("未来 7 天到期")).toBeInTheDocument()

    render(<ReportsPage />, { wrapper: MemoryRouter })
    expect(screen.getByRole("heading", { name: "品牌提及率排名" })).toBeInTheDocument()
    expect(screen.getByText("查看各话题下的提示词及品牌排名情况")).toBeInTheDocument()
    expect(screen.getByText("AI 博客生成器")).toBeInTheDocument()
    expect(screen.getByText("我如何使用 AI 创建完整的博客文章？")).toBeInTheDocument()
    expect(screen.getByText("第 1 页，共 10 页")).toBeInTheDocument()

    render(<SettingsPage />, { wrapper: MemoryRouter })
    expect(screen.getByRole("heading", { name: "Settings" })).toBeInTheDocument()
  })
})
