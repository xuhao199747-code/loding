import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { AppRoutes } from "@/app/router"

describe("AppRoutes", () => {
  it("renders the dashboard route inside the workbench shell", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getAllByText("工作台")[0]).toBeInTheDocument()
    expect(screen.getByText("GEO 诊断")).toBeInTheDocument()
  })

  it("renders the answer monitor route", () => {
    render(
      <MemoryRouter initialEntries={["/answer-monitor"]}>
        <AppRoutes />
      </MemoryRouter>,
    )

    expect(screen.getByRole("heading", { name: "AI 答案监控" })).toBeInTheDocument()
  })
})
