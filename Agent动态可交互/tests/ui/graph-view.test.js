import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderGraph } from "../../src/ui/GraphView.js";
import { demoGraph } from "../../src/data/demo-graph.js";
import { createRun, transition } from "../../src/domain/execution.js";
import { createViewport } from "../../src/domain/viewport.js";

describe("GraphView", () => {
  beforeEach(() => { document.body.innerHTML = '<div id="graph"></div>'; });

  it("keeps all modules mounted while dimming non-focused modules", () => {
    const viewport = { ...createViewport("rag-route", "rag"), viewing: { level: "module", moduleId: "rag", nodeId: null } };
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run: createRun(demoGraph, "rag-route"), viewport, onNodeSelect: vi.fn() });
    expect(document.querySelectorAll("[data-module-id]")).toHaveLength(5);
    expect(document.querySelector('[data-layer="guardrails"]').textContent).toContain("权限");
    expect(document.querySelector('[data-module-id="core"]').classList.contains("is-dimmed")).toBe(true);
    expect(document.querySelector('[data-module-id="rag"]').classList.contains("is-dimmed")).toBe(false);
    expect(document.querySelector('[data-layer="scene"]').getAttribute("transform")).not.toBe("translate(0 0) scale(1)");
  });

  it("marks callback edges and live nodes", () => {
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run: createRun(demoGraph, "rag-callback"), viewport: createViewport("rag-context", "rag"), onNodeSelect: vi.fn() });
    expect(document.querySelector('[data-node-id="rag-context"]').classList.contains("is-live")).toBe(true);
    expect(document.querySelector('[data-edge-id="e12"]').classList.contains("is-callback")).toBe(true);
  });

  it("reveals internal substeps only at node focus", () => {
    const viewport = { ...createViewport("planning", "core"), viewing: { level: "node", moduleId: "core", nodeId: "planning" } };
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run: createRun(demoGraph, "planning-event"), viewport, onNodeSelect: vi.fn() });
    expect(document.querySelectorAll("[data-detail-step]")).toHaveLength(3);
    expect(document.querySelector("[data-detail-step]").textContent).toContain("子目标拆解");
  });

  it("completes only the selected RAG branch while marking unselected branches skipped", () => {
    const run = transition(createRun(demoGraph, "rag-route"), { type: "CHOOSE_BRANCH", choice: "web" });
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run, viewport: createViewport("rag-route", "rag"), onNodeSelect: vi.fn() });
    const vectorEdge = document.querySelector('[data-edge-id="e7"]');
    const webEdge = document.querySelector('[data-edge-id="e8"]');
    expect(vectorEdge.classList.contains("is-skipped")).toBe(true);
    expect(vectorEdge.classList.contains("is-complete")).toBe(false);
    expect(webEdge.classList.contains("is-live")).toBe(true);
    expect(webEdge.classList.contains("is-complete")).toBe(false);
  });

  it("keeps a web-only trace selected after its branch joins", () => {
    let run = transition(createRun(demoGraph, "rag-route"), { type: "CHOOSE_BRANCH", choice: "web" });
    run = transition(run, { type: "COMPLETE_BRANCH", branch: "web" });
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run, viewport: createViewport("rag-merge", "rag"), onNodeSelect: vi.fn() });
    const vectorEdge = document.querySelector('[data-edge-id="e7"]');
    const webEdge = document.querySelector('[data-edge-id="e8"]');
    expect(webEdge.classList.contains("is-complete")).toBe(true);
    expect(vectorEdge.classList.contains("is-complete")).toBe(false);
    expect(vectorEdge.classList.contains("is-skipped")).toBe(true);
  });

  it("completes only the chosen observation outcome", () => {
    const run = transition(createRun(demoGraph, "observation-event"), { type: "CHOOSE_BRANCH", choice: "retry" });
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run, viewport: createViewport("action", "tools"), onNodeSelect: vi.fn() });
    expect(document.querySelector('[data-edge-id="e18"]').classList.contains("is-complete")).toBe(true);
    expect(document.querySelector('[data-edge-id="e16"]').classList.contains("is-complete")).toBe(false);
    expect(document.querySelector('[data-edge-id="e19"]').classList.contains("is-complete")).toBe(false);
  });

  it("completes only the direct replan edge from observation", () => {
    const run = transition(createRun(demoGraph, "observation-event"), { type: "REPLAN", reason: "low score" });
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run, viewport: createViewport("planning", "core"), onNodeSelect: vi.fn() });
    expect(document.querySelector('[data-edge-id="e16"]').classList.contains("is-complete")).toBe(true);
    expect(document.querySelector('[data-edge-id="e18"]').classList.contains("is-complete")).toBe(false);
    expect(document.querySelector('[data-edge-id="e19"]').classList.contains("is-complete")).toBe(false);
  });

  it("does not complete unrelated edges for a direct retry without a matching source edge", () => {
    const run = transition(createRun(demoGraph, "tool-event"), { type: "RETRY" });
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run, viewport: createViewport("action", "tools"), onNodeSelect: vi.fn() });
    expect(document.querySelector('[data-edge-id="e15"]').classList.contains("is-complete")).toBe(false);
    expect(document.querySelectorAll(".graph-edge.is-complete")).toHaveLength(0);
  });

  it("renders a direct retry from an event without edge ids without completing any edge", () => {
    const run = transition(createRun(demoGraph, "final-event"), { type: "RETRY" });
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run, viewport: createViewport("final-response", "response"), onNodeSelect: vi.fn() });
    expect(document.querySelectorAll(".graph-edge.is-complete")).toHaveLength(0);
  });

  it("renders Chinese module headers with a smaller English support label", () => {
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run: createRun(demoGraph), viewport: createViewport(), onNodeSelect: vi.fn() });
    const coreModule = document.querySelector('[data-module-id="core"]');
    const support = coreModule.querySelector(".module-en");
    expect(coreModule.textContent).toContain("Agent 核心");
    expect(support.textContent).toBe("Agent Core");
    expect(support.getAttribute("font-size")).toBe("10");
  });

  it("adds textual status labels and keyboard-focusable nodes", () => {
    renderGraph(document.querySelector("#graph"), {
      graph: demoGraph,
      run: { ...createRun(demoGraph), status: "failed" },
      viewport: createViewport(),
      onNodeSelect: vi.fn(),
    });

    const live = document.querySelector('[data-node-id="user-task"]');
    expect(live.getAttribute("tabindex")).toBe("0");
    expect(live.getAttribute("aria-label")).toContain("用户任务");
    expect(live.classList.contains("is-failed")).toBe(true);
    expect(live.querySelector(".status-label").textContent).toContain("失败");
  });

  it("activates a focused SVG node with Enter and Space", () => {
    const onNodeSelect = vi.fn();
    renderGraph(document.querySelector("#graph"), {
      graph: demoGraph,
      run: createRun(demoGraph),
      viewport: createViewport(),
      onNodeSelect,
    });

    const node = document.querySelector('[data-node-id="user-task"]');
    node.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    node.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));

    expect(onNodeSelect).toHaveBeenCalledTimes(2);
    expect(onNodeSelect).toHaveBeenLastCalledWith(expect.objectContaining({ id: "user-task" }));
  });
});
