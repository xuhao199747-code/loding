import { renderGraph } from "./GraphView.js";
import { renderStepRail } from "./Inspector.js";
import { renderPlaybackControls } from "./PlaybackControls.js";

export function createAppView(root, handlers) {
  root.innerHTML = `<section class="app-shell"><header class="topbar"><div class="title-lockup"><span class="eyebrow">AGENT EXECUTION MAP</span><h1 data-lang="zh">智能代理执行流程</h1><p class="foundation-screen__support" data-lang="en">Interactive Agent Flow</p></div><label class="scenario-control">模拟场景 <small>Simulation</small><select data-action="scenario" aria-label="模拟场景 Simulation"></select></label><nav data-testid="breadcrumb" aria-label="当前步骤 Current step"></nav></header><main class="flow-stage"><div class="graph-host"></div><aside class="step-rail" aria-label="当前步骤说明 Current step details"></aside></main><footer class="controls-host"></footer></section>`;

  const graphHost = root.querySelector(".graph-host");
  const stepRail = root.querySelector(".step-rail");
  const breadcrumb = root.querySelector('[data-testid="breadcrumb"]');
  const controls = root.querySelector(".controls-host");
  const scenario = root.querySelector('[data-action="scenario"]');

  return {
    render(state) {
      scenario.replaceChildren(...state.graph.scenarios.map((item) => new Option(`${item.label.zh} · ${item.label.en}`, item.id)));
      scenario.value = state.scenarioId ?? "normal";
      scenario.onchange = (event) => handlers.onScenarioChange?.(event.target.value);

      const currentEvent = state.graph.events.find((item) => item.id === state.run.currentEventId);
      const currentNode = state.graph.nodes.find((item) => item.id === currentEvent.nodeId);
      const currentModule = state.graph.modules.find((item) => item.id === currentNode.moduleId);
      breadcrumb.textContent = ["Agent 系统", currentModule.label.zh, currentNode.label.zh].join(" > ");

      renderGraph(graphHost, state);
      renderStepRail(stepRail, {
        node: currentNode,
        event: currentEvent,
        snapshot: {
          status: state.run.status,
          input: currentEvent.label.zh,
          output: state.run.simulatedIssue?.label?.zh ?? state.run.simulatedIssue?.zh ?? "—",
          summary: currentEvent.label.en,
          iteration: state.run.iteration,
        },
      });
      renderPlaybackControls(controls, {
        run: state.run,
        event: currentEvent,
        scenario: state.graph.scenarios.find((item) => item.id === state.scenarioId),
        eventNumber: state.graph.events.indexOf(currentEvent) + 1,
        eventCount: state.graph.events.length,
      }, handlers);
    },
  };
}
