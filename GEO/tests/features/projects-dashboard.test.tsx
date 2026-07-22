import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { DashboardPage } from "@/features/dashboard/DashboardPage"
import { ProjectsPage } from "@/features/projects/ProjectsPage"

describe("dashboard and projects", () => {
  it("renders the strategy agent dashboard", async () => {
    render(<DashboardPage />, { wrapper: MemoryRouter })

    await waitFor(() => expect(screen.getByText("今天聚焦哪个品牌？")).toBeInTheDocument())
    expect(screen.getByText("营销Agent")).toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "营销Agent" })).not.toBeInTheDocument()
    expect(screen.getByText("为品牌生成GEO全量策略方案")).toBeInTheDocument()
  })

  it("renders the project table", async () => {
    render(<ProjectsPage />, { wrapper: MemoryRouter })

    await waitFor(() => expect(screen.getByText("Nihao Jewelry")).toBeInTheDocument())
    expect(screen.getByText("www.nihaojewelry.com")).toBeInTheDocument()
  })
})
