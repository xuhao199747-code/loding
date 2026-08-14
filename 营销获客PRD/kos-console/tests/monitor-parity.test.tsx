import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "@/app/App";

describe("monitor parity surfaces", () => {
  it("supports global intent/risk/overdue filters and the visitor pool report", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /游客监控/ }));
    expect(screen.getByRole("tab", { name: "高意向" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "高风险" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "超时" })).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "高意向" }));
    expect(screen.getByText("奶爸不躺平")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "游客池体检报告" }));
    expect(screen.getByRole("dialog", { name: /今日游客质量/ })).toBeInTheDocument();
    expect(screen.getByText("游客画像矩阵")).toBeInTheDocument();
    expect(screen.getByText("经营建议")).toBeInTheDocument();
  });
});
