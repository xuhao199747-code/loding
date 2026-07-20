import { renderGraph } from "./GraphView.js";
import { renderMiniMap } from "./MiniMap.js";
import { renderInspector } from "./Inspector.js";
import { renderPlaybackControls } from "./PlaybackControls.js";
import { latestSnapshotForNode } from "../domain/execution.js";

export function createAppView(root, handlers) {
  root.innerHTML = `<section class="app-shell"><header class="topbar"><div><span class="eyebrow">AGENT EXECUTION MAP</span><h1 data-lang="zh">智能代理执行流程</h1><p class="foundation-screen__support" data-lang="en">Interactive Agent Flow</p></div><label class="scenario-control">模拟场景 <small>Simulation</small><select data-action="scenario" aria-label="模拟场景 Simulation"></select></label><nav data-testid="breadcrumb" aria-label="当前位置 Current location"></nav></header><div class="canvas-shell"><div class="graph-host"></div><aside class="minimap" data-testid="minimap"></aside><button class="return-live" data-action="return-live">回到当前执行 · Return Live</button><aside class="inspector"></aside></div><footer class="controls-host"></footer></section>`;

  const graphHost = root.querySelector(".graph-host");
  const minimap = root.querySelector(".minimap");
  const inspector = root.querySelector(".inspector");
  const breadcrumb = root.querySelector('[data-testid="breadcrumb"]');
  const returnLive = root.querySelector('[data-action="return-live"]');
  const controls = root.querySelector(".controls-host");
  const scenario = root.querySelector('[data-action="scenario"]');

  return {
    render(state) {
      scenario.replaceChildren(...state.graph.scenarios.map((item) => new Option(`${item.label.zh} · ${item.label.en}`, item.id)));
      scenario.value = state.scenarioId ?? "normal";
      scenario.onchange = (event) => handlers.onScenarioChange?.(event.target.value);
      const module = state.graph.modules.find((item) => item.id === state.viewport.viewing.moduleId);
      const node = state.graph.nodes.find((item) => item.id === state.viewport.viewing.nodeId);
      breadcrumb.textContent = ["Agent 系统", module?.label.zh, node?.label.zh].filter(Boolean).join(" > ");
      renderGraph(graphHost, { ...state, onNodeSelect: handlers.onNodeSelect });
      renderMiniMap(minimap, { ...state, handlers });
      minimap.classList.toggle("is-collapsed", Boolean(state.minimapCollapsed));
      const minimapToggle = minimap.querySelector('[data-action="minimap-toggle"]');
      minimapToggle.setAttribute("aria-expanded", String(!state.minimapCollapsed));
      minimapToggle.innerHTML = state.minimapCollapsed ? "展开小地图 <small>Expand Map</small>" : "收起小地图 <small>Collapse Map</small>";
      returnLive.hidden = state.viewport.isViewingLive;
      returnLive.onclick = handlers.onReturnLive;
      const currentEvent = state.graph.events.find((item) => item.id === state.run.currentEventId);
      const inspectorNode = node ?? state.graph.nodes.find((item) => item.id === state.run.currentNodeId);
      const historical = Boolean(node) && !state.viewport.isViewingLive;
      const liveSnapshot = {
        id: `live:${currentEvent.id}`,
        eventId: currentEvent.id,
        nodeId: currentEvent.nodeId,
        status: state.run.status,
        input: currentEvent.label.zh,
        output: state.run.simulatedIssue?.label?.zh ?? "—",
        summary: currentEvent.label.en,
        iteration: state.run.iteration,
        selectedBranches: state.run.selectedBranches ?? state.run.activeBranches ?? [],
        completedBranches: state.run.completedBranches,
      };
      renderInspector(inspector, {
        node: inspectorNode,
        snapshot: historical ? latestSnapshotForNode(state.run, node.id) : liveSnapshot,
        open: Boolean(inspectorNode),
        historical,
        onClose: handlers.onCloseInspector,
        onRerunSnapshot: handlers.onRerunSnapshot,
      });
      renderPlaybackControls(controls, {
        run: state.run,
        event: currentEvent,
        scenario: state.graph.scenarios.find((item) => item.id === state.scenarioId),
        speed: state.playbackSpeed ?? 1,
        eventNumber: state.graph.events.indexOf(currentEvent) + 1,
        eventCount: state.graph.events.length,
      }, handlers);
    },
  };
}
