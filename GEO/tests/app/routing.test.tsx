import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import App from "@/app/App"

describe("App", () => {
  it("renders the AlphaRank shell placeholder", () => {
    render(<App />)
    expect(screen.getByText("AlphaRank")).toBeInTheDocument()
  })
})
