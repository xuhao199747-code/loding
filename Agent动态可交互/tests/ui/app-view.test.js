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
  ])("marks only the %s RAG branch complete in the minimap", (choice, completeIndex, incompleteIndex) => {
    const run = transition(createRun(demoGraph, "rag-route"), { type: "CHOOSE_BRANCH", choice });
    const view = createAppView(document.querySelector("#app"), handlers());
    view.render({ graph: demoGraph, run, viewport: createViewport("rag-route", "rag") });
    const edges = document.querySelectorAll(".minimap-edge");

    expect(edges[completeIndex].classList.contains("is-complete")).toBe(true);
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
    const run = { ...createRun(demoGraph, "rag-retrieval"), activeBranches: ["vector", "web"], completedBranches: ["vector"] };
    const view = createAppView(document.querySelector("#app"), handlers());
    view.render({ graph: demoGraph, run, viewport: createViewport("rag-route", "rag") });

    expect(document.querySelector("[data-testid=branch-progress]").textContent).toContain("1 / 2");
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
});
