const SVG_NS = "http://www.w3.org/2000/svg";
const svg = (tag, attributes = {}) => {
  const element = document.createElementNS(SVG_NS, tag);
  for (const [name, value] of Object.entries(attributes)) element.setAttribute(name, String(value));
  return element;
};

const nodeCenter = (node) => ({ x: node.x + 65, y: node.y + 29 });

function edgePath(edge, nodes) {
  const from = nodeCenter(nodes.get(edge.from));
  const to = nodeCenter(nodes.get(edge.to));
  if (["callback", "replan", "retry"].includes(edge.type)) {
    const bend = Math.max(54, Math.abs(to.x - from.x) * .28);
    return `M ${from.x} ${from.y} Q ${(from.x + to.x) / 2} ${Math.min(from.y, to.y) - bend} ${to.x} ${to.y}`;
  }
  return `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
}

function completedEdgeIdsForTrace(graph, trace) {
  const events = new Map(graph.events.map((event) => [event.id, event]));
  const edges = new Map(graph.edges.map((edge) => [edge.id, edge]));
  return new Set(trace.flatMap((entry) => {
    const event = events.get(entry.from);
    const choice = event?.choices?.[entry.choice];
    if (!choice) return event?.edgeIds ?? [];
    if (choice.branches) return event.edgeIds.filter((edgeId) => choice.branches.includes(edges.get(edgeId)?.branch));
    const targetNodeId = events.get(entry.to)?.nodeId;
    return event.edgeIds.filter((edgeId) => {
      const edge = edges.get(edgeId);
      return edge?.type === entry.relation && edge.to === targetNodeId;
    });
  }));
}

function cameraFor(graph, viewing) {
  if (viewing.level === "overview") return { x: 0, y: 0, scale: 1 };
  if (viewing.level === "module") {
    const module = graph.modules.find((item) => item.id === viewing.moduleId);
    const scale = Math.min(1040 / module.w, 690 / module.h, 1.65);
    return { x: 540 - (module.x + module.w / 2) * scale, y: 390 - (module.y + module.h / 2) * scale, scale };
  }
  const node = graph.nodes.find((item) => item.id === viewing.nodeId);
  const scale = 1.55;
  return { x: 500 - (node.x + 65) * scale, y: 360 - (node.y + 29) * scale, scale };
}

function renderDetailFlow(root, node) {
  if (!node?.detailSteps?.length) return;
  const panel = svg("g", { class: "detail-flow", "aria-label": `${node.label.zh} 内部步骤` });
  node.detailSteps.forEach((step, index) => {
    const group = svg("g", { "data-detail-step": index + 1, transform: `translate(${720 + index * 145} 650)` });
    group.append(svg("rect", { width: 130, height: 58, rx: 9 }));
    const zh = svg("text", { x: 65, y: 24, "text-anchor": "middle" }); zh.textContent = step.zh;
    const en = svg("text", { x: 65, y: 42, "text-anchor": "middle", class: "node-en" }); en.textContent = step.en;
    group.append(zh, en); panel.append(group);
  });
  root.append(panel);
}

export function renderGraph(container, { graph, run, viewport, onNodeSelect }) {
  const root = svg("svg", { viewBox: "0 0 1200 800", role: "img", "aria-label": "Agent 架构与执行路径" });
  root.classList.add("architecture-graph");
  const focusedModule = viewport.viewing.moduleId;
  const nodes = new Map(graph.nodes.map((node) => [node.id, node]));
  const currentEvent = graph.events.find((event) => event.id === run.currentEventId);
  const completedEvents = run.trace.map((entry) => graph.events.find((event) => event.id === entry.from)).filter(Boolean);
  const completedEdgeIds = completedEdgeIdsForTrace(graph, run.trace);
  const completedNodeIds = new Set(completedEvents.map((event) => event.nodeId));
  const camera = cameraFor(graph, viewport.viewing);
  const scene = svg("g", { "data-layer": "scene", transform: `translate(${camera.x} ${camera.y}) scale(${camera.scale})` });

  for (const module of graph.modules) {
    const group = svg("g", { "data-module-id": module.id, transform: `translate(${module.x} ${module.y})` });
    group.classList.add("graph-module");
    if (focusedModule && focusedModule !== module.id) group.classList.add("is-dimmed");
    group.append(svg("rect", { width: module.w, height: module.h, rx: 18 }));
    const title = svg("text", { x: 16, y: 28 }); title.textContent = module.label.zh; group.append(title);
    const support = svg("text", { x: 16, y: 45, class: "module-en", "font-size": 10 }); support.textContent = module.label.en; group.append(support);
    scene.append(group);
  }

  for (const edge of graph.edges) {
    const path = svg("path", { d: edgePath(edge, nodes), "data-edge-id": edge.id });
    path.classList.add("graph-edge", `edge-${edge.type}`);
    if (["callback", "replan", "retry"].includes(edge.type)) path.classList.add("is-callback");
    const selectedParallelEdge = currentEvent?.relation !== "parallel" || !edge.branch || run.activeBranches.includes(edge.branch);
    if (currentEvent?.edgeIds?.includes(edge.id) && selectedParallelEdge) path.classList.add("is-live");
    if (completedEdgeIds.has(edge.id)) path.classList.add("is-complete");
    if (currentEvent?.relation === "parallel" && edge.branch && !run.activeBranches.includes(edge.branch)) path.classList.add("is-skipped");
    scene.append(path);
  }

  for (const node of graph.nodes) {
    const group = svg("g", { "data-node-id": node.id, transform: `translate(${node.x} ${node.y})`, tabindex: 0, role: "button", "aria-label": `${node.label.zh} ${node.label.en}` });
    group.classList.add("graph-node", `node-${node.kind}`);
    if (focusedModule && focusedModule !== node.moduleId) group.classList.add("is-dimmed");
    if (node.id === run.currentNodeId) group.classList.add("is-live");
    if (completedNodeIds.has(node.id)) group.classList.add("is-complete");
    const rect = svg("rect", { width: 130, height: 58, rx: 10 });
    const zh = svg("text", { x: 65, y: 25, "text-anchor": "middle" }); zh.textContent = node.label.zh;
    const en = svg("text", { x: 65, y: 42, "text-anchor": "middle", class: "node-en" }); en.textContent = node.label.en;
    group.append(rect, zh, en);
    group.addEventListener("click", () => onNodeSelect(node));
    group.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") onNodeSelect(node); });
    scene.append(group);
  }
  root.append(scene);
  renderDetailFlow(root, viewport.viewing.level === "node" ? nodes.get(viewport.viewing.nodeId) : null);
  const guardrails = svg("g", { "data-layer": "guardrails", transform: "translate(30 752)" });
  guardrails.append(svg("rect", { width: 1140, height: 34, rx: 9 }));
  const guardrailLabel = svg("text", { x: 570, y: 22, "text-anchor": "middle" });
  guardrailLabel.textContent = `${graph.guardrails.label.zh} · ${graph.guardrails.label.en}`;
  guardrails.append(guardrailLabel); root.append(guardrails);
  container.replaceChildren(root);
}
