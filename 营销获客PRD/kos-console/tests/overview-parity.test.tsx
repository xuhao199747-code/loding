import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/app/App";

describe("KOS overview parity", () => {
  it("supports period switching, metric focus and expandable opportunities", async () => {
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("tab", { name: "今日" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "24h" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "7日" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "30日" })).toBeInTheDocument();

    await user.click(screen.getByRole("tab", { name: "7日" }));
    expect(screen.getAllByText(/近 7 日累计/).length).toBeGreaterThan(0);

    await user.click(screen.getByRole("button", { name: "今日成交" }));
    expect(screen.getByText("成交趋势已聚焦")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "展开今日机会" }));
    expect(screen.getByText("待回复 3 条 · 高意向 8 条")).toBeInTheDocument();
  });
});
