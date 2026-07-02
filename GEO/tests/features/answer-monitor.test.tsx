import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { AnswerMonitorPage } from "@/features/answer-monitor/AnswerMonitorPage"

describe("AI answer monitor", () => {
  it("renders monitored prompts and platform labels", async () => {
    render(<AnswerMonitorPage />, { wrapper: MemoryRouter })

    await waitFor(() => expect(screen.getByText("AI 答案监控")).toBeInTheDocument())
    expect(screen.getByText("ChatGPT")).toBeInTheDocument()
    expect(screen.getByText("Perplexity")).toBeInTheDocument()
  })

  it("opens answer detail sheet", async () => {
    render(<AnswerMonitorPage />, { wrapper: MemoryRouter })
    const user = userEvent.setup()

    await user.click(await screen.findByRole("button", { name: /查看答案/ }))
    expect(screen.getByText("完整答案")).toBeInTheDocument()
  })
})
