import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { AnswerMonitorPage } from "@/features/answer-monitor/AnswerMonitorPage"

describe("AI citation sources", () => {
  it("renders the citation source dashboard sections", () => {
    render(<AnswerMonitorPage />, { wrapper: MemoryRouter })

    expect(screen.getByRole("heading", { name: "AI 引用来源" })).toBeInTheDocument()
    expect(screen.getByText("发现哪些网站在AI生成的回复中被引用得最频繁")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "引用平台" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "引用排名" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "相关引用页面" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "竞争对手引用基准" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "特别关注" })).toBeInTheDocument()
  })

  it("shows platform and source rows from the Figma page", () => {
    render(<AnswerMonitorPage />, { wrapper: MemoryRouter })

    expect(screen.getByText("Gemini")).toBeInTheDocument()
    expect(screen.getByText("ChatGPT")).toBeInTheDocument()
    expect(screen.getByText("Alibaba.com（你）")).toBeInTheDocument()
    expect(screen.getAllByText("https://startups.co.uk/websites/ecommerce/best-ecommerce-platforms-uk/").length).toBeGreaterThan(0)
  })

  it("opens the citation detail dialog from a source row", async () => {
    const user = userEvent.setup()
    render(<AnswerMonitorPage />, { wrapper: MemoryRouter })

    await user.click(screen.getByRole("button", { name: /SEO_for_AI - Reddit/ }))

    expect(screen.getByText("Citations")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "SEO_for_AI - Reddit" })).toBeInTheDocument()
    expect(screen.getByText("引用份额")).toBeInTheDocument()
    expect(screen.getByText("AI问题")).toBeInTheDocument()
  })

  it("uses the platform AI citation statistics Figma page for the platform view", async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={["/answer-monitor?view=platform"]}>
        <AnswerMonitorPage />
      </MemoryRouter>,
    )

    expect(screen.getByRole("heading", { name: "分平台AI引用统计" })).toBeInTheDocument()
    expect(screen.getByText("AI回应对www.nihaojewelry.com的积极参考程度")).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "竞争对手分析（按平台划分）" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "各平台的可见性评分" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "可见性得分" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "顶级引用域" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "按平台分享引用" })).toBeInTheDocument()
    expect(screen.getByRole("heading", { name: "各平台的正面情绪" })).toBeInTheDocument()
    expect(screen.getAllByRole("heading", { name: "引用分享" })).toHaveLength(2)
    expect(screen.getAllByRole("heading", { name: "引用分享排名" })).toHaveLength(2)
    expect(screen.getByText("Google AI Mode")).toBeInTheDocument()
    expect(screen.getByText("Microsoft Copilot")).toBeInTheDocument()
    expect(screen.queryByText("发现哪些网站在AI生成的回复中被引用得最频繁")).not.toBeInTheDocument()

    expect(screen.queryByRole("button", { name: "重置" })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "保存" })).not.toBeInTheDocument()
    expect(screen.queryByRole("button", { name: "已保存" })).not.toBeInTheDocument()

    await user.hover(screen.getByRole("button", { name: "Alibaba.com 在 Gemini 的引用占比 28%" }))
    expect((await screen.findAllByText("Alibaba.com / Gemini: 28%")).length).toBeGreaterThan(0)
  })
})
