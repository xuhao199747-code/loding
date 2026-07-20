export function renderStepRail(container, { node, event, snapshot }) {
  const detailSteps = node?.detailSteps ?? [];
  container.innerHTML = `<header><span class="rail-eyebrow">CURRENT STEP</span><h2>${event.label.zh}<small>${event.label.en}</small></h2></header><dl><dt>状态 <small>Status</small></dt><dd>${snapshot.status}</dd><dt>输入 <small>Input</small></dt><dd>${snapshot.input}</dd><dt>输出 <small>Output</small></dt><dd>${snapshot.output}</dd><dt>决策摘要 <small>Decision Summary</small></dt><dd>${snapshot.summary}</dd><dt>轮次 <small>Iteration</small></dt><dd>${snapshot.iteration}</dd></dl><ol class="detail-steps" aria-label="模块内部步骤 Module steps"></ol>`;

  const steps = container.querySelector(".detail-steps");
  for (const step of detailSteps) {
    const item = document.createElement("li");
    item.innerHTML = `<span>${step.zh}</span><small>${step.en}</small>`;
    steps.append(item);
  }
  steps.hidden = detailSteps.length === 0;
}
