import { completedEdgeIdsForTrace, isCurrentLiveEdge } from "./traceEdges.js";

const SVG_NS = "http://www.w3.org/2000/svg";

const svg = (tag, attributes = {}) => {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  return element;
};

const nodeCenter = (node) => ({ x: node.x + 65, y: node.y + 29 });

function viewportBox(graph, viewing) {
  if (viewing.level === "overview") return { x: 0, y: 0, w: 1200, h: 800 };
  if (viewing.level === "module") {
    const module = graph.modules.find((item) => item.id === viewing.moduleId);
    return { x: module.x, y: module.y, w: module.w, h: module.h };
  }
  const node = graph.nodes.find((item) => item.id === viewing.nodeId);
  return { x: node.x - 80, y: node.y - 70, w: 290, h: 200 };
}

export function renderMiniMap(container, { graph, run, viewport, handlers }) {
  container.innerHTML = `<div class="minimap-head"><span>全局定位 <small>OVERVIEW</small></span><button data-action="overview">全局视图 <small>Overview</small></button></div><div class="minimap-map-host"></div><div class="minimap-actions"><button data-action="follow">${viewport.followRun ? "跟随中 · Following" : "跟随执行 · Follow Run"}</button><button data-action="minimap-return-live" ${viewport.isViewingLive ? "hidden" : ""}>回到当前节点 · Return Live</button></div>`;

  const map = svg("svg", {
    viewBox: "0 0 1200 800",
    class: "minimap-map",
    role: "navigation",
    "aria-label": "架构小地图 Architecture minimap",
  });
  const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
  const currentEvent = graph.events.find((event) => event.id === run.currentEventId);
  const complete = completedEdgeIdsForTrace(graph, run.trace);

  for (const edge of graph.edges) {
    const from = nodeCenter(nodes.get(edge.from));
    const to = nodeCenter(nodes.get(edge.to));
    const path = svg("path", {
      d: `M ${from.x} ${from.y} L ${to.x} ${to.y}`,
      class: "minimap-edge",
      "data-edge-type": edge.type,
    });
    if (complete.has(edge.id)) path.classList.add("is-complete");
    if (isCurrentLiveEdge(currentEvent, edge, run.activeBranches)) path.classList.add("is-live");
    map.append(path);
  }

  for (const module of graph.modules) {
    const region = svg("g", {
      "data-minimap-module": module.id,
      role: "button",
      tabindex: 0,
      "aria-label": `${module.label.zh} ${module.label.en}`,
    });
    region.append(svg("rect", { x: module.x, y: module.y, width: module.w, height: module.h, rx: 14 }));
    const title = svg("text", { x: module.x + module.w / 2, y: module.y + module.h / 2, "text-anchor": "middle" });
    title.textContent = module.label.zh;
    region.append(title);
    const focus = () => handlers.onModuleFocus(module.id);
    region.addEventListener("click", focus);
    region.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        focus();
      }
    });
    map.append(region);
  }

  const box = viewportBox(graph, viewport.viewing);
  map.append(svg("rect", {
    "data-testid": "minimap-viewport",
    class: "minimap-viewport",
    x: box.x,
    y: box.y,
    width: box.w,
    height: box.h,
  }));
  const liveNode = nodes.get(run.currentNodeId);
  map.append(svg("circle", {
    "data-testid": "minimap-live",
    class: "minimap-live",
    cx: liveNode.x + 65,
    cy: liveNode.y + 29,
    r: 16,
  }));

  container.querySelector(".minimap-map-host").append(map);
  container.querySelector('[data-action="overview"]').addEventListener("click", handlers.onOverview);
  container.querySelector('[data-action="follow"]').addEventListener("click", handlers.onToggleFollow);
  container.querySelector('[data-action="minimap-return-live"]').addEventListener("click", handlers.onReturnLive);
}
