function focusTarget(container, identity) {
  const identitySelector = identity.kind === "action"
    ? `[data-action="${identity.value}"]`
    : `[data-${identity.kind}="${identity.value}"]`;
  const candidates = [
    identitySelector,
    '[data-action="primary"]',
    "[data-branch-choice]",
    '[data-action="recovery"]',
    '[data-action="restart"]',
  ];
  const target = candidates
    .map((selector) => container.querySelector(selector))
    .find((element) => element && !element.disabled && !element.hidden);
  target?.focus();
}

function preserveFocus(container, identity, handler) {
  return (event) => {
    const restore = document.activeElement === event.currentTarget;
    handler?.();
    if (restore) focusTarget(container, identity);
  };
}

export function renderPlaybackControls(container, model, handlers) {
  const { run, event, scenario, eventNumber = 1, eventCount = 1 } = model;
  const selectedBranches = run.selectedBranches ?? run.activeBranches ?? [];
  const needsChoice = event.relation === "decision" && Object.keys(event.choices ?? {}).length > 0;
  const branchProgress = selectedBranches.length === 0
    ? "0 / 0"
    : `${run.completedBranches.length} / ${selectedBranches.length}`;
  const primaryLabel = event.relation === "parallel"
    ? "完成下一分支 · Complete Branch"
    : event.relation === "callback"
      ? "执行回传 · Callback"
      : "下一事件 · Next Event";

  const blocked = Boolean(run.simulatedIssue);
  const terminal = ["completed", "failed", "cancelled"].includes(run.status);
  container.innerHTML = `<div class="playback"><button data-action="previous">← 上一步 <small>Previous</small></button><div class="decision-options"></div><button data-action="primary" ${needsChoice || blocked || terminal ? "disabled" : ""}>${primaryLabel}</button><button data-action="restart">重新开始 · Restart</button><span class="run-progress" data-testid="run-progress" aria-label="当前轮次和事件 Current iteration and event">轮次 ${run.iteration} · 事件 ${eventNumber} / ${eventCount}<small>Iteration ${run.iteration} · Event ${eventNumber} / ${eventCount}</small></span><span data-testid="branch-progress" aria-label="并行分支进度 Parallel branch progress">${branchProgress}</span><div class="recovery-options"></div></div>`;

  const options = container.querySelector(".decision-options");
  for (const [choiceId, choice] of blocked ? [] : Object.entries(event.choices ?? {})) {
    const button = document.createElement("button");
    button.dataset.branchChoice = choiceId;
    button.innerHTML = `${choice.label.zh}<small>${choice.label.en}</small>`;
    button.onclick = preserveFocus(container, { kind: "branch-choice", value: choiceId }, () => handlers.onBranchChoice(choiceId));
    options.append(button);
  }

  const recovery = container.querySelector(".recovery-options");
  for (const option of blocked ? scenario?.recovery ?? [] : []) {
    const button = document.createElement("button");
    button.dataset.action = "recovery";
    button.dataset.recovery = option.action;
    button.innerHTML = `${option.label.zh}<small>${option.label.en}</small>`;
    button.onclick = preserveFocus(container, { kind: "recovery", value: option.action }, () => handlers.onRecovery(option.action));
    recovery.append(button);
  }

  container.querySelector('[data-action="previous"]').onclick = preserveFocus(container, { kind: "action", value: "previous" }, handlers.onPrevious);
  container.querySelector('[data-action="primary"]').onclick = preserveFocus(container, { kind: "action", value: "primary" }, handlers.onPrimaryAction);
  container.querySelector('[data-action="restart"]').onclick = preserveFocus(container, { kind: "action", value: "restart" }, handlers.onRestart);
}
