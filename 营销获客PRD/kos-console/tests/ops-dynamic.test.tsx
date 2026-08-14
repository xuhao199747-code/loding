import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "@/app/App";

describe("KOS operations workspaces", () => {
  it("filters content and edits a queued draft", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "旅游内容中心" }));
    await user.click(screen.getByRole("tab", { name: "待审核" }));
    expect(screen.getByText("川西稻城 6 日攻略")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "编辑川西稻城 6 日攻略" }));
    await user.clear(screen.getByLabelText("内容标题"));
    await user.type(screen.getByLabelText("内容标题"), "川西稻城亲子升级攻略");
    await user.click(screen.getByRole("button", { name: "保存修改" }));
    expect(screen.getByText("川西稻城亲子升级攻略")).toBeInTheDocument();
  });

  it("filters schedule tasks and keeps completion state", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole("button", { name: "跟进调度中心" }));
    await user.click(screen.getByRole("tab", { name: "已完成" }));
    expect(screen.getByText("暂无已完成任务")).toBeInTheDocument();
    await user.click(screen.getByRole("tab", { name: "待处理" }));
    await user.click(screen.getByRole("button", { name: "立即联系" }));
    await user.click(screen.getByRole("tab", { name: "已完成" }));
    expect(screen.getByText("林女士 · 川西稻城")).toBeInTheDocument();
  });
});
