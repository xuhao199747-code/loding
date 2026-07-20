export function renderInspector(container, { node, event, open, onClose = () => {} }) {
  container.hidden = !open;
  if (!open) {
    container.replaceChildren();
    return;
  }

  const safety = node.safety ?? { sideEffect: false, retryable: false, reversible: true, idempotencyKey: "—" };
  container.innerHTML = `<header><h2>${node.label.zh}<small>${node.label.en}</small></h2><button type="button" data-action="close-inspector" aria-label="关闭详情 Close details">×</button></header><dl><dt>状态 <small>Status</small></dt><dd>${event?.status ?? "等待 · Waiting"}</dd><dt>输入 <small>Input</small></dt><dd>${event?.input ?? "—"}</dd><dt>输出 <small>Output</small></dt><dd>${event?.output ?? "—"}</dd><dt>决策摘要 <small>Decision Summary</small></dt><dd>${event?.summary ?? "当前节点尚未执行 · Not executed"}</dd><dt>外部副作用 <small>Side Effect</small></dt><dd>${safety.sideEffect ? "有" : "无"}</dd><dt>可重试 <small>Retryable</small></dt><dd>${safety.retryable ? "是" : "否"}</dd><dt>可撤销 <small>Reversible</small></dt><dd>${safety.reversible ? "是" : "否"}</dd><dt>幂等标识 <small>Idempotency Key</small></dt><dd>${safety.idempotencyKey}</dd></dl>`;
  container.querySelector('[data-action="close-inspector"]').addEventListener("click", onClose);
}
