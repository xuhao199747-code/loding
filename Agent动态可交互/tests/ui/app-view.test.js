import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createAppView } from "../../src/ui/AppView.js";
import { createRun, transition } from "../../src/domain/execution.js";
import { createViewport } from "../../src/domain/viewport.js";
import { demoGraph } from "../../src/data/demo-graph.js";

const handlers = () => ({
  onNodeSelect: vi.fn(),
  onOverview: vi.fn(),
  onModuleFocus: vi.fn(),
  onToggleFollow: vi.fn(),
  onReturnLive: vi.fn(),
  onCloseInspector: vi.fn(),
});

describe("AppView", () => {
  beforeEach(() => { document.body.innerHTML = '<main id="app"></main>'; });
  afterEach(() => { vi.useRealTimers(); vi.resetModules(); });

  it("renders a fixed flow stage and step rail without spatial navigation", () => {
    const viewHandlers = handlers();
    const view = createAppView(document.querySelector("#app"), viewHandlers);
    view.render({
      graph: demoGraph,
      run: createRun(demoGraph, "rag-route"),
      viewport: { ...createViewport("rag-route", "rag"), viewing: { level: "module", moduleId: "rag", nodeId: null } },
    });

    expect(document.querySelector(".minimap")).toBeNull();
    expect(document.querySelector(".return-live")).toBeNull();
    expect(document.querySelector(".inspector")).toBeNull();
    expect(document.querySelector(".flow-stage")).toBeTruthy();
    expect(document.querySelector(".step-rail")).toBeTruthy();
    expect(document.querySelector("[data-testid=breadcrumb]").textContent).toContain("RAG 检索增强");
  });

  it("keeps only step navigation and contextual actions in the footer", () => {
    const view = createAppView(document.querySelector("#app"), handlers());
    view.render({ graph: demoGraph, run: createRun(demoGraph, "rag-route"), viewport: createViewport("rag-route", "rag") });

    expect(document.querySelector('[data-action="play"]')).toBeNull();
    expect(document.querySelector('[data-action="speed"]')).toBeNull();
    expect([...document.querySelectorAll(".controls-host button[data-action]")].map((button) => button.dataset.action))
      .toEqual(["previous", "primary", "restart"]);
  });

  it("replaces next with branch choices at a decision", () => {
    const onBranchChoice = vi.fn();
    const view = createAppView(document.querySelector("#app"), {
      onNodeSelect: vi.fn(),
      onOverview: vi.fn(),
      onModuleFocus: vi.fn(),
      onToggleFollow: vi.fn(),
      onReturnLive: vi.fn(),
      onBranchChoice,
      onPrimaryAction: vi.fn(),
      onPrevious: vi.fn(),
      onPlayPause: vi.fn(),
      onRestart: vi.fn(),
      onSpeedChange: vi.fn(),
    });
    view.render({ graph: demoGraph, run: createRun(demoGraph, "rag-route"), viewport: createViewport("rag-route", "rag") });

    expect(document.querySelectorAll("[data-branch-choice]")).toHaveLength(3);
    expect(document.querySelector('[data-action="primary"]').disabled).toBe(true);
  });

  it("shows recovery actions only when the current scenario is blocked", () => {
    const run = {
      ...createRun(demoGraph, "rag-join"),
      simulatedIssue: demoGraph.scenarios.find((scenario) => scenario.id === "no-results").label,
    };
    const view = createAppView(document.querySelector("#app"), handlers());
    view.render({ graph: demoGraph, run, viewport: createViewport("rag-merge", "rag"), scenarioId: "no-results" });

    expect(document.querySelector('[data-action="primary"]').disabled).toBe(true);
    expect([...document.querySelectorAll('[data-action="recovery"]')].map((button) => button.dataset.recovery))
      .toEqual(["retry", "replan"]);
  });

  it("shows branch completion counts for parallel work", () => {
    const run = { ...createRun(demoGraph, "rag-retrieval"), selectedBranches: ["vector", "web"], activeBranches: ["vector", "web"], completedBranches: ["vector"] };
    const view = createAppView(document.querySelector("#app"), handlers());
    view.render({ graph: demoGraph, run, viewport: createViewport("rag-route", "rag") });

    expect(document.querySelector("[data-testid=branch-progress]").textContent).toContain("1 / 2");
  });

  it("preserves branch progress after a parallel join completes", () => {
    let run = transition(createRun(demoGraph, "rag-route"), { type: "CHOOSE_BRANCH", choice: "parallel" });
    run = transition(run, { type: "COMPLETE_BRANCH", branch: "vector" });
    run = transition(run, { type: "COMPLETE_BRANCH", branch: "web" });
    const view = createAppView(document.querySelector("#app"), handlers());
    view.render({ graph: demoGraph, run, viewport: createViewport("rag-merge", "rag") });

    expect(document.querySelector("[data-testid=branch-progress]").textContent).toContain("2 / 2");
  });

  it("shows the current iteration and event number in playback controls", () => {
    const view = createAppView(document.querySelector("#app"), handlers());
    view.render({ graph: demoGraph, run: createRun(demoGraph, "rag-route"), viewport: createViewport("rag-route", "rag") });

    expect(document.querySelector("[data-testid=run-progress]").textContent).toContain("轮次 1");
    expect(document.querySelector("[data-testid=run-progress]").textContent).toContain(`事件 5 / ${demoGraph.events.length}`);
  });

  it("offers bilingual failure simulations", () => {
    const onScenarioChange = vi.fn();
    const view = createAppView(document.querySelector("#app"), { onScenarioChange });
    view.render({ graph: demoGraph, run: createRun(demoGraph), viewport: createViewport(), scenarioId: "normal" });

    const select = document.querySelector('[data-action="scenario"]');
    expect(select.options).toHaveLength(5);
    select.value = "tool-timeout";
    select.dispatchEvent(new Event("change"));
    expect(onScenarioChange).toHaveBeenCalledWith("tool-timeout");
  });

  it("resets the run when changing scenarios", async () => {
    vi.useFakeTimers();
    await import("../../src/main.js?scenario-reset-test");

    const select = document.querySelector('[data-action="scenario"]');
    select.value = "permission-denied";
    select.dispatchEvent(new Event("change"));

    expect(document.querySelector('[data-node-id="user-task"]').classList.contains("is-live")).toBe(true);
  });

  it("pauses the no-results simulation at the RAG join without changing the graph", async () => {
    await import("../../src/main.js?no-results-simulation-test");
    const graphSnapshot = structuredClone(demoGraph);
    const select = document.querySelector('[data-action="scenario"]');
    select.value = "no-results";
    select.dispatchEvent(new Event("change"));

    for (let index = 0; index < 4; index += 1) document.querySelector('[data-action="primary"]').click();
    document.querySelector('[data-branch-choice="vector"]').click();
    document.querySelector('[data-action="primary"]').click();

    const live = document.querySelector('[data-node-id="rag-merge"]');
    expect(live.classList.contains("is-live")).toBe(true);
    expect(live.classList.contains("is-partial")).toBe(true);
    expect(demoGraph).toEqual(graphSnapshot);
  });

  it("allows Previous to advance again after a simulated issue", async () => {
    await import("../../src/main.js?previous-after-simulation-test");
    const select = document.querySelector('[data-action="scenario"]');
    select.value = "no-results";
    select.dispatchEvent(new Event("change"));

    for (let index = 0; index < 4; index += 1) document.querySelector('[data-action="primary"]').click();
    document.querySelector('[data-branch-choice="vector"]').click();
    document.querySelector('[data-action="primary"]').click();
    document.querySelector('[data-action="previous"]').click();
    document.querySelector('[data-action="primary"]').click();

    expect(document.querySelector('[data-node-id="rag-merge"]').classList.contains("is-partial")).toBe(true);
  });

});
