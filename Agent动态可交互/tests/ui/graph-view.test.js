import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderGraph } from "../../src/ui/GraphView.js";
import { demoGraph } from "../../src/data/demo-graph.js";
import { createRun, transition } from "../../src/domain/execution.js";
import { createViewport } from "../../src/domain/viewport.js";

describe("GraphView", () => {
  beforeEach(() => { document.body.innerHTML = '<div id="graph"></div>'; });

  const groupIds = demoGraph.groups.map((group) => group.id).sort();
  const edgeIds = demoGraph.edges.map((edge) => edge.id).sort();

  function render(state) {
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, ...state, onNodeSelect: vi.fn() });
  }

  function assertCompleteOverview() {
    expect([...document.querySelectorAll("[data-group-id]")].map((group) => group.dataset.groupId).sort()).toEqual(groupIds);
    expect(document.querySelectorAll("[data-topology-edge]")).toHaveLength(demoGraph.topologyEdges.length);
    expect([...document.querySelectorAll("[data-edge-id]")].map((edge) => edge.dataset.edgeId).sort()).toEqual(edgeIds);
    expect(document.querySelector('[data-layer="scene"]')).toBeNull();
    expect(document.querySelectorAll(".graph-module.is-dimmed, .graph-node.is-dimmed")).toHaveLength(0);
  }

  it("draws the six reference layers in their exact visual order", () => {
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run: createRun(demoGraph), viewport: createViewport(), onNodeSelect: vi.fn() });

    const root = document.querySelector("svg");
    const edgesLayer = document.querySelector('[data-layer="topology-edges"]');
    const nodesLayer = document.querySelector('[data-layer="nodes"]');
    expect(root.getAttribute("viewBox")).toBe("0 0 1400 800");
    expect([...root.children].filter((child) => child.hasAttribute("data-layer")).map((child) => child.dataset.layer)).toEqual([
      "system-boundary",
      "groups",
      "topology-edges",
      "nodes",
      "guardrails",
      "live-pulses",
    ]);
    const edges = edgesLayer.querySelectorAll("[data-topology-edge]");
    expect(edges).toHaveLength(demoGraph.topologyEdges.length);
    for (const edge of edges) expect(edge.getAttribute("marker-end")).toBeTruthy();
    expect(nodesLayer).not.toBeNull();
    expect(document.querySelectorAll("[data-module-id]")).toHaveLength(0);
  });

  it("anchors a straight edge to node rectangle boundaries rather than centers", () => {
    render({ run: createRun(demoGraph), viewport: createViewport() });

    const coordinates = document.querySelector('[data-edge-id="e2"]')
      .getAttribute("d")
      .match(/-?\d+(?:\.\d+)?/g)
      .map(Number);

    expect(coordinates).toEqual([510, 211, 510, 235]);
    expect(coordinates).not.toEqual([510, 188, 510, 258]);
  });

  it("marks the Chinese group and visible node names as primary labels", () => {
    render({ run: createRun(demoGraph), viewport: createViewport() });

    for (const group of demoGraph.groups) {
      const primary = document.querySelector(`[data-group-id="${group.id}"] .primary-label`);
      expect(primary).not.toBeNull();
      expect(primary.textContent).toBe(group.label.zh);
    }
    for (const node of demoGraph.nodes) {
      const rendered = document.querySelector(`[data-node-id="${node.id}"]`);
      expect(rendered).not.toBeNull();
      expect(rendered.getAttribute("aria-label")).toContain(node.label.zh);
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

  it.each([
    ["vector", "e9", "e10"],
    ["web", "e10", "e9"],
  ])("projects only the %s branch through its join edge", (branch, selectedEdgeId, skippedEdgeId) => {
    let run = transition(createRun(demoGraph, "rag-route"), { type: "CHOOSE_BRANCH", choice: branch });
    run = transition(run, { type: "COMPLETE_BRANCH", branch });
    render({ run, viewport: createViewport("rag-merge", "rag") });

    const selected = document.querySelector(`[data-edge-id="${selectedEdgeId}"]`);
    const skipped = document.querySelector(`[data-edge-id="${skippedEdgeId}"]`);
    const merge = document.querySelector('[data-node-id="rag-merge"]');
    expect(selected.classList.contains("is-live")).toBe(true);
    expect(selected.classList.contains("is-complete")).toBe(false);
    expect(skipped.classList.contains("is-skipped")).toBe(true);
    expect(skipped.classList.contains("is-live")).toBe(false);
    expect(skipped.classList.contains("is-complete")).toBe(false);
    expect(merge.classList.contains("is-live")).toBe(true);
    expect(merge.classList.contains("is-skipped")).toBe(false);

    run = transition(run, { type: "ADVANCE" });
    render({ run, viewport: createViewport("rag-context", "rag") });
    expect(document.querySelector(`[data-edge-id="${selectedEdgeId}"]`).classList.contains("is-complete")).toBe(true);
    expect(document.querySelector(`[data-edge-id="${selectedEdgeId}"]`).classList.contains("is-live")).toBe(false);
    expect(document.querySelector(`[data-edge-id="${skippedEdgeId}"]`).classList.contains("is-skipped")).toBe(true);
    expect(document.querySelector(`[data-edge-id="${skippedEdgeId}"]`).classList.contains("is-complete")).toBe(false);
    expect(document.querySelector('[data-node-id="rag-merge"]').classList.contains("is-complete")).toBe(true);
    expect(document.querySelector('[data-node-id="rag-merge"]').classList.contains("is-skipped")).toBe(false);
  });

  it.each([
    ["sequence", "e1", () => createRun(demoGraph)],
    ["module", "e3", () => createRun(demoGraph, "planning-event")],
    ["decision", "e6", () => createRun(demoGraph, "llm-route-event")],
    ["parallel", "e7", () => transition(createRun(demoGraph, "rag-route"), { type: "CHOOSE_BRANCH", choice: "vector" })],
    ["join", "e9", () => transition(transition(createRun(demoGraph, "rag-route"), { type: "CHOOSE_BRANCH", choice: "vector" }), { type: "COMPLETE_BRANCH", branch: "vector" })],
    ["callback", "e12", () => createRun(demoGraph, "rag-callback")],
    ["retry", "e18", () => transition(createRun(demoGraph, "observation-event"), { type: "CHOOSE_BRANCH", choice: "retry" })],
    ["replan", "e16", () => transition(createRun(demoGraph, "observation-event"), { type: "CHOOSE_BRANCH", choice: "replan" })],
  ])("renders a path-derived moving pulse for an active %s edge", (_type, edgeId, runForCase) => {
    render({ run: runForCase(), viewport: createViewport() });

    const edge = document.querySelector(`[data-edge-id="${edgeId}"]`);
    const pulse = document.querySelector(`[data-edge-pulse-for="${edgeId}"]`);
    expect(edge.classList.contains("is-live")).toBe(true);
    expect(pulse).not.toBeNull();
    expect(pulse.querySelector("animateMotion").getAttribute("path")).toBe(edge.getAttribute("d"));
    for (const livePath of document.querySelectorAll(".graph-edge.is-live")) {
      const livePulse = livePath.dataset.topologyEdge
        ? document.querySelector(`[data-topology-edge-pulse-for="${livePath.dataset.topologyEdge}"]`)
        : document.querySelector(`[data-edge-pulse-for="${livePath.dataset.edgeId}"]`);
      expect(livePulse).not.toBeNull();
      expect(livePulse.querySelector("animateMotion").getAttribute("path")).toBe(livePath.getAttribute("d"));
    }
  });

  it("removes the pulse when a completed edge is no longer active", () => {
    let run = transition(createRun(demoGraph, "observation-event"), { type: "CHOOSE_BRANCH", choice: "retry" });
    run = transition(run, { type: "ADVANCE" });
    render({ run, viewport: createViewport() });

    const retry = document.querySelector('[data-edge-id="e18"]');
    expect(retry.classList.contains("is-complete")).toBe(true);
    expect(retry.classList.contains("is-live")).toBe(false);
    expect(document.querySelector('[data-edge-pulse-for="e18"]')).toBeNull();
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

  it("renders Chinese group headers with a smaller English support label", () => {
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run: createRun(demoGraph), viewport: createViewport(), onNodeSelect: vi.fn() });
    const coreGroup = document.querySelector('[data-group-id="core-group"]');
    const support = coreGroup.querySelector(".group-en");
    expect(coreGroup.textContent).toContain("核心");
    expect(support.textContent).toBe("Core");
    expect(support.getAttribute("font-size")).toBe("9");
  });

  it("renders informative SVG nodes with accessible labels and textual status", () => {
    renderGraph(document.querySelector("#graph"), {
      graph: demoGraph,
      run: { ...createRun(demoGraph), status: "failed" },
      viewport: createViewport(),
      onNodeSelect: vi.fn(),
    });

    const live = document.querySelector('[data-node-id="user-task"]');
    expect(live.getAttribute("role")).toBe("group");
    expect(live.getAttribute("tabindex")).toBeNull();
    expect(live.getAttribute("aria-label")).toContain("用户任务");
    expect(live.classList.contains("is-failed")).toBe(true);
    expect(live.querySelector(".status-label").textContent).toContain("失败");
  });

  it("does not activate SVG nodes by click, Enter, or Space", () => {
    const onNodeSelect = vi.fn();
    renderGraph(document.querySelector("#graph"), {
      graph: demoGraph,
      run: createRun(demoGraph),
      viewport: createViewport(),
      onNodeSelect,
    });

    const node = document.querySelector('[data-node-id="user-task"]');
    node.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    node.dispatchEvent(new KeyboardEvent("keydown", { key: "Enter", bubbles: true }));
    node.dispatchEvent(new KeyboardEvent("keydown", { key: " ", bubbles: true }));

    expect(onNodeSelect).not.toHaveBeenCalled();
  });
});
