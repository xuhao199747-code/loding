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
    expect(webEdge.classList.contains("is-complete")).toBe(true);
  });

  it("completes only the chosen observation outcome", () => {
    const run = transition(createRun(demoGraph, "observation-event"), { type: "CHOOSE_BRANCH", choice: "retry" });
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run, viewport: createViewport("action", "tools"), onNodeSelect: vi.fn() });
    expect(document.querySelector('[data-edge-id="e18"]').classList.contains("is-complete")).toBe(true);
    expect(document.querySelector('[data-edge-id="e16"]').classList.contains("is-complete")).toBe(false);
    expect(document.querySelector('[data-edge-id="e19"]').classList.contains("is-complete")).toBe(false);
  });

  it("renders Chinese module headers with a smaller English support label", () => {
    renderGraph(document.querySelector("#graph"), { graph: demoGraph, run: createRun(demoGraph), viewport: createViewport(), onNodeSelect: vi.fn() });
    const coreModule = document.querySelector('[data-module-id="core"]');
    const support = coreModule.querySelector(".module-en");
    expect(coreModule.textContent).toContain("Agent 核心");
    expect(support.textContent).toBe("Agent Core");
    expect(support.getAttribute("font-size")).toBe("10");
  });
});
