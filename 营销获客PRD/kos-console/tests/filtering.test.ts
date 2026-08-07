import { describe, expect, it } from "vitest";
import { filterVisitors } from "@/lib/filtering";
import type { Visitor } from "@/data/tourism";

const visitors: Visitor[] = [
  { id: "x1", name: "小红书游客", channel: "xhs", stage: "breakthrough", status: "AI跟进" },
  { id: "d1", name: "抖音游客", channel: "dy", stage: "breakthrough", status: "待回复" },
  { id: "w1", name: "企微游客", channel: "wx", stage: "intent", status: "高意向" },
];

describe("filterVisitors", () => {
  it("returns all visitors for the all channel", () => {
    expect(filterVisitors(visitors, "all")).toHaveLength(3);
  });

  it("returns only visitors from the selected channel", () => {
    expect(filterVisitors(visitors, "xhs").map((visitor) => visitor.id)).toEqual(["x1"]);
  });

  it("returns an empty list when a channel has no visitors", () => {
    expect(filterVisitors(visitors, "dy").filter((visitor) => visitor.stage === "deal")).toEqual([]);
  });
});
