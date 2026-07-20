import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { readFileSync } from "node:fs";
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

  it("renders a Chinese-primary breadcrumb and spatial right-top minimap", () => {
    const viewHandlers = handlers();
    const view = createAppView(document.querySelector("#app"), viewHandlers);
    view.render({
      graph: demoGraph,
      run: createRun(demoGraph, "rag-route"),
      viewport: { ...createViewport("rag-route", "rag"), viewing: { level: "module", moduleId: "rag", nodeId: null } },
    });

    expect(document.querySelector("[data-testid=minimap]")).toBeTruthy();
    expect(document.querySelector(".minimap").closest(".canvas-shell")).toBeTruthy();
    expect(document.querySelectorAll("[data-minimap-module]")).toHaveLength(5);
    expect(document.querySelectorAll(".minimap-edge")).toHaveLength(demoGraph.edges.length);
    expect(document.querySelector('[data-testid="minimap-viewport"]').getAttribute("x")).toBe("750");
    expect(document.querySelector('[data-testid="minimap-live"]')).toBeTruthy();
    expect(document.querySelector("[data-testid=breadcrumb]").textContent).toContain("RAG 检索增强");
  });

  it("shows the return-to-live action only when viewing differs from execution", () => {
    const view = createAppView(document.querySelector("#app"), handlers());
    const viewport = { ...createViewport("llm", "core"), viewing: { level: "module", moduleId: "rag", nodeId: null }, isViewingLive: false };
    view.render({ graph: demoGraph, run: createRun(demoGraph), viewport });

    expect(document.querySelector("[data-action=return-live]").hidden).toBe(false);
    expect(document.querySelector("[data-action=minimap-return-live]").hidden).toBe(false);
  });

  it("dispatches spatial view callbacks without mutating run state", () => {
    const viewHandlers = handlers();
    const run = createRun(demoGraph, "rag-route");
    const view = createAppView(document.querySelector("#app"), viewHandlers);
    view.render({ graph: demoGraph, run, viewport: createViewport("rag-route", "rag") });
    const runSnapshot = structuredClone(run);

    document.querySelector('[data-minimap-module="tools"]').dispatchEvent(new MouseEvent("click", { bubbles: true }));
    document.querySelector("[data-action=overview]").click();
    document.querySelector("[data-action=follow]").click();
    document.querySelector("[data-action=return-live]").click();

    expect(viewHandlers.onModuleFocus).toHaveBeenCalledWith("tools");
    expect(viewHandlers.onOverview).toHaveBeenCalledTimes(1);
    expect(viewHandlers.onToggleFollow).toHaveBeenCalledTimes(1);
    expect(viewHandlers.onReturnLive).toHaveBeenCalledTimes(1);
    expect(run).toEqual(runSnapshot);
  });

  it.each([
    ["vector", 6, 7],
    ["web", 7, 6],
  ])("does not mark a selected %s RAG branch complete before it finishes", (choice, completeIndex, incompleteIndex) => {
    const run = transition(createRun(demoGraph, "rag-route"), { type: "CHOOSE_BRANCH", choice });
    const view = createAppView(document.querySelector("#app"), handlers());
    view.render({ graph: demoGraph, run, viewport: createViewport("rag-route", "rag") });
    const edges = document.querySelectorAll(".minimap-edge");

    expect(edges[completeIndex].classList.contains("is-complete")).toBe(false);
    expect(edges[incompleteIndex].classList.contains("is-complete")).toBe(false);
  });

  it("marks only the active vector branch live in the minimap", () => {
    const run = transition(createRun(demoGraph, "rag-route"), { type: "CHOOSE_BRANCH", choice: "vector" });
    const view = createAppView(document.querySelector("#app"), handlers());
    view.render({ graph: demoGraph, run, viewport: createViewport("rag-route", "rag") });
    const edges = document.querySelectorAll(".minimap-edge");

    expect(edges[6].classList.contains("is-live")).toBe(true);
    expect(edges[7].classList.contains("is-live")).toBe(false);
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

  it("holds the complete overview for four seconds before following the live node", async () => {
    vi.useFakeTimers();
    await import("../../src/main.js?intro-overview-test");

    expect(document.querySelector('[data-layer="scene"]').getAttribute("transform")).toBe("translate(0 0) scale(1)");
    expect(document.querySelector('[data-node-id="user-task"]').classList.contains("is-live")).toBe(true);
    expect(document.querySelector('[data-action="follow"]').textContent).toContain("跟随中");

    await vi.advanceTimersByTimeAsync(3999);
    expect(document.querySelector('[data-layer="scene"]').getAttribute("transform")).toBe("translate(0 0) scale(1)");

    await vi.advanceTimersByTimeAsync(1);
    expect(document.querySelector('[data-layer="scene"]').getAttribute("transform")).not.toBe("translate(0 0) scale(1)");
    expect(document.querySelector("[data-testid=breadcrumb]").textContent).toContain("用户任务");
    expect(document.querySelector('[data-action="follow"]').textContent).toContain("跟随中");
  });

  it("cancels the intro and pauses active playback in Global View", async () => {
    vi.useFakeTimers();
    await import("../../src/main.js?global-view-pauses-test");

    document.querySelector('[data-action="play"]').click();
    expect(document.querySelector('[data-action="play"]').textContent).toContain("暂停 · Pause");

    document.querySelector('[data-action="overview"]').click();
    expect(document.querySelector('[data-action="play"]').textContent).toContain("播放 · Play");
    expect(document.querySelector('[data-layer="scene"]').getAttribute("transform")).toBe("translate(0 0) scale(1)");
    expect(vi.getTimerCount()).toBe(0);

    await vi.advanceTimersByTimeAsync(4000);
    expect(document.querySelector('[data-layer="scene"]').getAttribute("transform")).toBe("translate(0 0) scale(1)");
  });

  it("supports document keyboard shortcuts outside form controls and SVG buttons", async () => {
    vi.useFakeTimers();
    await import("../../src/main.js?keyboard-shortcuts-test");
    await vi.advanceTimersByTimeAsync(4000);

    document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(document.querySelector('[data-node-id="orchestrator"]').classList.contains("is-live")).toBe(true);

    document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowLeft", bubbles: true }));
    expect(document.querySelector('[data-node-id="user-task"]').classList.contains("is-live")).toBe(true);

    document.body.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    expect(document.querySelector('[data-action="play"]').textContent).toContain("暂停 · Pause");

    document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(document.querySelector('[data-action="play"]').textContent).toContain("播放 · Play");
    expect(document.querySelector("[data-testid=breadcrumb]").textContent).toBe("Agent 系统 > 输入与编排");

    document.body.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    expect(document.querySelector('[data-layer="scene"]').getAttribute("transform")).toBe("translate(0 0) scale(1)");

    const select = document.querySelector('[data-action="scenario"]');
    select.dispatchEvent(new KeyboardEvent("keydown", { key: "ArrowRight", bubbles: true }));
    expect(document.querySelector('[data-layer="scene"]').getAttribute("transform")).toBe("translate(0 0) scale(1)");

    const svgNode = document.querySelector('[data-node-id="user-task"]');
    svgNode.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));
    expect(document.querySelector('[data-action="play"]').textContent).toContain("播放 · Play");
  });

  it("pauses autoplay immediately when advancement arrives at a decision", async () => {
    vi.useFakeTimers();
    await import("../../src/main.js?autoplay-decision-test");

    document.querySelector('[data-action="play"]').click();
    await vi.advanceTimersByTimeAsync(900 * 4);

    expect(document.querySelector('[data-node-id="rag-route"]').classList.contains("is-live")).toBe(true);
    expect(document.querySelector('[data-action="play"]').textContent).toContain("播放 · Play");
    expect(vi.getTimerCount()).toBe(0);

    await vi.advanceTimersByTimeAsync(900 * 2);
    expect(document.querySelector('[data-node-id="rag-route"]').classList.contains("is-live")).toBe(true);
  });

  it("exposes side-effect and retry metadata in the inspector", () => {
    const view = createAppView(document.querySelector("#app"), handlers());
    const viewport = {
      ...createViewport("action", "tools"),
      viewing: { level: "node", moduleId: "tools", nodeId: "action" },
    };
    view.render({ graph: demoGraph, run: createRun(demoGraph, "tool-event"), viewport });

    expect(document.querySelector(".inspector").textContent).toContain("可重试");
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

  it("resets the run and clears scheduled playback when changing scenarios", async () => {
    vi.useFakeTimers();
    await import("../../src/main.js?scenario-reset-test");

    document.querySelector('[data-action="play"]').click();
    expect(vi.getTimerCount()).toBe(1);

    const select = document.querySelector('[data-action="scenario"]');
    select.value = "permission-denied";
    select.dispatchEvent(new Event("change"));

    expect(vi.getTimerCount()).toBe(0);
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
    expect(document.querySelector('[data-action="play"]').textContent).toContain("播放 · Play");
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

  it("stacks a full-width inspector at the 620px breakpoint", () => {
    const view = createAppView(document.querySelector("#app"), handlers());
    const viewport = {
      ...createViewport("action", "tools"),
      viewing: { level: "node", moduleId: "tools", nodeId: "action" },
    };
    view.render({ graph: demoGraph, run: createRun(demoGraph, "tool-event"), viewport, scenarioId: "normal" });

    const css = readFileSync("src/styles.css", "utf8");
    expect(document.querySelector(".inspector").closest(".canvas-shell")).toBe(document.querySelector(".canvas-shell"));
    expect(css).toMatch(/@media \(max-width: 620px\)[\s\S]*\.inspector \{[\s\S]*left: 0;[\s\S]*right: 0;/);
  });

  it("supports keyboard activation for minimap modules and inspector close", () => {
    const viewHandlers = handlers();
    const view = createAppView(document.querySelector("#app"), viewHandlers);
    const viewport = {
      ...createViewport("action", "tools"),
      viewing: { level: "node", moduleId: "tools", nodeId: "action" },
    };
    view.render({ graph: demoGraph, run: createRun(demoGraph, "tool-event"), viewport, scenarioId: "normal" });

    document.querySelector('[data-minimap-module="core"]').dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    document.querySelector('[data-action="close-inspector"]').dispatchEvent(new KeyboardEvent("click", { bubbles: true }));

    expect(viewHandlers.onModuleFocus).toHaveBeenCalledWith("core");
    expect(viewHandlers.onCloseInspector).toHaveBeenCalledTimes(1);
  });
});
