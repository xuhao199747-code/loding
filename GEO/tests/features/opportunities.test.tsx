import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { OpportunitiesPage } from "@/features/opportunities/OpportunitiesPage"

describe("opportunities", () => {
  it("renders opportunity backlog", async () => {
    render(<OpportunitiesPage />, { wrapper: MemoryRouter })

    await waitFor(() => expect(screen.getByText("Content Opportunities")).toBeInTheDocument())
    expect(screen.getByText("FAQ Gap")).toBeInTheDocument()
  })

  it("opens opportunity detail", async () => {
    render(<OpportunitiesPage />, { wrapper: MemoryRouter })
    const user = userEvent.setup()

    await user.click(await screen.findByRole("button", { name: /View Opportunity/ }))
    expect(screen.getByText("Recommended Action")).toBeInTheDocument()
  })
})
