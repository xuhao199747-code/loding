import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/app/App";

describe("KOS advisor parity", () => {
  it("exposes break-through channel tabs, trail and AI insight panels", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "旅行顾问工作台" }));

    expect(screen.getByText("破冰")).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "全部" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "小红书" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "抖音" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "企业微信" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "查看游客轨迹" }));
    expect(screen.getByRole("dialog", { name: "游客轨迹" })).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "关闭" }));

    await user.click(screen.getByRole("button", { name: "AI 洞察" }));
    expect(screen.getByRole("dialog", { name: "AI 洞察" })).toBeInTheDocument();
  });
});
