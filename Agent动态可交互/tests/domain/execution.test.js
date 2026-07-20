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

  it("preserves selected branches on the join trace", () => {
    let run = createRun(demoGraph, "rag-route");
    run = transition(run, { type: "CHOOSE_BRANCH", choice: "web" });
    run = transition(run, { type: "COMPLETE_BRANCH", branch: "web" });
    expect(run.trace.at(-1)).toMatchObject({ from: "rag-retrieval", to: "rag-join", relation: "join", branches: ["web"] });
  });

  it("blocks advance while parallel branches are incomplete", () => {
    let run = createRun(demoGraph, "rag-route");
    run = transition(run, { type: "CHOOSE_BRANCH", choice: "parallel" });
    expect(() => transition(run, { type: "ADVANCE" })).toThrow("Parallel branches must complete");
    expect(run).toMatchObject({ currentEventId: "rag-retrieval", status: "paused" });
  });

  it("records replan iterations", () => {
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
    const retry = transition(base, { type: "CHOOSE_BRANCH", choice: "retry" });
    const replan = transition(base, { type: "CHOOSE_BRANCH", choice: "replan" });
    expect(retry).toMatchObject({ currentEventId: "tool-event", iteration: 2 });
    expect(retry.trace.at(-1)).toMatchObject({ relation: "retry", iteration: 2 });
    expect(replan).toMatchObject({ currentEventId: "planning-event", iteration: 2 });
    expect(replan.trace.at(-1)).toMatchObject({ relation: "replan", iteration: 2 });
  });

  it("advances sequence events", () => {
    const run = transition(createRun(demoGraph, "input-event"), { type: "ADVANCE" });
    expect(run).toMatchObject({ currentEventId: "orchestrator-event", currentNodeId: "orchestrator" });
    expect(run.trace.at(-1)).toMatchObject({ relation: "sequence", iteration: 1 });
  });

  it("advances callback events and records their trace", () => {
    const run = transition(createRun(demoGraph, "rag-callback"), { type: "ADVANCE" });
    expect(run).toMatchObject({ currentEventId: "llm-return-event", currentNodeId: "llm" });
    expect(run.trace.at(-1)).toMatchObject({ from: "rag-callback", to: "llm-return-event", relation: "callback", iteration: 1 });
  });

  it("retries the current event directly", () => {
    const run = transition(createRun(demoGraph, "tool-event"), { type: "RETRY" });
    expect(run).toMatchObject({ currentEventId: "tool-event", iteration: 2 });
    expect(run.trace.at(-1)).toMatchObject({ from: "tool-event", to: "tool-event", relation: "retry", iteration: 2 });
  });

  it("restores the complete previous snapshot instead of only moving the cursor", () => {
    let run = createRun(demoGraph, "rag-route");
    run = transition(run, { type: "CHOOSE_BRANCH", choice: "parallel" });
    run = transition(run, { type: "PREVIOUS" });
    expect(run).toMatchObject({ currentEventId: "rag-route", activeBranches: [], completedBranches: [], iteration: 1 });
  });

  it("clears a simulated issue when restoring the previous snapshot", () => {
    let run = transition(createRun(demoGraph, "input-event"), { type: "ADVANCE" });
    run = { ...run, simulatedIssue: demoGraph.scenarios[1].label };
    run = transition(run, { type: "PREVIOUS" });

    expect(run.simulatedIssue).toBeNull();
  });

  it("keeps terminal cancellation immutable", () => {
    let run = createRun(demoGraph);
    run = transition(run, { type: "CANCEL" });
    expect(run.status).toBe("cancelled");
    expect(() => transition(run, { type: "ADVANCE" })).toThrow("Run is terminal");
  });
});
