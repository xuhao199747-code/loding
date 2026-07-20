import { describe, expect, it } from "vitest";
import { createRun, transition } from "../../src/domain/execution.js";
import { demoGraph } from "../../src/data/demo-graph.js";

describe("execution state machine", () => {
  it("blocks a decision until a branch is selected", () => {
    let run = createRun(demoGraph, "rag-route");
    expect(() => transition(run, { type: "ADVANCE" })).toThrow("Branch selection required");
    run = transition(run, { type: "CHOOSE_BRANCH", choice: "parallel" });
    expect(run.activeBranches).toEqual(["vector", "web"]);
  });

  it("waits for both parallel branches before joining", () => {
    let run = createRun(demoGraph, "rag-route");
    run = transition(run, { type: "CHOOSE_BRANCH", choice: "parallel" });
    run = transition(run, { type: "COMPLETE_BRANCH", branch: "vector" });
    expect(run.currentEventId).toBe("rag-retrieval");
    run = transition(run, { type: "COMPLETE_BRANCH", branch: "web" });
    expect(run.currentEventId).toBe("rag-join");
  });

  it("records callback and replan iterations", () => {
    let run = createRun(demoGraph, "observation-event");
    run = transition(run, { type: "REPLAN", reason: "completion score below threshold" });
    expect(run.iteration).toBe(2);
    expect(run.currentNodeId).toBe("planning");
    expect(run.currentEventId).toBe("planning-event");
    expect(run.trace.at(-1).relation).toBe("replan");
  });

  it("routes observation outcomes to finish, retry, or replan", () => {
    const base = createRun(demoGraph, "observation-event");
    expect(transition(base, { type: "CHOOSE_BRANCH", choice: "finish" }).currentEventId).toBe("final-event");
    expect(transition(base, { type: "CHOOSE_BRANCH", choice: "retry" })).toMatchObject({ currentEventId: "tool-event", iteration: 2 });
    expect(transition(base, { type: "CHOOSE_BRANCH", choice: "replan" })).toMatchObject({ currentEventId: "planning-event", iteration: 2 });
  });

  it("restores the complete previous snapshot instead of only moving the cursor", () => {
    let run = createRun(demoGraph, "rag-route");
    run = transition(run, { type: "CHOOSE_BRANCH", choice: "parallel" });
    run = transition(run, { type: "PREVIOUS" });
    expect(run).toMatchObject({ currentEventId: "rag-route", activeBranches: [], completedBranches: [], iteration: 1 });
  });

  it("keeps terminal cancellation immutable", () => {
    let run = createRun(demoGraph);
    run = transition(run, { type: "CANCEL" });
    expect(run.status).toBe("cancelled");
    expect(() => transition(run, { type: "ADVANCE" })).toThrow("Run is terminal");
  });
});
