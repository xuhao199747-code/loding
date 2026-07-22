import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { SentimentAnalysisPage } from "@/features/sentiment-analysis/SentimentAnalysisPage"

describe("sentiment analysis", () => {
  it("renders the sentiment analysis dashboard from the Figma flow", () => {
    render(<SentimentAnalysisPage />, { wrapper: MemoryRouter })

    expect(screen.getByRole("heading", { name: "情感分析" })).toBeInTheDocument()
    expect(screen.getByText("AI响应对www.nihaojewelry.com的积极引用程度")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "积极情绪" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "情感模式" })).toBeInTheDocument()
    expect(screen.getByText("28.6% 消极")).toBeInTheDocument()
    expect(screen.getByText("61.3% 积极")).toBeInTheDocument()
  })

  it("shows sentiment topics and the expanded answer content", () => {
    render(<SentimentAnalysisPage />, { wrapper: MemoryRouter })

    expect(screen.getAllByText("运输延迟").length).toBeGreaterThan(0)
    expect(screen.getByText("响应迅速的客户服务")).toBeInTheDocument()
    expect(screen.getByText("无最低订单数量")).toBeInTheDocument()
    expect(screen.getByRole("button", { name: /查看完整答案/ })).toBeInTheDocument()
    expect(screen.getByText(/Nihao Jewelry 是一个受欢迎的在线批发平台/)).toBeInTheDocument()
  })
})
