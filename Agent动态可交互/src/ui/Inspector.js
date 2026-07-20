export function renderInspector(container, { node, snapshot, open, historical = false, onClose = () => {}, onRerunSnapshot = () => {} }) {
  container.hidden = !open;
  if (!open) {
    container.replaceChildren();
    return;
  }

  const safety = node.safety ?? { sideEffect: false, retryable: false, reversible: true, idempotencyKey: "—" };
  container.innerHTML = `<header><h2>${node.label.zh}<small>${node.label.en}</small></h2><button type="button" data-action="close-inspector" aria-label="关闭详情 Close details">×</button></header><dl><dt>状态 <small>Status</small></dt><dd>${snapshot?.status ?? "等待 · Waiting"}</dd><dt>输入 <small>Input</small></dt><dd>${snapshot?.input ?? "—"}</dd><dt>输出 <small>Output</small></dt><dd>${snapshot?.output ?? "—"}</dd><dt>决策摘要 <small>Decision Summary</small></dt><dd>${snapshot?.summary ?? "当前节点尚未执行 · Not executed"}</dd><dt>轮次 <small>Iteration</small></dt><dd>${snapshot?.iteration ?? "—"}</dd><dt>分支 <small>Branches</small></dt><dd>${snapshot ? `${snapshot.completedBranches.length} / ${snapshot.selectedBranches.length}` : "—"}</dd><dt>异常 <small>Issue</small></dt><dd>${snapshot?.issue?.label?.zh ?? snapshot?.issue?.id ?? "—"}</dd><dt>外部副作用 <small>Side Effect</small></dt><dd>${safety.sideEffect ? "有" : "无"}</dd><dt>可重试 <small>Retryable</small></dt><dd>${safety.retryable ? "是" : "否"}</dd><dt>可撤销 <small>Reversible</small></dt><dd>${safety.reversible ? "是" : "否"}</dd><dt>幂等标识 <small>Idempotency Key</small></dt><dd>${safety.idempotencyKey}</dd></dl>${historical && snapshot ? `<button type="button" data-action="rerun-snapshot">从此快照重新运行 · Rerun</button>` : ""}`;
  container.querySelector('[data-action="close-inspector"]').addEventListener("click", onClose);
  container.querySelector('[data-action="rerun-snapshot"]')?.addEventListener("click", () => onRerunSnapshot(snapshot.id));
}
