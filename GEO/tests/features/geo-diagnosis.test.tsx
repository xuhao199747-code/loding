import { render, screen, waitFor } from "@testing-library/react"
import { MemoryRouter } from "react-router-dom"
import { describe, expect, it } from "vitest"
import { GeoDiagnosisDetailPage } from "@/features/geo-diagnosis/GeoDiagnosisDetailPage"
import { GeoDiagnosisPage } from "@/features/geo-diagnosis/GeoDiagnosisPage"

describe("GEO diagnosis", () => {
  it("renders diagnosis list metrics", async () => {
    render(<GeoDiagnosisPage />, { wrapper: MemoryRouter })

    await waitFor(() => expect(screen.getByText("网页诊断")).toBeInTheDocument())
    expect(screen.getByText("GEO 综合")).toBeInTheDocument()
    expect(screen.getByText("AI 可引用性")).toBeInTheDocument()
    expect(screen.getByText("品牌权威性")).toBeInTheDocument()
    expect(screen.getByText("E-E-A-T 信号")).toBeInTheDocument()
  })

  it("renders diagnosis detail recommendations", async () => {
    render(<GeoDiagnosisDetailPage />, { wrapper: MemoryRouter })

    await waitFor(() => expect(screen.getByText("诊断详情")).toBeInTheDocument())
    expect(screen.getByText("高优先级")).toBeInTheDocument()
  })
})
