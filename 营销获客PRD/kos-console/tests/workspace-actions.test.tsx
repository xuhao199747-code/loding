import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "@/app/App";

describe("workspace actions", () => {
  it("sends an advisor message and adopts an AI suggestion", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "旅行顾问工作台" }));
    await user.type(screen.getByPlaceholderText("输入本次沟通记录或回复…"), "我来帮你确认日期");
    await user.click(screen.getByRole("button", { name: "发送" }));
    expect(screen.getByText("我来帮你确认日期")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "一键采用话术" }));
    expect(screen.getAllByText(/先确认出行日期/).length).toBeGreaterThan(1);
  });

  it("creates content and completes a scheduler task", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "旅游内容中心" }));
    await user.click(screen.getByRole("button", { name: "新建内容" }));
    await user.type(screen.getByLabelText("内容标题"), "秋季川西亲子路线");
    await user.click(screen.getByRole("button", { name: "保存草稿" }));
    expect(screen.getByText("秋季川西亲子路线")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "跟进调度中心" }));
    await user.click(screen.getByRole("button", { name: "立即联系" }));
    expect(screen.getAllByText(/已联系/).length).toBeGreaterThan(1);
  });
});
