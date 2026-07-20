import {
  activeTransitionEdgeIds,
  completedEdgeIdsForTrace,
  isCurrentLiveEdge,
  referenceEdgeState,
  referenceVisualState,
  topologyEdgeKey,
  topologyEdgeMeta,
} from "./traceEdges.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const statusLabels = {
  waiting: "等待 · Waiting", paused: "暂停 · Paused", running: "执行中 · Running", success: "成功 · Success",
  completed: "完成 · Completed", failed: "失败 · Failed", skipped: "跳过 · Skipped", blocked: "已阻塞 · Blocked",
  retrying: "重试中 · Retrying", cancelled: "已取消 · Cancelled", partial: "部分完成 · Partial",
};
const relationLabels = {
  callback: "回传 · Callback",
  retry: "重试 · Retry",
  replan: "重规划 · Replan",
  decision: "决策 · Decision",
};
const visibleExecutableIds = new Set(["user-task", "orchestrator", "llm", "action", "observation", "final-response"]);
const CONTEXT_GATE_ID = "context-dependency-gate";
const detailEndpointAliases = new Map(Object.entries({
  "rag-route": ["rag-routing"],
  "vector-search": ["vector-store-retrieval"],
  "web-search": ["rag-web-search"],
  "rag-merge": ["result-merge-deduplicate"],
  "rag-context": ["rag-context-assembly"],
  "tool-select": ["external-environment-business-system"],
  action: ["code-execution-sandbox"],
}));

const svg = (tag, attributes = {}) => {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  return element;
};

const center = ({ x, y, w, h }) => ({ x: x + w / 2, y: y + h / 2 });
const pointOnSide = (bounds, side, fraction = .5) => {
  if (side === "top") return { x: bounds.x + bounds.w * fraction, y: bounds.y };
  if (side === "bottom") return { x: bounds.x + bounds.w * fraction, y: bounds.y + bounds.h };
  if (side === "left") return { x: bounds.x, y: bounds.y + bounds.h * fraction };
  return { x: bounds.x + bounds.w, y: bounds.y + bounds.h * fraction };
};

function boundaryToward(bounds, target) {
  const origin = center(bounds);
  const dx = target.x - origin.x;
  const dy = target.y - origin.y;
  if (!dx && !dy) return origin;
  const scale = 1 / Math.max(Math.abs(dx) / (bounds.w / 2), Math.abs(dy) / (bounds.h / 2));
  return { x: origin.x + dx * scale, y: origin.y + dy * scale };
}

function contextGateProjection(graph) {
  const tools = graph.groups.find((group) => group.id === "tools-group").bounds;
  return {
    id: CONTEXT_GATE_ID,
    groupId: "tools-group",
    bounds: { x: tools.x + 330, y: tools.y + 98, w: 165, h: 42 },
    label: { zh: "上下文依赖门", en: "Context Gate" },
    description: { zh: "依赖:等待 · 无依赖:并发", en: "Dependent: Wait · Independent: Continue" },
  };
}

function contextGateState(run) {
  if (!run.activeLanes?.includes("tools")) return {};
  if (!run.contextRequired) return { independent: true };
  if (run.completedLanes?.includes("rag")) return { ready: true, complete: true };
  return { waiting: true, live: true, status: "waiting" };
}

const edgePresentation = {
  "llm->rag-query": { lane: "rag", label: "并行检索 · Parallel Retrieval", x: 712, y: 178 },
  "llm->tools-group": { lane: "tools", label: "并行工具准备 · Parallel Tool Prep", x: 610, y: 520 },
  "tools-group->action": { label: "无依赖：直接执行 · Independent: Continue", x: 1070, y: 576 },
  "rag-context-assembly->llm": { callback: true, label: "上下文回传 · Context Callback", x: 860, y: 492 },
  "observation->llm": { callback: true, label: "观察回传 · Observation Callback", x: 1190, y: 492 },
  "observation->planning": { label: "评估失败：重规划 · Replan on Failure", x: 800, y: 548 },
};

function appendRelationLabel(layer, key, label, x, y) {
  const width = Math.min(255, Math.max(72, label.length * 5.4));
  const group = svg("g", { class: "relation-label", "data-relation-label-for": key, transform: `translate(${x} ${y})` });
  group.append(svg("rect", { x: -width / 2, y: -11, width, height: 16, rx: 6 }));
  const text = svg("text", { x: 0, y: 1, "text-anchor": "middle" });
  text.textContent = label;
  group.append(text);
  layer.append(group);
}

function createEndpointResolver(graph, projectionNodes = []) {
  const endpoints = new Map();
  const register = (id, bounds) => {
    if (!id || !bounds || endpoints.has(id)) throw new Error(`Invalid or duplicate reference endpoint: ${id}`);
    endpoints.set(id, bounds);
  };

  register(graph.systemBoundary.id, graph.systemBoundary.bounds);
  for (const group of graph.groups) register(group.id, group.bounds);
  for (const detail of graph.detailNodes) register(detail.id, detail.bounds);
  for (const node of graph.nodes) register(node.id, node.referencePosition);
  for (const projection of projectionNodes) register(projection.id, projection.bounds);

  return (id) => {
    const bounds = endpoints.get(id);
    if (!bounds) throw new Error(`Unknown reference endpoint: ${id}`);
    return bounds;
  };
}

const polyline = (start, waypoints, end) => `M ${start.x} ${start.y} ${[...waypoints, end].map((point) => `L ${point.x} ${point.y}`).join(" ")}`;

function routePath(edge, resolve) {
  const key = topologyEdgeKey(edge);
  const from = resolve(edge.from);
  const to = resolve(edge.to);
  const fromCenter = center(from);
  const toCenter = center(to);
  const direct = () => {
    const start = boundaryToward(from, toCenter);
    const end = boundaryToward(to, fromCenter);
    return { d: `M ${start.x} ${start.y} L ${end.x} ${end.y}`, start };
  };

  if (key === "planning->llm") {
    const start = pointOnSide(from, "top");
    const end = pointOnSide(to, "bottom", .38);
    return { d: `M ${start.x} ${start.y} C ${start.x} ${start.y - 22}, ${end.x - 24} ${end.y + 18}, ${end.x} ${end.y}`, start };
  }
  if (key === "memory->llm") {
    const start = pointOnSide(from, "top");
    const end = pointOnSide(to, "bottom", .72);
    return { d: `M ${start.x} ${start.y} C ${start.x} ${start.y - 26}, ${end.x + 28} ${end.y + 18}, ${end.x} ${end.y}`, start };
  }
  if (key === "rag-context-assembly->llm") {
    const core = resolve("core-group");
    const rag = resolve("rag-group");
    const corridorX = (core.x + core.w + rag.x) / 2;
    const corridorY = rag.y + rag.h + 20;
    const start = pointOnSide(from, "left");
    const end = pointOnSide(to, "right");
    return { d: polyline(start, [{ x: corridorX, y: corridorY }, { x: corridorX, y: end.y }], end), start };
  }
  if (key === "observation->llm") {
    const system = resolve("agent-system");
    const core = resolve("core-group");
    const rag = resolve("rag-group");
    const outerX = system.x + system.w - 40;
    const corridorX = (core.x + core.w + rag.x) / 2;
    const corridorY = rag.y + rag.h + 20;
    const start = pointOnSide(from, "right");
    const end = pointOnSide(to, "right");
    return { d: polyline(start, [{ x: outerX, y: start.y }, { x: outerX, y: corridorY }, { x: corridorX, y: corridorY }, { x: corridorX, y: end.y }], end), start };
  }
  if (key === "observation->planning") {
    const rag = resolve("rag-group");
    const start = pointOnSide(from, "left");
    const end = pointOnSide(to, "bottom");
    const corridorY = rag.y + rag.h + 20;
    return { d: polyline(start, [{ x: start.x - 45, y: corridorY }, { x: end.x, y: corridorY }], end), start };
  }
  if (key === "memory->action") {
    const rag = resolve("rag-group");
    const start = pointOnSide(from, "bottom");
    const end = pointOnSide(to, "top");
    const corridorY = rag.y + rag.h + 20;
    return { d: polyline(start, [{ x: start.x, y: corridorY }, { x: end.x, y: corridorY }], end), start };
  }
  if (key === "llm->final-response") {
    const core = resolve("core-group");
    const start = pointOnSide(from, "left");
    const end = pointOnSide(to, "right");
    const corridorX = core.x - 50;
    return { d: polyline(start, [{ x: corridorX, y: start.y }, { x: corridorX, y: end.y }], end), start };
  }
  if (key === "llm->rag-query") {
    const core = resolve("core-group");
    const rag = resolve("rag-group");
    const start = pointOnSide(from, "right");
    const end = pointOnSide(to, "left");
    const corridorX = (core.x + core.w + rag.x) / 2;
    return { d: polyline(start, [{ x: corridorX, y: start.y }, { x: corridorX, y: end.y }], end), start };
  }
  if (key === "llm->tools-group") {
    const core = resolve("core-group");
    const rag = resolve("rag-group");
    const start = pointOnSide(from, "right");
    const end = pointOnSide(to, "top");
    const corridorX = (core.x + core.w + rag.x) / 2;
    const corridorY = rag.y + rag.h + 20;
    return { d: polyline(start, [{ x: corridorX, y: start.y }, { x: corridorX, y: corridorY }, { x: end.x, y: corridorY }], end), start };
  }
  if (key === "tools-group->action") {
    const start = pointOnSide(from, "top", .66);
    const end = pointOnSide(to, "top");
    return { d: polyline(start, [{ x: start.x, y: end.y - 15 }, { x: end.x, y: end.y - 15 }], end), start };
  }
  if (edge.from === "rag-routing" && ["embedding-vectorization", "keyword-search", "rag-web-search"].includes(edge.to)) {
    const start = pointOnSide(from, "bottom");
    const end = pointOnSide(to, "top");
    const corridorY = (from.y + from.h + to.y) / 2;
    return { d: polyline(start, [{ x: start.x, y: corridorY }, { x: end.x, y: corridorY }], end), start };
  }
  if (["vector-top-k", "database-top-k", "web-top-k"].includes(edge.from) && edge.to === "result-merge-deduplicate") {
    const start = pointOnSide(from, "bottom");
    const end = pointOnSide(to, "top");
    const corridorY = (from.y + from.h + to.y) / 2;
    return { d: polyline(start, [{ x: start.x, y: corridorY }, { x: end.x, y: corridorY }], end), start };
  }
  return direct();
}

function retryPath(resolve) {
  const from = resolve("observation");
  const to = resolve("action");
  const start = pointOnSide(from, "bottom");
  const end = pointOnSide(to, "bottom");
  const bendY = Math.min(resolve("guardrails").y - 14, Math.max(start.y, end.y) + 52);
  return { d: `M ${start.x} ${start.y} C ${start.x} ${bendY}, ${end.x} ${bendY}, ${end.x} ${end.y}`, start };
}

function appendMarkers(root) {
  const defs = svg("defs");
  const marker = svg("marker", { id: "arrow", viewBox: "0 0 8 8", refX: 7, refY: 4, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" });
  marker.append(svg("path", { d: "M 0 0 L 8 4 L 0 8 z", class: "edge-arrow" }));
  defs.append(marker);
  root.append(defs);
}

function applyVisualState(element, state) {
  if (state.live) element.classList.add("is-live", `is-${state.status ?? "running"}`);
  if (state.complete) element.classList.add("is-complete");
  if (state.skipped) element.classList.add("is-skipped");
  if (state.status && !state.live && !state.complete && !state.skipped) element.classList.add(`is-${state.status}`);
}

function renderPanel(item, type, state = {}) {
  const { x, y, w, h } = item.bounds;
  const attributes = {
    transform: `translate(${x} ${y})`,
    role: "group",
    "aria-label": `${item.label.zh} ${item.label.en}`,
  };
  if (type === "system") attributes["data-system-boundary"] = item.id;
  else attributes["data-group-id"] = item.id;
  const group = svg("g", attributes);
  group.classList.add(type === "system" ? "system-boundary" : "reference-group");
  if (type === "group") group.classList.add(`parent-${item.parentId}`, `layout-${item.layout}`);
  applyVisualState(group, state);
  group.append(svg("rect", { width: w, height: h, rx: type === "system" ? 20 : 14 }));
  const title = svg("text", { x: 14, y: 20, class: "primary-label group-title" });
  title.textContent = item.label.zh;
  const support = svg("text", { x: 14, y: 33, class: "group-en", "font-size": 9 });
  support.textContent = item.label.en;
  group.append(title, support);
  return group;
}

function renderDetailNode(detail, state, isEndpoint) {
  const { x, y, w, h } = detail.bounds;
  const group = svg("g", {
    "data-detail-node-id": detail.id,
    transform: `translate(${x} ${y})`,
    role: "group",
    "aria-label": `${detail.label.zh} ${detail.label.en}${detail.description ? ` ${detail.description.zh} ${detail.description.en}` : ""}`,
  });
  group.classList.add("detail-node", `in-${detail.groupId}`);
  applyVisualState(group, state);
  if (isEndpoint) group.classList.add("is-relation-endpoint");
  group.append(svg("rect", { width: w, height: h, rx: h > 30 ? 8 : 5 }));

  if (detail.description) {
    const label = svg("text", { x: w / 2, y: 13, "text-anchor": "middle", class: "detail-label" });
    label.textContent = detail.label.zh;
    const support = svg("text", { x: w / 2, y: 22, "text-anchor": "middle", class: "detail-en" });
    support.textContent = detail.label.en;
    const zh = svg("text", { x: w / 2, y: 32, "text-anchor": "middle", class: "detail-description" });
    zh.textContent = detail.description.zh;
    const en = svg("text", { x: w / 2, y: 41, "text-anchor": "middle", class: "detail-description detail-description--en" });
    en.textContent = detail.description.en;
    group.append(label, support, zh, en);
  } else {
    const zh = svg("text", { x: w / 2, y: 10, "text-anchor": "middle", class: "detail-label" });
    zh.textContent = detail.label.zh;
    const en = svg("text", { x: w / 2, y: 18, "text-anchor": "middle", class: "detail-en" });
    en.textContent = detail.label.en;
    group.append(zh, en);
  }
  return group;
}

function renderExecutableNode(node, state, isEndpoint) {
  const { x, y, w, h } = node.referencePosition;
  const status = state.status;
  const suffix = status ? ` · ${statusLabels[status] ?? status}` : "";
  const group = svg("g", {
    "data-node-id": node.id,
    transform: `translate(${x} ${y})`,
    role: "group",
    "aria-label": `${node.label.zh} ${node.label.en}${suffix}`,
  });
  group.classList.add("graph-node", `node-${node.kind}`);
  applyVisualState(group, state);
  if (isEndpoint) group.classList.add("is-relation-endpoint");

  const proxy = !visibleExecutableIds.has(node.id);
  if (proxy) group.classList.add("graph-node--proxy");
  group.append(svg("rect", { width: w, height: h, rx: Math.min(10, h / 4) }));
  if (!proxy) {
    const zh = svg("text", { x: w / 2, y: 17, "text-anchor": "middle", class: "primary-label node-label" });
    zh.textContent = node.label.zh;
    const en = svg("text", { x: w / 2, y: 31, "text-anchor": "middle", class: "node-en" });
    en.textContent = node.label.en;
    group.append(zh, en);
    if (status) {
      const statusText = svg("text", { x: w / 2, y: h - 4, "text-anchor": "middle", class: "status-label" });
      statusText.textContent = statusLabels[status] ?? status;
      group.append(statusText);
    }
  }
  return group;
}

function edgePulse({ key, edgeId, pathData, start, topology = true }) {
  const attributes = { class: "edge-pulse", "aria-hidden": true };
  if (topology) attributes["data-topology-edge-pulse-for"] = key;
  if (edgeId) attributes["data-edge-pulse-for"] = edgeId;
  const pulse = svg("g", attributes);
  const moving = svg("circle", { class: "edge-pulse__moving", r: 3.5 });
  moving.append(svg("animateMotion", { path: pathData, dur: "1.2s", repeatCount: "indefinite" }));
  const staticPulse = svg("circle", { class: "edge-pulse__static", cx: start.x, cy: start.y, r: 3.5 });
  pulse.append(moving, staticPulse);
  return pulse;
}

function relationEndpoints(graph, run, currentEvent) {
  const endpoints = new Set();
  if (currentEvent?.relation === "callback" && currentEvent.targetNodeId) {
    endpoints.add(currentEvent.nodeId);
    endpoints.add(currentEvent.targetNodeId);
  } else {
    const entry = run.trace.at(-1);
    if (entry && entry.relation !== "complete") {
      const source = graph.events.find((event) => event.id === entry.from)?.nodeId;
      const target = graph.events.find((event) => event.id === entry.to)?.nodeId;
      if (source) endpoints.add(source);
      if (target) endpoints.add(target);
    }
  }
  for (const id of [...endpoints]) for (const alias of detailEndpointAliases.get(id) ?? []) endpoints.add(alias);
  return endpoints;
}

export function renderGraph(container, { graph, run }) {
  const root = svg("svg", { viewBox: "0 0 1400 800", preserveAspectRatio: "xMidYMid meet", role: "group", "aria-label": "Agent 架构与执行路径" });
  root.classList.add("architecture-graph");
  appendMarkers(root);

  const contextGate = contextGateProjection(graph);
  const resolve = createEndpointResolver(graph, [contextGate]);
  const currentEvent = graph.events.find((event) => event.id === run.currentEventId);
  const endpoints = relationEndpoints(graph, run, currentEvent);
  const systemLayer = svg("g", { "data-layer": "system-boundary" });
  const groupsLayer = svg("g", { "data-layer": "groups" });
  const edgesLayer = svg("g", { "data-layer": "topology-edges" });
  const nodesLayer = svg("g", { "data-layer": "nodes" });
  const guardrailsLayer = svg("g", { "data-layer": "guardrails" });
  const pulsesLayer = svg("g", { "data-layer": "live-pulses" });
  root.append(systemLayer, groupsLayer, edgesLayer, nodesLayer, guardrailsLayer, pulsesLayer);

  systemLayer.append(renderPanel(graph.systemBoundary, "system"));
  for (const group of graph.groups) groupsLayer.append(renderPanel(group, "group", referenceVisualState(graph, run, group.id)));

  for (const edge of graph.topologyEdges) {
    const key = topologyEdgeKey(edge);
    const meta = topologyEdgeMeta(edge);
    const state = referenceEdgeState(graph, run, edge);
    const route = routePath(edge, resolve);
    const attributes = {
      d: route.d,
      "data-topology-edge": key,
      "data-from": edge.from,
      "data-to": edge.to,
      "marker-end": "url(#arrow)",
      "aria-label": edgePresentation[key]?.label ?? relationLabels[state.relation] ?? `流向 ${edge.from} 到 ${edge.to}`,
    };
    if (meta.edgeId) attributes["data-edge-id"] = meta.edgeId;
    if (meta.branch) attributes["data-branch"] = meta.branch;
    const path = svg("path", attributes);
    path.classList.add("graph-edge", `edge-${state.relation ?? "topology"}`);
    if (state.relation) path.classList.add(`is-${state.relation}`);
    if (meta.feedback) path.classList.add("is-feedback", "is-nonlinear");
    const presentation = edgePresentation[key];
    if (presentation?.lane) {
      path.classList.add("is-parallel-lane");
      path.dataset.fanoutOrigin = "llm";
      path.dataset.lane = presentation.lane;
    }
    if (presentation?.callback) path.classList.add("is-callback");
    if (key === "orchestrator->llm") path.classList.add("feeds-parallel-fanout");
    if (state.live) path.classList.add("is-live");
    if (state.complete) path.classList.add("is-complete");
    if (state.skipped) path.classList.add("is-skipped");
    edgesLayer.append(path);
    if (presentation?.label) appendRelationLabel(edgesLayer, key, presentation.label, presentation.x, presentation.y);
    if (state.live) pulsesLayer.append(edgePulse({ key, edgeId: meta.edgeId, pathData: route.d, start: route.start }));
  }

  const retryEdge = graph.edges.find((edge) => edge.id === "e18");
  if (retryEdge) {
    const selectedBranches = run.selectedBranches ?? run.activeBranches ?? [];
    const completedEdgeIds = completedEdgeIdsForTrace(graph, run.trace);
    const transitionEdgeIds = activeTransitionEdgeIds(graph, run.trace);
    const live = isCurrentLiveEdge(currentEvent, retryEdge, selectedBranches, run.completedBranches) || transitionEdgeIds.has(retryEdge.id);
    const route = retryPath((id) => id === "guardrails" ? graph.guardrails.bounds : resolve(id));
    const retry = svg("path", {
      d: route.d,
      "data-edge-id": retryEdge.id,
      "data-runtime-edge": "observation->action",
      "marker-end": "url(#arrow)",
      "aria-label": relationLabels.retry,
    });
    retry.classList.add("graph-edge", "edge-retry", "is-retry", "is-feedback", "is-nonlinear");
    if (live) retry.classList.add("is-live");
    if (completedEdgeIds.has(retryEdge.id)) retry.classList.add("is-complete");
    edgesLayer.append(retry);
    appendRelationLabel(edgesLayer, retryEdge.id, relationLabels.retry, 1080, 726);
    if (live) pulsesLayer.append(edgePulse({ key: retryEdge.id, edgeId: retryEdge.id, pathData: route.d, start: route.start, topology: false }));
  }

  const dependencyRoutes = [
    {
      key: "rag-context-assembly->context-dependency-gate",
      from: "rag-context-assembly",
      to: CONTEXT_GATE_ID,
      label: "需要上下文 · Context required",
    },
    {
      key: "context-dependency-gate->action",
      from: CONTEXT_GATE_ID,
      to: "action",
      label: "就绪后执行 · Execute when ready",
    },
  ];
  const gateState = contextGateState(run);
  for (const dependency of dependencyRoutes) {
    const route = routePath(dependency, resolve);
    const path = svg("path", {
      d: route.d,
      "data-projection-edge": dependency.key,
      "data-from": dependency.from,
      "data-to": dependency.to,
      "marker-end": "url(#arrow)",
      "aria-label": dependency.label,
    });
    path.classList.add("graph-edge", "is-context-dependency", "is-feedback");
    if (dependency.to === CONTEXT_GATE_ID && gateState.ready) path.classList.add("is-complete");
    if (dependency.from === CONTEXT_GATE_ID && (gateState.ready || gateState.independent)) path.classList.add("is-live");
    edgesLayer.append(path);
    if (path.classList.contains("is-live")) pulsesLayer.append(edgePulse({ key: dependency.key, pathData: route.d, start: route.start }));
  }

  for (const detail of graph.detailNodes) {
    nodesLayer.append(renderDetailNode(detail, referenceVisualState(graph, run, detail.id), endpoints.has(detail.id)));
  }
  const renderedGate = renderDetailNode(contextGate, gateState, false);
  renderedGate.dataset.layoutSource = "tools-group";
  renderedGate.classList.add("context-gate");
  if (gateState.waiting) renderedGate.classList.add("is-waiting");
  if (gateState.ready) renderedGate.classList.add("is-ready");
  if (gateState.independent) renderedGate.classList.add("is-independent");
  nodesLayer.append(renderedGate);
  for (const node of graph.nodes) {
    nodesLayer.append(renderExecutableNode(node, referenceVisualState(graph, run, node.id), endpoints.has(node.id)));
  }

  const guardrails = renderPanel({ ...graph.guardrails, label: graph.guardrails.label }, "group");
  guardrails.removeAttribute("data-group-id");
  guardrails.classList.remove("reference-group", "parent-undefined", "layout-undefined");
  guardrails.classList.add("guardrails-band");
  guardrails.setAttribute("aria-label", `${graph.guardrails.label.zh} ${graph.guardrails.label.en}`);
  guardrails.querySelector(".group-title").textContent = `${graph.guardrails.label.zh} · ${graph.guardrails.label.en}`;
  guardrails.querySelector(".group-title").setAttribute("x", graph.guardrails.bounds.w / 2);
  guardrails.querySelector(".group-title").setAttribute("y", 30);
  guardrails.querySelector(".group-title").setAttribute("text-anchor", "middle");
  guardrails.querySelector(".group-en").remove();
  guardrailsLayer.append(guardrails);

  container.replaceChildren(root);
}
