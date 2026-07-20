import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderGraph } from "../../src/ui/GraphView.js";
import { demoGraph } from "../../src/data/demo-graph.js";
import { createRun, transition } from "../../src/domain/execution.js";
import { createViewport } from "../../src/domain/viewport.js";

describe("GraphView", () => {
  beforeEach(() => { document.body.innerHTML = '<div id="graph"></div>'; });

  const moduleIds = demoGraph.modules.map((module) => module.id).sort();
  const edgeIds = demoGraph.edges.map((edge) => edge.id).sort();

  function render(state) {
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, ...state, onNodeSelect: vi.fn() });
  }

  function assertCompleteOverview() {
    expect([...document.querySelectorAll("[data-module-id]")].map((module) => module.dataset.moduleId).sort()).toEqual(moduleIds);
    expect([...document.querySelectorAll("[data-edge-id]")].map((edge) => edge.dataset.edgeId).sort()).toEqual(edgeIds);
    expect(document.querySelector('[data-layer="scene"]')).toBeNull();
    expect(document.querySelectorAll(".graph-module.is-dimmed, .graph-node.is-dimmed")).toHaveLength(0);
  }

  it("draws modules before edges before nodes while allowing unrelated layers", () => {
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run: createRun(demoGraph), viewport: createViewport(), onNodeSelect: vi.fn() });

    const modulesLayer = document.querySelector('[data-layer="modules"]');
    const edgesLayer = document.querySelector('[data-layer="edges"]');
    const nodesLayer = document.querySelector('[data-layer="nodes"]');
    expect(modulesLayer).not.toBeNull();
    expect(edgesLayer).not.toBeNull();
    expect(nodesLayer).not.toBeNull();
    expect(modulesLayer.compareDocumentPosition(edgesLayer) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0);
    expect(edgesLayer.compareDocumentPosition(nodesLayer) & Node.DOCUMENT_POSITION_FOLLOWING).not.toBe(0);
    const edges = edgesLayer.querySelectorAll("[data-edge-id]");
    expect(edges).toHaveLength(demoGraph.edges.length);
    for (const edge of edges) expect(edge.getAttribute("marker-end")).toBeTruthy();
  });

  it("marks the Chinese module and node names as primary labels", () => {
    render({ run: createRun(demoGraph), viewport: createViewport() });

    for (const module of demoGraph.modules) {
      const primary = document.querySelector(`[data-module-id="${module.id}"] .primary-label`);
      expect(primary).not.toBeNull();
      expect(primary.textContent).toBe(module.label.zh);
    }
    for (const node of demoGraph.nodes) {
      const primary = document.querySelector(`[data-node-id="${node.id}"] .primary-label`);
      expect(primary).not.toBeNull();
      expect(primary.textContent).toBe(node.label.zh);
    }
  });

  it.each([
    ["initial", () => ({ run: createRun(demoGraph), viewport: createViewport() })],
    ["historical node view", () => ({
      run: createRun(demoGraph, "rag-context-event"),
      viewport: { ...createViewport("rag-context-event", "rag"), viewing: { level: "node", moduleId: "rag", nodeId: "rag-context" }, isViewingLive: false },
    })],
    ["decision", () => ({ run: createRun(demoGraph, "rag-route"), viewport: createViewport("rag-route", "rag") })],
    ["one of two parallel branches complete", () => {
      const selected = transition(createRun(demoGraph, "rag-route"), { type: "CHOOSE_BRANCH", choice: "parallel" });
      return { run: transition(selected, { type: "COMPLETE_BRANCH", branch: "vector" }), viewport: createViewport("rag-retrieval", "rag") };
    }],
    ["callback", () => ({ run: createRun(demoGraph, "rag-callback"), viewport: createViewport("rag-context", "rag") })],
    ["retry", () => ({ run: transition(createRun(demoGraph, "tool-event"), { type: "RETRY" }), viewport: createViewport("action", "tools") })],
    ["replan", () => ({ run: transition(createRun(demoGraph, "observation-event"), { type: "REPLAN", reason: "low score" }), viewport: createViewport("planning", "core") })],
  ])("keeps the full architecture visible for %s", (_state, stateForCase) => {
    render(stateForCase());

    assertCompleteOverview();
  });

  it("marks callback edges and live nodes", () => {
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run: createRun(demoGraph, "rag-callback"), viewport: createViewport("rag-context", "rag"), onNodeSelect: vi.fn() });
    expect(document.querySelector('[data-node-id="rag-context"]').classList.contains("is-live")).toBe(true);
    expect(document.querySelector('[data-edge-id="e12"]').classList.contains("is-callback")).toBe(true);
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
