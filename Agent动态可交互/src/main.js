import "./styles.css";
import { demoGraph } from "./data/demo-graph.js";
import { createRun, transition } from "./domain/execution.js";
import { createViewport, reduceViewport } from "./domain/viewport.js";
import { createAppView } from "./ui/AppView.js";

const state = { graph: demoGraph, run: createRun(demoGraph), viewport: createViewport() };
let playbackTimer = null;
const moduleForNode = (nodeId) => state.graph.nodes.find((node) => node.id === nodeId)?.moduleId;
const render = () => view.render(state);
const isTerminal = (status) => ["completed", "failed", "cancelled"].includes(status);

function cancelPlayback() {
  if (playbackTimer !== null) {
    clearTimeout(playbackTimer);
    playbackTimer = null;
  }
}

function advanceOne() {
  if (isTerminal(state.run.status)) return false;
  const event = state.graph.events.find((item) => item.id === state.run.currentEventId);
  if (event.relation === "decision") return false;
  if (event.relation === "parallel") {
    const branch = state.run.activeBranches.find((item) => !state.run.completedBranches.includes(item));
    if (!branch) return false;
    state.run = transition(state.run, { type: "COMPLETE_BRANCH", branch });
  } else {
    state.run = transition(state.run, { type: "ADVANCE" });
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
  if (state.run.status !== "running" || isTerminal(state.run.status)) return;
  playbackTimer = setTimeout(() => {
    playbackTimer = null;
    const progressed = advanceOne();
    if (!progressed || isTerminal(state.run.status)) {
      state.run = { ...state.run, status: isTerminal(state.run.status) ? state.run.status : "paused" };
    } else {
      state.run = { ...state.run, status: "running" };
    }
    syncLive();
    schedulePlayback();
  }, 900 / (state.playbackSpeed ?? 1));
}

const view = createAppView(document.querySelector("#app"), {
  onNodeSelect(node) {
    state.viewport = reduceViewport(state.viewport, { type: "FOCUS_NODE", moduleId: node.moduleId, nodeId: node.id });
    render();
  },
  onCloseInspector() {
    state.viewport = reduceViewport(state.viewport, { type: "FOCUS_MODULE", moduleId: state.viewport.viewing.moduleId });
    render();
  },
  onOverview() {
    state.viewport = reduceViewport(state.viewport, { type: "SHOW_OVERVIEW" });
    render();
  },
  onModuleFocus(moduleId) {
    state.viewport = reduceViewport(state.viewport, { type: "FOCUS_MODULE", moduleId });
    render();
  },
  onToggleFollow() {
    state.viewport = reduceViewport(state.viewport, { type: "TOGGLE_FOLLOW" });
    render();
  },
  onReturnLive() {
    state.viewport = reduceViewport(state.viewport, { type: "RETURN_TO_LIVE", moduleId: moduleForNode(state.run.currentNodeId) });
    render();
  },
  onBranchChoice(choice) {
    cancelPlayback();
    state.run = transition(state.run, { type: "CHOOSE_BRANCH", choice });
    syncLive();
  },
  onPrimaryAction() {
    cancelPlayback();
    advanceOne();
    syncLive();
  },
  onRestart() {
    cancelPlayback();
    state.run = transition(state.run, { type: "RESET" });
    syncLive();
  },
  onPlayPause() {
    if (isTerminal(state.run.status)) {
      render();
      return;
    }
    state.run = { ...state.run, status: state.run.status === "running" ? "paused" : "running" };
    render();
    schedulePlayback();
  },
  onPrevious() {
    cancelPlayback();
    state.run = transition(state.run, { type: "PREVIOUS" });
    syncLive();
    schedulePlayback();
  },
  onSpeedChange(speed) {
    state.playbackSpeed = speed;
    render();
    schedulePlayback();
  },
});

render();
