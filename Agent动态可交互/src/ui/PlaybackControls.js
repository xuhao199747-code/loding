export function renderPlaybackControls(container, model, handlers) {
  const { run, event, speed = 1 } = model;
  const needsChoice = event.relation === "decision" && run.activeBranches.length === 0;
  const primaryLabel = event.relation === "parallel"
    ? "完成下一分支 · Complete Branch"
    : event.relation === "callback"
      ? "执行回传 · Callback"
      : "下一事件 · Next Event";

  container.innerHTML = `<div class="playback"><button data-action="previous">← 上一步 <small>Previous</small></button><button data-action="play">${run.status === "running" ? "暂停 · Pause" : "播放 · Play"}</button><div class="decision-options"></div><button data-action="primary" ${needsChoice ? "disabled" : ""}>${primaryLabel}</button><button data-action="restart">重新开始 · Restart</button><select data-action="speed" aria-label="播放速度 Playback speed"><option value="1" ${speed === 1 ? "selected" : ""}>1×</option><option value="1.5" ${speed === 1.5 ? "selected" : ""}>1.5×</option><option value="2" ${speed === 2 ? "selected" : ""}>2×</option></select><span data-testid="branch-progress" aria-label="并行分支进度 Parallel branch progress">${run.completedBranches.length} / ${run.activeBranches.length || 0}</span></div>`;

  const options = container.querySelector(".decision-options");
  for (const [choiceId, choice] of Object.entries(event.choices ?? {})) {
    const button = document.createElement("button");
    button.dataset.branchChoice = choiceId;
    button.innerHTML = `${choice.label.zh}<small>${choice.label.en}</small>`;
    button.onclick = () => handlers.onBranchChoice(choiceId);
    options.append(button);
  }

  container.querySelector('[data-action="previous"]').onclick = handlers.onPrevious;
  container.querySelector('[data-action="play"]').onclick = handlers.onPlayPause;
  container.querySelector('[data-action="primary"]').onclick = handlers.onPrimaryAction;
  container.querySelector('[data-action="restart"]').onclick = handlers.onRestart;
  container.querySelector('[data-action="speed"]').onchange = (changeEvent) => handlers.onSpeedChange(Number(changeEvent.target.value));
}
