import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { MetricCard } from "@/components/common/MetricCard"
import { StatusBadge } from "@/components/common/StatusBadge"

describe("common components", () => {
  it("renders a metric card", () => {
    render(<MetricCard title="GEO 综合" value="72/100" helper="较上周 +8.2%" />)

    expect(screen.getByText("GEO 综合")).toBeInTheDocument()
    expect(screen.getByText("72/100")).toBeInTheDocument()
  })

  it("renders a Chinese severity badge", () => {
    render(<StatusBadge tone="danger">高优先级</StatusBadge>)

    expect(screen.getByText("高优先级")).toBeInTheDocument()
  })
})
