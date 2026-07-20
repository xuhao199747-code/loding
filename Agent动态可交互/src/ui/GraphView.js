import { completedEdgeIdsForTrace, isCurrentLiveEdge } from "./traceEdges.js";

const SVG_NS = "http://www.w3.org/2000/svg";
const statusLabels = {
  waiting: "等待 · Waiting", paused: "暂停 · Paused", running: "执行中 · Running", success: "成功 · Success",
  completed: "完成 · Completed", failed: "失败 · Failed", skipped: "跳过 · Skipped", blocked: "已阻塞 · Blocked",
  retrying: "重试中 · Retrying", cancelled: "已取消 · Cancelled", partial: "部分完成 · Partial",
};
const relationLabels = { callback: "回传 ↑ Callback", retry: "重试 ↻ Retry", replan: "重规划 ↶ Replan" };
const svg = (tag, attributes = {}) => {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  return element;
};
const nodeCenter = (node) => ({ x: node.x + 65, y: node.y + 29 });

function nodeBoundaryPoints(fromNode, toNode) {
  const from = nodeCenter(fromNode);
  const to = nodeCenter(toNode);
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const boundaryScale = Math.min(65 / Math.abs(dx || 1), 29 / Math.abs(dy || 1));
  const reverseScale = Math.min(65 / Math.abs(dx || 1), 29 / Math.abs(dy || 1));

  return {
    from: { x: from.x + dx * boundaryScale, y: from.y + dy * boundaryScale },
    to: { x: to.x - dx * reverseScale, y: to.y - dy * reverseScale },
  };
}

function edgePath(edge, nodes) {
  const { from, to } = nodeBoundaryPoints(nodes.get(edge.from), nodes.get(edge.to));
  if (["callback", "replan", "retry"].includes(edge.type)) {
    const bend = Math.max(54, Math.abs(to.x - from.x) * .28);
    return `M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${Math.min(from.y, to.y) - bend} ${to.x} ${to.y}`;
  }
  return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
}

function appendMarkers(root) {
  const defs = svg("defs");
  const marker = svg("marker", { id: "arrow", viewBox: "0 0 8 8", refX: 7, refY: 4, markerWidth: 6, markerHeight: 6, orient: "auto-start-reverse" });
  marker.append(svg("path", { d: "M 0 0 L 8 4 L 0 8 z", class: "edge-arrow" }));
  defs.append(marker); root.append(defs);
}

function branchStatus(graph, run, nodeId) {
  const selectedBranches = run.selectedBranches ?? run.activeBranches ?? [];
  const branch = graph.edges.find((edge) => edge.branch && edge.to === nodeId)?.branch;
  if (!branch) return null;
  if (selectedBranches.includes(branch)) return run.completedBranches.includes(branch) ? "success" : "running";
  return selectedBranches.length ? "skipped" : null;
}

function relationEndpoints(graph, run, currentEvent) {
  if (currentEvent?.relation === "callback" && currentEvent.targetNodeId) return new Set([currentEvent.nodeId, currentEvent.targetNodeId]);
  const entry = run.trace.at(-1);
  if (!entry || entry.relation === "complete") return new Set();
  const source = graph.events.find((event) => event.id === entry.from)?.nodeId;
  const target = graph.events.find((event) => event.id === entry.to)?.nodeId;
  return new Set([source, target].filter(Boolean));
}

export function renderGraph(container, { graph, run, onNodeSelect = () => {} }) {
  const root = svg("svg", { viewBox: "0 0 1200 800", preserveAspectRatio: "xMidYMid meet", role: "group", "aria-label": "Agent 架构与执行路径" });
  root.classList.add("architecture-graph");
  appendMarkers(root);
  const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
  const currentEvent = graph.events.find((event) => event.id === run.currentEventId);
  const selectedBranches = run.selectedBranches ?? run.activeBranches ?? [];
  const completedEvents = run.trace.map((entry) => graph.events.find((event) => event.id === entry.from)).filter(Boolean);
  const completedEdgeIds = completedEdgeIdsForTrace(graph, run.trace);
  const completedNodeIds = new Set(completedEvents.map((event) => event.nodeId));
  const endpoints = relationEndpoints(graph, run, currentEvent);
  const modulesLayer = svg("g", { "data-layer": "modules" });
  const edgesLayer = svg("g", { "data-layer": "edges" });
  const nodesLayer = svg("g", { "data-layer": "nodes" });
  root.append(modulesLayer, edgesLayer, nodesLayer);

  for (const module of graph.modules) {
    const group = svg("g", { "data-module-id": module.id, transform: `translate(${module.x} ${module.y})` });
    group.classList.add("graph-module");
    group.append(svg("rect", { width: module.w, height: module.h, rx: 18 }));
    const title = svg("text", { x: 16, y: 28, class: "primary-label" }); title.textContent = module.label.zh; group.append(title);
    const support = svg("text", { x: 16, y: 45, class: "module-en", "font-size": 10 }); support.textContent = module.label.en; group.append(support);
    modulesLayer.append(group);
  }

  for (const edge of graph.edges) {
    const path = svg("path", { d: edgePath(edge, nodes), "data-edge-id": edge.id, "marker-end": "url(#arrow)", "aria-label": relationLabels[edge.type] ?? `流向 ${edge.from} 到 ${edge.to}` });
    path.classList.add("graph-edge", `edge-${edge.type}`, `is-${edge.type}`);
    if (relationLabels[edge.type]) path.classList.add("is-nonlinear");
    if (isCurrentLiveEdge(currentEvent, edge, selectedBranches, run.completedBranches)) path.classList.add("is-live");
    if (completedEdgeIds.has(edge.id)) path.classList.add("is-complete");
    if (edge.branch && run.completedBranches.includes(edge.branch)) path.classList.add("is-complete");
    if (edge.branch && selectedBranches.length && !selectedBranches.includes(edge.branch)) path.classList.add("is-skipped");
    edgesLayer.append(path);
    if (relationLabels[edge.type]) {
      const from = nodeCenter(nodes.get(edge.from)); const to = nodeCenter(nodes.get(edge.to));
      const label = svg("text", { class: "relation-label", x: (from.x + to.x) / 2, y: Math.min(from.y, to.y) - 20, "text-anchor": "middle" });
      label.textContent = edge.type === "replan" && run.trace.at(-1)?.relation === "replan" ? `${relationLabels[edge.type]} · ${run.trace.at(-1).reason ?? ""}` : relationLabels[edge.type];
      edgesLayer.append(label);
    }
  }

  const retryTrace = run.trace.at(-1);
  if (retryTrace?.relation === "retry" && retryTrace.from === retryTrace.to) {
    const node = nodes.get(graph.events.find((event) => event.id === retryTrace.from)?.nodeId);
    if (node) {
      const loop = svg("path", { class: "retry-loop", d: `M ${node.x + 108} ${node.y + 12} C ${node.x + 160} ${node.y - 34}, ${node.x + 160} ${node.y + 80}, ${node.x + 108} ${node.y + 46}`, "marker-end": "url(#arrow)", "aria-label": `重试 Attempt ${retryTrace.iteration}` });
      edgesLayer.append(loop);
    }
  }

  for (const node of graph.nodes) {
    const status = node.id === run.currentNodeId ? run.status : branchStatus(graph, run, node.id) ?? (completedNodeIds.has(node.id) ? "completed" : null);
    const suffix = status ? ` · ${statusLabels[status] ?? status}` : "";
    const group = svg("g", { "data-node-id": node.id, transform: `translate(${node.x} ${node.y})`, tabindex: 0, role: "button", "aria-label": `${node.label.zh} ${node.label.en}${suffix}` });
    group.classList.add("graph-node", `node-${node.kind}`);
    if (node.id === run.currentNodeId) group.classList.add("is-live", `is-${run.status}`);
    if (endpoints.has(node.id)) group.classList.add("is-relation-endpoint");
    if (completedNodeIds.has(node.id) && !status) group.classList.add("is-complete");
    if (status && node.id !== run.currentNodeId) group.classList.add(`is-${status}`);
    const rect = svg("rect", { width: 130, height: 58, rx: 10 });
    const zh = svg("text", { x: 65, y: 25, "text-anchor": "middle", class: "primary-label" }); zh.textContent = node.label.zh;
    const en = svg("text", { x: 65, y: 42, "text-anchor": "middle", class: "node-en" }); en.textContent = node.label.en;
    group.append(rect, zh, en);
    if (status) {
      const statusText = svg("text", { x: 65, y: 54, "text-anchor": "middle", class: "status-label" });
      statusText.textContent = statusLabels[status] ?? status; group.append(statusText);
    }
    group.addEventListener("click", () => onNodeSelect(node));
    group.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") { event.preventDefault(); onNodeSelect(node); }
    });
    nodesLayer.append(group);
  }
  const guardrails = svg("g", { "data-layer": "guardrails", transform: "translate(30 752)" });
  guardrails.append(svg("rect", { width: 1140, height: 34, rx: 9 }));
  const guardrailLabel = svg("text", { x: 570, y: 22, "text-anchor": "middle" });
  guardrailLabel.textContent = `${graph.guardrails.label.zh} · ${graph.guardrails.label.en}`;
  guardrails.append(guardrailLabel); modulesLayer.append(guardrails);
  container.replaceChildren(root);
}
