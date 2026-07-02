import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { SentimentAnalysisPage } from "@/features/sentiment-analysis/SentimentAnalysisPage"

describe("sentiment analysis", () => {
  it("renders topic rows from the Figma flow", async () => {
    render(<SentimentAnalysisPage />, { wrapper: MemoryRouter })

    await waitFor(() => expect(screen.getByText("运输延迟")).toBeInTheDocument())
    expect(screen.getByText("响应迅速的客户服务")).toBeInTheDocument()
  })

  it("expands a topic answer evidence row", async () => {
    render(<SentimentAnalysisPage />, { wrapper: MemoryRouter })
    const user = userEvent.setup()

    await user.click(await screen.findByRole("button", { name: /展开 运输延迟/ }))
    expect(screen.getByText("查看完整答案")).toBeInTheDocument()
  })
})
