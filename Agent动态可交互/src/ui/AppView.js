import { renderGraph } from "./GraphView.js";
import { renderMiniMap } from "./MiniMap.js";
import { renderInspector } from "./Inspector.js";

export function createAppView(root, handlers) {
  root.innerHTML = `<section class="app-shell"><header class="topbar"><div><span class="eyebrow">AGENT EXECUTION MAP</span><h1 data-lang="zh">智能代理执行流程</h1><p class="foundation-screen__support" data-lang="en">Interactive Agent Flow</p></div><nav data-testid="breadcrumb" aria-label="当前位置 Current location"></nav></header><div class="canvas-shell"><div class="graph-host"></div><aside class="minimap" data-testid="minimap"></aside><button class="return-live" data-action="return-live">回到当前执行 · Return Live</button><aside class="inspector"></aside></div><footer class="controls-host"></footer></section>`;

  const graphHost = root.querySelector(".graph-host");
  const minimap = root.querySelector(".minimap");
  const inspector = root.querySelector(".inspector");
  const breadcrumb = root.querySelector('[data-testid="breadcrumb"]');
  const returnLive = root.querySelector('[data-action="return-live"]');

  return {
    render(state) {
      const module = state.graph.modules.find((item) => item.id === state.viewport.viewing.moduleId);
      const node = state.graph.nodes.find((item) => item.id === state.viewport.viewing.nodeId);
      breadcrumb.textContent = ["Agent 系统", module?.label.zh, node?.label.zh].filter(Boolean).join(" > ");
      renderGraph(graphHost, { ...state, onNodeSelect: handlers.onNodeSelect });
      renderMiniMap(minimap, { ...state, handlers });
      returnLive.hidden = state.viewport.isViewingLive;
      returnLive.onclick = handlers.onReturnLive;
      renderInspector(inspector, {
        node: node ?? state.graph.nodes.find((item) => item.id === state.run.currentNodeId),
        event: state.run.trace.at(-1),
        open: Boolean(node),
        onClose: handlers.onCloseInspector,
      });
    },
  };
}
