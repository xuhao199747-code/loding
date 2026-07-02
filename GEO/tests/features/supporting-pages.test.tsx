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
    expect(screen.getByRole("heading", { name: "竞争分析" })).toBeInTheDocument()
  })

  it("renders content studio with AI assistant", () => {
    render(<ContentStudioPage />, { wrapper: MemoryRouter })
    expect(screen.getByRole("heading", { name: "内容编辑器" })).toBeInTheDocument()
    expect(screen.getByText("AI 内容助手")).toBeInTheDocument()
  })

  it("renders tasks, reports, and settings", () => {
    render(<TasksPage />, { wrapper: MemoryRouter })
    expect(screen.getByRole("heading", { name: "任务计划" })).toBeInTheDocument()

    render(<ReportsPage />, { wrapper: MemoryRouter })
    expect(screen.getByRole("heading", { name: "报告中心" })).toBeInTheDocument()

    render(<SettingsPage />, { wrapper: MemoryRouter })
    expect(screen.getByRole("heading", { name: "设置" })).toBeInTheDocument()
  })
})
