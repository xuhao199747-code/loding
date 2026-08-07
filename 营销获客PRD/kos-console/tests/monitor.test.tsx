import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "@/app/App";

describe("KOS monitor", () => {
  it("opens the monitor with five tourism workflow stages", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /游客监控/ }));
    expect(screen.getByText("破冰")).toBeInTheDocument();
    expect(screen.getByText("意向热聊")).toBeInTheDocument();
    expect(screen.getByText("行程方案")).toBeInTheDocument();
    expect(screen.getByText("预订促成")).toBeInTheDocument();
    expect(screen.getByText("成交跟进")).toBeInTheDocument();
    expect(screen.getAllByRole("tab", { name: "全部" })).toHaveLength(2);
  });

  it("filters a workflow column by channel and opens a visitor dialog", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /游客监控/ }));
    await user.click(screen.getAllByRole("tab", { name: "抖音" })[0]);
    expect(screen.getByText("椰椰茶仙女")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /椰椰茶仙女/ }));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("推进下一阶段")).toBeInTheDocument();
  });

  it("records visitor actions in the detail timeline", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: /游客监控/ }));
    await user.click(screen.getByRole("button", { name: /奶茶不加糖/ }));
    await user.click(screen.getByRole("button", { name: "加企微" }));
    expect(screen.getAllByText(/加企微/).length).toBeGreaterThan(1);
    expect(screen.getByText(/奶茶不加糖：加企微成功/)).toBeInTheDocument();
  });
});
