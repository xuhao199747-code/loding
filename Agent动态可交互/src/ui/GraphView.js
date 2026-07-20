import {
  activeTransitionEdgeIds,
  completedEdgeIdsForTrace,
  isCurrentLiveEdge,
  referenceEdgeState,
  referenceVisualState,
  topologyEdgeKey,
  topologyEdgeMeta,
} from "./traceEdges.js";
import { createRoutingContext, routeRetryEdge, routeTopologyEdge } from "./edgeRouting.js";

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
const focusAliases = new Map(Object.entries({
  planning: "planning-subgoals",
  memory: "memory-short-term",
  "rag-route": "rag-routing",
  "vector-search": "vector-store-retrieval",
  "web-search": "rag-web-search",
  "rag-merge": "result-merge-deduplicate",
  "rag-context": "rag-context-assembly",
  "tool-select": "external-environment-business-system",
}));

const svg = (tag, attributes = {}) => {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  return element;
};

function contextGateState(run) {
  if (!run.activeLanes?.includes("tools")) return {};
  if (!run.contextRequired) return { independent: true };
  if (run.completedLanes?.includes("rag")) return { ready: true, complete: true };
  return { waiting: true, live: true, status: "waiting" };
}

const edgePresentation = {
  "llm->rag-query": { lane: "rag" },
  "llm->tools-group": { lane: "tools" },
  "rag-context-assembly->llm": { callback: true },
  "observation->llm": { callback: true },
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

function relatedEndpointIds(id) {
  const ids = new Set([id]);
  for (const [executableId, aliases] of detailEndpointAliases) {
    if (executableId === id || aliases.includes(id)) {
      ids.add(executableId);
      for (const alias of aliases) ids.add(alias);
    }
  }
  return ids;
}

function setNeighborhoodEmphasis(root, id, active) {
  for (const element of root.querySelectorAll(".is-inspected, .is-related, .is-context-dimmed")) {
    element.classList.remove("is-inspected", "is-related", "is-context-dimmed");
  }
  if (!active) return;

  const endpoints = relatedEndpointIds(id);
  const neighbors = new Set(endpoints);
  const relatedEdges = new Set();
  for (const edge of root.querySelectorAll(".graph-edge[data-from][data-to]")) {
    const related = endpoints.has(edge.dataset.from) || endpoints.has(edge.dataset.to);
    edge.classList.toggle("is-related", related);
    edge.classList.toggle("is-context-dimmed", !related);
    if (related) {
      relatedEdges.add(edge.dataset.topologyEdge ?? edge.dataset.projectionEdge ?? edge.dataset.edgeId);
      neighbors.add(edge.dataset.from);
      neighbors.add(edge.dataset.to);
    }
  }

  for (const node of root.querySelectorAll("[data-node-id], [data-detail-node-id]")) {
    const nodeId = node.dataset.nodeId ?? node.dataset.detailNodeId;
    const inspected = endpoints.has(nodeId);
    node.classList.toggle("is-inspected", inspected);
    node.classList.toggle("is-related", !inspected && neighbors.has(nodeId));
    node.classList.toggle("is-context-dimmed", !neighbors.has(nodeId));
  }
  for (const label of root.querySelectorAll("[data-relation-label-for]")) {
    label.classList.toggle("is-related", relatedEdges.has(label.dataset.relationLabelFor));
    label.classList.toggle("is-context-dimmed", !relatedEdges.has(label.dataset.relationLabelFor));
  }
}

function makeInteractive(group, item, type, root, onNodeSelect) {
  group.setAttribute("role", "button");
  group.setAttribute("tabindex", "-1");
  const selection = { ...item, type };
  const inspect = () => setNeighborhoodEmphasis(root, item.id, true);
  const clear = () => setNeighborhoodEmphasis(root, item.id, false);
  group.addEventListener("mouseenter", inspect);
  group.addEventListener("mouseleave", clear);
  group.addEventListener("pointerenter", inspect);
  group.addEventListener("pointerleave", clear);
  group.addEventListener("focus", inspect);
  group.addEventListener("blur", clear);
  group.addEventListener("click", () => onNodeSelect?.(selection));
  group.addEventListener("keydown", (event) => {
    if (!["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    onNodeSelect?.(selection);
  });
}

function configureRovingFocus(root, currentEvent) {
  const nodes = [...root.querySelectorAll('[role="button"]')];
  if (!nodes.length) return;
  const currentId = currentEvent?.nodeId;
  const alias = focusAliases.get(currentId);
  const initial = root.querySelector(`[data-node-id="${currentId}"][role="button"]`)
    ?? (alias ? root.querySelector(`[data-detail-node-id="${alias}"]`) : null)
    ?? nodes[0];

  const selectTabStop = (selected) => {
    for (const node of nodes) node.setAttribute("tabindex", node === selected ? "0" : "-1");
  };
  selectTabStop(initial);

  for (const [index, node] of nodes.entries()) {
    node.addEventListener("focus", () => selectTabStop(node));
    node.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"].includes(event.key)) return;
      event.preventDefault();
      const targetIndex = event.key === "Home"
        ? 0
        : event.key === "End"
          ? nodes.length - 1
          : (index + (["ArrowRight", "ArrowDown"].includes(event.key) ? 1 : -1) + nodes.length) % nodes.length;
      nodes[targetIndex].focus();
    });
  }
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

function renderDetailNode(detail, state, isEndpoint, interaction) {
  const { x, y, w, h } = detail.bounds;
  const group = svg("g", {
    "data-detail-node-id": detail.id,
    transform: `translate(${x} ${y})`,
    role: "button",
    tabindex: 0,
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
  makeInteractive(group, detail, "detail", interaction.root, interaction.onNodeSelect);
  return group;
}

function renderExecutableNode(node, state, isEndpoint, interaction) {
  const { x, y, w, h } = node.referencePosition;
  const status = state.status;
  const suffix = status ? ` · ${statusLabels[status] ?? status}` : "";
  const proxy = !visibleExecutableIds.has(node.id);
  const group = svg("g", {
    "data-node-id": node.id,
    transform: `translate(${x} ${y})`,
    ...(proxy
      ? { "aria-hidden": "true" }
      : { role: "button", tabindex: 0, "aria-label": `${node.label.zh} ${node.label.en}${suffix}` }),
  });
  group.classList.add("graph-node", `node-${node.kind}`);
  applyVisualState(group, state);
  if (isEndpoint) group.classList.add("is-relation-endpoint");

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
  if (!proxy) makeInteractive(group, node, "executable", interaction.root, interaction.onNodeSelect);
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

export function renderGraph(container, { graph, run, onNodeSelect }) {
  const root = svg("svg", { viewBox: "0 0 1400 800", preserveAspectRatio: "xMidYMid meet", role: "group", "aria-label": "Agent 架构与执行路径", "aria-describedby": "graph-keyboard-help" });
  root.classList.add("architecture-graph");
  const keyboardHelp = svg("desc", { id: "graph-keyboard-help" });
  keyboardHelp.textContent = "Tab 进入主图，方向键浏览节点，Enter 或空格查看详情。Tab into the graph, use Arrow keys to browse nodes, and Enter or Space to open details.";
  root.append(keyboardHelp);
  appendMarkers(root);

  const routingContext = createRoutingContext(graph);
  const contextGate = routingContext.contextGate;
  const resolve = routingContext.resolve;
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
    const route = routeTopologyEdge(edge, routingContext);
    const attributes = {
      d: route.d,
      "data-topology-edge": key,
      "data-from": edge.from,
      "data-to": edge.to,
      "marker-end": "url(#arrow)",
      "aria-label": route.label?.text ?? relationLabels[state.relation] ?? `流向 ${edge.from} 到 ${edge.to}`,
      "data-route-kind": route.kind,
    };
    if (route.corridor) attributes["data-route-corridor"] = route.corridor;
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
    if (route.label) appendRelationLabel(edgesLayer, key, route.label.text, route.label.x, route.label.y);
    if (state.live) pulsesLayer.append(edgePulse({ key, edgeId: meta.edgeId, pathData: route.d, start: route.start }));
  }

  const retryEdge = graph.edges.find((edge) => edge.id === "e18");
  if (retryEdge) {
    const selectedBranches = run.selectedBranches ?? run.activeBranches ?? [];
    const completedEdgeIds = completedEdgeIdsForTrace(graph, run.trace);
    const transitionEdgeIds = activeTransitionEdgeIds(graph, run.trace);
    const live = isCurrentLiveEdge(currentEvent, retryEdge, selectedBranches, run.completedBranches) || transitionEdgeIds.has(retryEdge.id);
    const route = routeRetryEdge(routingContext);
    const retry = svg("path", {
      d: route.d,
      "data-edge-id": retryEdge.id,
      "data-runtime-edge": "observation->action",
      "marker-end": "url(#arrow)",
      "aria-label": relationLabels.retry,
      "data-route-kind": route.kind,
      "data-route-corridor": route.corridor,
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
    const route = routeTopologyEdge(dependency, routingContext);
    const path = svg("path", {
      d: route.d,
      "data-projection-edge": dependency.key,
      "data-from": dependency.from,
      "data-to": dependency.to,
      "marker-end": "url(#arrow)",
      "aria-label": dependency.label,
      "data-route-kind": route.kind,
      "data-route-corridor": route.corridor,
    });
    path.classList.add("graph-edge", "is-context-dependency", "is-feedback");
    if (dependency.to === CONTEXT_GATE_ID && gateState.ready) path.classList.add("is-complete");
    if (dependency.from === CONTEXT_GATE_ID && (gateState.ready || gateState.independent)) path.classList.add("is-live");
    edgesLayer.append(path);
    if (path.classList.contains("is-live")) pulsesLayer.append(edgePulse({ key: dependency.key, pathData: route.d, start: route.start }));
  }

  for (const detail of graph.detailNodes) {
    nodesLayer.append(renderDetailNode(detail, referenceVisualState(graph, run, detail.id), endpoints.has(detail.id), { root, onNodeSelect }));
  }
  const renderedGate = renderDetailNode(contextGate, gateState, false, { root, onNodeSelect });
  renderedGate.dataset.layoutSource = "tools-group";
  renderedGate.classList.add("context-gate");
  if (gateState.waiting) renderedGate.classList.add("is-waiting");
  if (gateState.ready) renderedGate.classList.add("is-ready");
  if (gateState.independent) renderedGate.classList.add("is-independent");
  nodesLayer.append(renderedGate);
  for (const node of graph.nodes) {
    nodesLayer.append(renderExecutableNode(node, referenceVisualState(graph, run, node.id), endpoints.has(node.id), { root, onNodeSelect }));
  }
  configureRovingFocus(root, currentEvent);

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
