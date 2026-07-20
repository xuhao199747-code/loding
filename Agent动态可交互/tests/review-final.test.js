import { afterEach, describe, expect, it, vi } from "vitest";
import { createRun, transition } from "../src/domain/execution.js";
import { demoGraph } from "../src/data/demo-graph.js";
import { createViewport } from "../src/domain/viewport.js";
import { renderGraph } from "../src/ui/GraphView.js";
import { createAppView } from "../src/ui/AppView.js";
import { readFileSync } from "node:fs";

const advanceToRag = () => {
  let run = createRun(demoGraph);
  for (let index = 0; index < 4; index += 1) run = transition(run, { type: "ADVANCE" });
  return run;
};

describe("final review regressions", () => {
  afterEach(() => { vi.useRealTimers(); vi.resetModules(); document.body.innerHTML = ""; });

  it("persists selected branches and their projection through join and Previous", () => {
    let run = transition(advanceToRag(), { type: "CHOOSE_BRANCH", choice: "parallel" });
    expect(run.selectedBranches).toEqual(["vector", "web"]);
    expect(run.completedBranches).toEqual([]);

    run = transition(run, { type: "COMPLETE_BRANCH", branch: "vector" });
    expect(run.selectedBranches).toEqual(["vector", "web"]);
    expect(run.completedBranches).toEqual(["vector"]);

    run = transition(run, { type: "COMPLETE_BRANCH", branch: "web" });
    expect(run.currentEventId).toBe("rag-join");
    expect(run.selectedBranches).toEqual(["vector", "web"]);
    expect(run.completedBranches).toEqual(["vector", "web"]);

    run = transition(run, { type: "PREVIOUS" });
    expect(run.selectedBranches).toEqual(["vector", "web"]);
    expect(run.completedBranches).toEqual(["vector"]);
  });

  it("records immutable event snapshots and intentionally reruns from a historical snapshot", () => {
    let run = createRun(demoGraph);
    run = transition(run, { type: "ADVANCE" });
    const initialSnapshot = run.eventSnapshots.find((snapshot) => snapshot.nodeId === "user-task");

    expect(initialSnapshot).toMatchObject({ eventId: "input-event", nodeId: "user-task", iteration: 1 });
    expect(Object.isFrozen(initialSnapshot)).toBe(true);

    run = transition(run, { type: "RERUN_SNAPSHOT", snapshotId: initialSnapshot.id, reason: "review replay" });
    expect(run.currentEventId).toBe("input-event");
    expect(run.eventSnapshots).toHaveLength(1);
    expect(run.trace).toHaveLength(0);
  });

  it("records recovery actions and makes each simulated issue recoverable", () => {
    const expected = {
      "no-results": ["retry", "replan"],
      "tool-timeout": ["retry"],
      "permission-denied": ["request", "confirm", "cancel"],
      "evaluation-failed": ["retry", "replan", "finish"],
    };

    for (const scenario of demoGraph.scenarios.filter((item) => item.id !== "normal")) {
      expect(scenario.recovery.map((item) => item.action)).toEqual(expected[scenario.id]);
    }

    const recovered = transition({ ...createRun(demoGraph, "tool-event"), simulatedIssue: demoGraph.scenarios[2] }, { type: "RECOVER", action: "retry", reason: "timeout retry" });
    expect(recovered.simulatedIssue).toBeNull();
    expect(recovered.iteration).toBe(2);
    expect(recovered.trace.at(-1)).toMatchObject({ relation: "retry", recovery: "retry", reason: "timeout retry" });
  });

  it("projects running, success, and skipped branches without treating choice as completion", () => {
    const run = transition(advanceToRag(), { type: "CHOOSE_BRANCH", choice: "vector" });
    const host = document.createElement("div");
    renderGraph(host, { graph: demoGraph, run, viewport: createViewport("rag-route", "rag"), onNodeSelect: vi.fn() });

    expect(host.querySelector('[data-node-id="vector-search"]').classList.contains("is-running")).toBe(true);
    expect(host.querySelector('[data-node-id="web-search"]').classList.contains("is-skipped")).toBe(true);
    expect(host.querySelector('[data-node-id="vector-search"]').classList.contains("is-complete")).toBe(false);
  });

  it("renders directional relation semantics and accessible graph navigation", () => {
    const run = transition(createRun(demoGraph, "rag-callback"), { type: "ADVANCE" });
    const host = document.createElement("div");
    renderGraph(host, { graph: demoGraph, run, viewport: createViewport("llm", "core"), onNodeSelect: vi.fn() });

    expect(host.querySelector("svg").getAttribute("role")).toBe("group");
    expect(host.querySelector('[data-edge-id="e12"]').getAttribute("marker-end")).toContain("arrow");
    expect(host.querySelector('[data-edge-id="e12"]').getAttribute("aria-label")).toContain("回传");
    expect(host.querySelector('[data-node-id="rag-context"]').classList.contains("is-relation-endpoint")).toBe(true);
    expect(host.querySelector('[data-node-id="llm"]').classList.contains("is-relation-endpoint")).toBe(true);
  });

  it("renders historical inspector data and explicit rerun action without moving live execution", () => {
    const onRerunSnapshot = vi.fn();
    const run = {
      ...createRun(demoGraph, "tool-event"),
      eventSnapshots: [Object.freeze({ id: "history-action", eventId: "tool-event", nodeId: "action", status: "success", input: "参数", output: "结果", summary: "历史结果", iteration: 2, selectedBranches: [], completedBranches: [], issue: null, trace: [] })],
    };
    const view = createAppView(document.body, { onRerunSnapshot, onNodeSelect: vi.fn(), onOverview: vi.fn(), onModuleFocus: vi.fn(), onToggleFollow: vi.fn(), onReturnLive: vi.fn(), onCloseInspector: vi.fn() });
    view.render({ graph: demoGraph, run, viewport: { ...createViewport("tool-select", "tools"), viewing: { level: "node", moduleId: "tools", nodeId: "action" }, isViewingLive: false } });

    expect(document.querySelector(".inspector").textContent).toContain("历史结果");
    document.querySelector('[data-action="rerun-snapshot"]').click();
    expect(onRerunSnapshot).toHaveBeenCalledWith("history-action");
    expect(run.currentEventId).toBe("tool-event");
  });

  it("keeps recovery controls available, collapses the minimap, and uses a full-width mobile inspector", () => {
    const blocked = { ...createRun(demoGraph, "tool-event"), simulatedIssue: demoGraph.scenarios[3], status: "blocked" };
    const view = createAppView(document.body, { onRecovery: vi.fn(), onMiniMapToggle: vi.fn(), onNodeSelect: vi.fn(), onOverview: vi.fn(), onModuleFocus: vi.fn(), onToggleFollow: vi.fn(), onReturnLive: vi.fn(), onCloseInspector: vi.fn() });
    view.render({ graph: demoGraph, run: blocked, viewport: createViewport("action", "tools"), scenarioId: "permission-denied", minimapCollapsed: true });

    expect(document.querySelector('[data-action="primary"]').disabled).toBe(true);
    expect(document.querySelectorAll('[data-action="recovery"]')).toHaveLength(3);
    expect(document.querySelector('[data-action="minimap-toggle"]')).toBeTruthy();
    expect(document.querySelector(".minimap").classList.contains("is-collapsed")).toBe(true);

    const css = readFileSync("src/styles.css", "utf8");
    expect(css).toMatch(/@media \(max-width: 620px\)[\s\S]*\.inspector \{[\s\S]*left: 0;[\s\S]*right: 0;/);
    expect(css).not.toContain("right: 184px");
  });

  it("uses Escape as hierarchical navigation before the focused-control guard", async () => {
    vi.useFakeTimers();
    document.body.innerHTML = '<main id="app"></main>';
    await import("../src/main.js?escape-hierarchy-review");
    await vi.advanceTimersByTimeAsync(4000);
    document.querySelector('[data-node-id="llm"]').dispatchEvent(new MouseEvent("click", { bubbles: true }));
    document.querySelector('[data-action="scenario"]').dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));

    expect(document.querySelector("[data-testid=breadcrumb]").textContent).toBe("Agent 系统 > Agent 核心");
  });
});
