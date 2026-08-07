import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "@/app/App";

describe("KOS feature surfaces", () => {
  it("exposes advisor, content, and scheduler workspaces", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "旅行顾问工作台" }));
    expect(screen.getByRole("heading", { name: "1v1 对话工作台" })).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "旅游内容中心" }));
    expect(screen.getByText("把目的地内容变成可持续的咨询和订单。")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "跟进调度中心" }));
    expect(screen.getByText("让报价、支付、出发提醒和复购跟进按时发生。")).toBeInTheDocument();
  });

  it("opens the today report from the global header", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "今日报告" }));
    expect(screen.getByRole("dialog", { name: "今日报告" })).toBeInTheDocument();
    expect(screen.getByText("经营健康度")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "查看跟进队列" }));
    expect(screen.getByText("让报价、支付、出发提醒和复购跟进按时发生。")).toBeInTheDocument();
  });
});
