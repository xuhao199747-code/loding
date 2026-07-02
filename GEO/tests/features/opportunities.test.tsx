import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { OpportunitiesPage } from "@/features/opportunities/OpportunitiesPage"

describe("opportunities", () => {
  it("renders opportunity backlog", async () => {
    render(<OpportunitiesPage />, { wrapper: MemoryRouter })

    await waitFor(() => expect(screen.getByText("内容机会")).toBeInTheDocument())
    expect(screen.getByText("FAQ 缺口")).toBeInTheDocument()
  })

  it("opens opportunity detail", async () => {
    render(<OpportunitiesPage />, { wrapper: MemoryRouter })
    const user = userEvent.setup()

    await user.click(await screen.findByRole("button", { name: /查看机会/ }))
    expect(screen.getByText("建议动作")).toBeInTheDocument()
  })
})
