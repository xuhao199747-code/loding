import "./styles.css";
import { demoGraph } from "./data/demo-graph.js";
import { createRun } from "./domain/execution.js";
import { createViewport, reduceViewport } from "./domain/viewport.js";
import { createAppView } from "./ui/AppView.js";

const state = { graph: demoGraph, run: createRun(demoGraph), viewport: createViewport() };
const moduleForNode = (nodeId) => state.graph.nodes.find((node) => node.id === nodeId)?.moduleId;
const render = () => view.render(state);
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
});

render();
