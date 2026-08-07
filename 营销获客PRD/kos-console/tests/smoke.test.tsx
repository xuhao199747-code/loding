import { render, screen } from "@testing-library/react";
import { expect, it } from "vitest";
import App from "@/app/App";

it("renders the tourism console shell and today's report action", () => {
  render(<App />);
  expect(screen.getByText("今日旅游经营驾驶舱")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /今日报告/ })).toBeInTheDocument();
  expect(screen.queryByText("查看详情")).not.toBeInTheDocument();
});
