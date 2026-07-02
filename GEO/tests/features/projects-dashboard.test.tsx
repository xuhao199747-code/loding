import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { DashboardPage } from "@/features/dashboard/DashboardPage"
import { ProjectsPage } from "@/features/projects/ProjectsPage"

describe("dashboard and projects", () => {
  it("renders dashboard KPI labels", async () => {
    render(<DashboardPage />, { wrapper: MemoryRouter })

    await waitFor(() => expect(screen.getByText("GEO 综合")).toBeInTheDocument())
    expect(screen.getByText("AI 可引用性")).toBeInTheDocument()
    expect(screen.getByText("内容机会")).toBeInTheDocument()
  })

  it("renders the project table", async () => {
    render(<ProjectsPage />, { wrapper: MemoryRouter })

    await waitFor(() => expect(screen.getByText("Nihao Jewelry")).toBeInTheDocument())
    expect(screen.getByText("www.nihaojewelry.com")).toBeInTheDocument()
  })
})
