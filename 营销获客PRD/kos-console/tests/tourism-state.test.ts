import { describe, expect, it } from "vitest";
import { appendMessage, advanceVisitor, filterVisitorsByChannel } from "@/lib/tourism-state";
import { visitors } from "@/data/tourism";

describe("tourism interaction state", () => {
  it("filters visitors by the shared channel values", () => {
    expect(filterVisitorsByChannel(visitors, "all")).toHaveLength(visitors.length);
    expect(filterVisitorsByChannel(visitors, "xhs").every((visitor) => visitor.channel === "xhs")).toBe(true);
  });

  it("advances a visitor and creates a timeline event", () => {
    const result = advanceVisitor(visitors[0], "qualify");
    expect(result.visitor.status).toContain("意向");
    expect(result.event.label).toBe("确认意向");
  });

  it("appends an advisor message for a visitor", () => {
    const state = { visitors, messages: [], timeline: {} };
    const next = appendMessage(state, visitors[0].id, "我来帮你整理两套路线");
    expect(next.messages[0]).toMatchObject({ visitorId: visitors[0].id, sender: "advisor", text: "我来帮你整理两套路线" });
  });
});
