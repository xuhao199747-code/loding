import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { MetricCard } from "@/components/common/MetricCard"
import { StatusBadge } from "@/components/common/StatusBadge"

describe("common components", () => {
  it("renders a metric card", () => {
    render(<MetricCard title="GEO Composite" value="72/100" helper="+8.2% vs last week" />)

    expect(screen.getByText("GEO Composite")).toBeInTheDocument()
    expect(screen.getByText("72/100")).toBeInTheDocument()
  })

  it("renders a Chinese severity badge", () => {
    render(<StatusBadge tone="danger">High Priority</StatusBadge>)

    expect(screen.getByText("High Priority")).toBeInTheDocument()
  })
})
