import "./styles.css";
import { demoGraph } from "./data/demo-graph.js";
import { createRun, transition } from "./domain/execution.js";
import { createViewport, reduceViewport } from "./domain/viewport.js";
import { createAppView } from "./ui/AppView.js";

const state = {
  graph: demoGraph,
  run: createRun(demoGraph),
  viewport: reduceViewport(createViewport(), { type: "SHOW_INTRO_OVERVIEW" }),
  scenarioId: "normal",
  introActive: true,
  minimapCollapsed: false,
};
let playbackTimer = null;
let introTimer = null;
const moduleForNode = (nodeId) => state.graph.nodes.find((node) => node.id === nodeId)?.moduleId;
const render = () => view.render(state);
const isTerminal = (status) => ["completed", "failed", "cancelled"].includes(status);

function cancelPlayback() {
  if (playbackTimer !== null) {
    clearTimeout(playbackTimer);
    playbackTimer = null;
  }
}

function pausePlayback() {
  cancelPlayback();
  if (state.run.status === "running") state.run = { ...state.run, status: "paused" };
}

function cancelIntro(focusLive = true) {
  if (introTimer !== null) {
    clearTimeout(introTimer);
    introTimer = null;
  }
  if (!state.introActive) return;
  state.introActive = false;
  if (focusLive) {
    state.viewport = reduceViewport(state.viewport, {
      type: "RETURN_TO_LIVE",
      moduleId: moduleForNode(state.run.currentNodeId),
    });
  }
}

function scheduleIntro() {
  introTimer = setTimeout(() => {
    introTimer = null;
    cancelIntro();
    render();
  }, 4000);
}

function advanceOne() {
  if (isTerminal(state.run.status) || state.run.simulatedIssue) return false;
  const event = state.graph.events.find((item) => item.id === state.run.currentEventId);
  if (event.relation === "decision") return false;
  if (event.relation === "parallel") {
    const branch = state.run.activeBranches.find((item) => !state.run.completedBranches.includes(item));
    if (!branch) return false;
    state.run = transition(state.run, { type: "COMPLETE_BRANCH", branch });
  } else {
    state.run = transition(state.run, { type: "ADVANCE" });
  }
  const scenario = state.graph.scenarios.find((item) => item.id === state.scenarioId);
  if (scenario?.trigger === state.run.currentEventId) {
    state.run = transition(state.run, { type: "REPORT_ISSUE", issue: scenario });
    return false;
  }
  return true;
}

function syncLive() {
  state.viewport = reduceViewport(state.viewport, {
    type: "SET_LIVE_NODE",
    moduleId: moduleForNode(state.run.currentNodeId),
    nodeId: state.run.currentNodeId,
  });
  render();
}

function schedulePlayback() {
  cancelPlayback();
  if (state.run.status !== "running" || isTerminal(state.run.status) || state.run.simulatedIssue) return;
  playbackTimer = setTimeout(() => {
    playbackTimer = null;
    const progressed = advanceOne();
    const currentEvent = state.graph.events.find((item) => item.id === state.run.currentEventId);
    const shouldPause = !progressed || isTerminal(state.run.status) || currentEvent.relation === "decision";
    if (shouldPause) {
      state.run = { ...state.run, status: state.run.simulatedIssue || isTerminal(state.run.status) ? state.run.status : "paused" };
    } else {
      state.run = { ...state.run, status: "running" };
    }
    syncLive();
    if (!shouldPause) schedulePlayback();
  }, 900 / (state.playbackSpeed ?? 1));
}

const handlers = {
  onNodeSelect(node) {
    cancelIntro();
    state.viewport = reduceViewport(state.viewport, { type: "FOCUS_NODE", moduleId: node.moduleId, nodeId: node.id });
    render();
  },
  onCloseInspector() {
    cancelIntro();
    state.viewport = reduceViewport(state.viewport, { type: "FOCUS_MODULE", moduleId: state.viewport.viewing.moduleId });
    render();
  },
  onOverview() {
    cancelIntro(false);
    pausePlayback();
    state.viewport = reduceViewport(state.viewport, { type: "SHOW_OVERVIEW" });
    render();
  },
  onEscape() {
    cancelIntro(false);
    pausePlayback();
    if (state.viewport.viewing.level === "node") {
      state.viewport = reduceViewport(state.viewport, { type: "FOCUS_MODULE", moduleId: state.viewport.viewing.moduleId });
    } else {
      state.viewport = reduceViewport(state.viewport, { type: "SHOW_OVERVIEW" });
    }
    render();
  },
  onModuleFocus(moduleId) {
    cancelIntro();
    state.viewport = reduceViewport(state.viewport, { type: "FOCUS_MODULE", moduleId });
    render();
  },
  onToggleFollow() {
    cancelIntro();
    state.viewport = reduceViewport(state.viewport, { type: "TOGGLE_FOLLOW" });
    render();
  },
  onReturnLive() {
    cancelIntro();
    state.viewport = reduceViewport(state.viewport, { type: "RETURN_TO_LIVE", moduleId: moduleForNode(state.run.currentNodeId) });
    render();
  },
  onMiniMapToggle() {
    cancelIntro(false);
    state.minimapCollapsed = !state.minimapCollapsed;
    render();
  },
  onBranchChoice(choice) {
    cancelIntro();
    cancelPlayback();
    state.run = transition(state.run, { type: "CHOOSE_BRANCH", choice });
    syncLive();
  },
  onPrimaryAction() {
    cancelIntro();
    cancelPlayback();
    advanceOne();
    syncLive();
  },
  onRestart() {
    cancelIntro();
    cancelPlayback();
    state.run = transition(state.run, { type: "RESET" });
    syncLive();
  },
  onScenarioChange(scenarioId) {
    cancelIntro();
    cancelPlayback();
    state.scenarioId = scenarioId;
    state.run = transition(state.run, { type: "RESET" });
    syncLive();
  },
  onRecovery(action) {
    cancelIntro();
    pausePlayback();
    state.run = transition(state.run, { type: "RECOVER", action, reason: `Scenario recovery: ${action}` });
    syncLive();
  },
  onRerunSnapshot(snapshotId) {
    cancelIntro();
    pausePlayback();
    state.run = transition(state.run, { type: "RERUN_SNAPSHOT", snapshotId, reason: "Inspector replay" });
    syncLive();
  },
  onPlayPause() {
    cancelIntro();
    if (isTerminal(state.run.status) || state.run.simulatedIssue) {
      render();
      return;
    }
    state.run = { ...state.run, status: state.run.status === "running" ? "paused" : "running" };
    render();
    schedulePlayback();
  },
  onPrevious() {
    cancelIntro();
    cancelPlayback();
    state.run = transition(state.run, { type: "PREVIOUS" });
    syncLive();
    schedulePlayback();
  },
  onSpeedChange(speed) {
    cancelIntro();
    state.playbackSpeed = speed;
    render();
    schedulePlayback();
  },
};

const view = createAppView(document.querySelector("#app"), handlers);

const keyboardControllerKey = "__interactiveAgentFlowKeyboardController";
globalThis[keyboardControllerKey]?.abort();
const keyboardController = new AbortController();
globalThis[keyboardControllerKey] = keyboardController;

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    handlers.onEscape();
    return;
  }
  if (event.defaultPrevented || event.target.closest?.("input, textarea, select, button, [contenteditable='true'], [role='button']")) return;

  if (event.key === "ArrowLeft") {
    event.preventDefault();
    handlers.onPrevious();
  } else if (event.key === "ArrowRight") {
    event.preventDefault();
    handlers.onPrimaryAction();
  } else if (event.key === " " || event.code === "Space") {
    event.preventDefault();
    handlers.onPlayPause();
  }
}, { signal: keyboardController.signal });

render();
scheduleIntro();
