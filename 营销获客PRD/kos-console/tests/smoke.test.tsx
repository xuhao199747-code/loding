import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import userEvent from "@testing-library/user-event";
import App from "@/app/App";

it("renders the tourism console shell and today's report action", () => {
  render(<App />);
  expect(screen.getByText("今日旅游经营驾驶舱")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /今日报告/ })).toBeInTheDocument();
  expect(screen.queryByText("查看详情")).not.toBeInTheDocument();
});

it("shows shared action feedback after a visitor workflow action", async () => {
  const user = userEvent.setup();
  render(<App />);
  await user.click(screen.getByRole("button", { name: /游客监控/ }));
  await user.click(screen.getByRole("button", { name: /奶茶不加糖/ }));
  await user.click(screen.getByRole("button", { name: "留资" }));
  expect(screen.getByText(/奶茶不加糖：留资成功/)).toBeInTheDocument();
});
