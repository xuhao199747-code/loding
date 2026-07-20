function endpointLabel(graph, id) {
  const item = [
    ...graph.nodes,
    ...graph.detailNodes,
    ...graph.groups,
  ].find((candidate) => candidate.id === id);
  return item?.label ?? { zh: id, en: id };
}

export function createNodeDetail(graph, selection) {
  const item = selection.type === "executable"
    ? graph.nodes.find((node) => node.id === selection.id) ?? selection
    : graph.detailNodes.find((node) => node.id === selection.id) ?? selection;
  const parent = selection.type === "executable"
    ? graph.modules.find((module) => module.id === item.moduleId)
    : graph.groups.find((group) => group.id === item.groupId);
  const incoming = graph.topologyEdges
    .filter((edge) => edge.to === item.id)
    .map((edge) => endpointLabel(graph, edge.from));
  const outgoing = graph.topologyEdges
    .filter((edge) => edge.from === item.id)
    .map((edge) => endpointLabel(graph, edge.to));

  return {
    id: item.id,
    type: selection.type,
    label: item.label,
    parentLabel: parent?.label ?? { zh: "Agent 系统", en: "Agent System" },
    description: item.description ?? null,
    detailSteps: item.detailSteps ?? [],
    incoming,
    outgoing,
  };
}

function bilingualList(items) {
  if (!items.length) return '<span class="empty-value">—</span>';
  return `<ul>${items.map((item) => `<li>${item.zh}<small>${item.en}</small></li>`).join("")}</ul>`;
}

function renderCurrentContent(container, { node, event, snapshot }) {
  const detailSteps = node?.detailSteps ?? [];
  const issue = snapshot.issue;
  const issueLabel = issue?.label ?? issue;
  const issueBanner = issue ? `<section class="issue-banner" role="status"><span>模拟异常 · Simulated Issue</span><strong>${issueLabel.zh ?? issue.id}<small>${issueLabel.en ?? ""}</small></strong>${issue.description ? `<p>${issue.description.zh}<small>${issue.description.en}</small></p>` : ""}${issue.impact ? `<p>影响：${issue.impact.zh}<small>Impact: ${issue.impact.en}</small></p>` : ""}</section>` : "";
  container.innerHTML = `<header><span class="rail-eyebrow">CURRENT STEP</span><h2>${event.label.zh}<small>${event.label.en}</small></h2></header>${issueBanner}<dl><dt>状态 <small>Status</small></dt><dd><span class="status-chip">${snapshot.status}</span></dd><dt>输入 <small>Input</small></dt><dd>${snapshot.input}</dd><dt>输出 <small>Output</small></dt><dd>${snapshot.output}</dd><dt>决策摘要 <small>Decision Summary</small></dt><dd>${snapshot.summary}</dd><dt>轮次 <small>Iteration</small></dt><dd>${snapshot.iteration}</dd></dl><ol class="detail-steps" aria-label="模块内部步骤 Module steps"></ol>`;
  const steps = container.querySelector(".detail-steps");
  for (const step of detailSteps) {
    const item = document.createElement("li");
    item.innerHTML = `<span>${step.zh}</span><small>${step.en}</small>`;
    steps.append(item);
  }
  steps.hidden = detailSteps.length === 0;
}

function renderNodeContent(container, detail) {
  container.innerHTML = `<header><span class="rail-eyebrow">NODE DETAIL</span><h2>${detail.label.zh}<small>${detail.label.en}</small></h2></header><dl><dt>所属模块 <small>Module</small></dt><dd>${detail.parentLabel.zh}<small class="block-support">${detail.parentLabel.en}</small></dd><dt>类型 <small>Type</small></dt><dd>${detail.type === "executable" ? "执行节点 · Executable" : "说明节点 · Informative"}</dd>${detail.description ? `<dt>说明 <small>Description</small></dt><dd>${detail.description.zh}<small class="block-support">${detail.description.en}</small></dd>` : ""}</dl><section class="node-connections" aria-label="节点连接 Node connections"><h3>直接连接 <small>Connections</small></h3><div><span>上游 <small>Upstream</small></span>${bilingualList(detail.incoming)}</div><div><span>下游 <small>Downstream</small></span>${bilingualList(detail.outgoing)}</div></section>`;
}

export function renderContextRail(container, { current, nodeDetail, activeTab = "current", onTabChange }) {
  const showNode = activeTab === "node" && nodeDetail;
  container.innerHTML = `<nav class="rail-tabs" role="tablist" aria-label="说明类型 Detail type"><button type="button" role="tab" data-rail-tab="current" aria-selected="${showNode ? "false" : "true"}">当前步骤 <small>Current</small></button><button type="button" role="tab" data-rail-tab="node" aria-selected="${showNode ? "true" : "false"}" ${nodeDetail ? "" : "disabled"}>节点详情 <small>Node</small></button></nav><div class="rail-content" role="tabpanel"></div>`;
  const content = container.querySelector(".rail-content");
  if (showNode) renderNodeContent(content, nodeDetail);
  else renderCurrentContent(content, current);
  for (const tab of container.querySelectorAll("[data-rail-tab]")) {
    tab.onclick = () => onTabChange?.(tab.dataset.railTab);
  }
}

export function renderStepRail(container, current) {
  renderContextRail(container, { current, activeTab: "current" });
}
