const TERMINAL = new Set(["completed", "cancelled", "failed"]);

export function createRun(graph, startEventId = graph.events[0].id) {
  const event = graph.events.find((item) => item.id === startEventId);
  if (!event) throw new Error(`Unknown start event: ${startEventId}`);
  return {
    graph,
    status: "paused",
    currentEventId: event.id,
    currentNodeId: event.nodeId,
    activeBranches: [],
    completedBranches: [],
    iteration: 1,
    trace: [],
    history: [],
    simulatedIssue: null,
  };
}

function snapshot(run) {
  return {
    status: run.status,
    currentEventId: run.currentEventId,
    currentNodeId: run.currentNodeId,
    activeBranches: [...run.activeBranches],
    completedBranches: [...run.completedBranches],
    iteration: run.iteration,
    trace: [...run.trace],
    simulatedIssue: run.simulatedIssue,
  };
}

function eventFor(run) {
  return run.graph.events.find((event) => event.id === run.currentEventId);
}

function move(run, eventId, relation, detail = {}, iteration = run.iteration) {
  const target = run.graph.events.find((event) => event.id === eventId);
  if (!target) throw new Error(`Unknown target event: ${eventId}`);
  return {
    ...run,
    status: "paused",
    currentEventId: target.id,
    currentNodeId: target.nodeId,
    trace: [...run.trace, { from: run.currentEventId, to: target.id, relation, iteration, ...detail }],
    history: [...run.history, snapshot(run)],
  };
}

export function transition(run, action) {
  if (action.type === "PREVIOUS") {
    const previous = run.history.at(-1);
    return previous ? { ...run, ...previous, history: run.history.slice(0, -1) } : run;
  }
  if (action.type === "RESET") return createRun(run.graph);
  if (TERMINAL.has(run.status)) throw new Error("Run is terminal");
  const event = eventFor(run);
  if (action.type === "CANCEL") return { ...run, status: "cancelled" };
  if (action.type === "CHOOSE_BRANCH") {
    const choice = event.choices?.[action.choice];
    if (!choice) throw new Error(`Unknown branch choice: ${action.choice}`);
    const iteration = ["retry", "replan"].includes(choice.relation) ? run.iteration + 1 : run.iteration;
    const next = move(run, choice.next, choice.relation ?? "decision", { choice: action.choice }, iteration);
    return {
      ...next,
      activeBranches: choice.branches ?? [],
      completedBranches: [],
      iteration,
    };
  }
  if (action.type === "COMPLETE_BRANCH") {
    if (!run.activeBranches.includes(action.branch)) throw new Error(`Inactive branch: ${action.branch}`);
    const completedBranches = [...new Set([...run.completedBranches, action.branch])];
    if (completedBranches.length < run.activeBranches.length) {
      return { ...run, completedBranches, history: [...run.history, snapshot(run)] };
    }
    return { ...move(run, event.join, "join", { branches: [...run.activeBranches] }), activeBranches: [], completedBranches };
  }
  if (action.type === "REPLAN") {
    const planningEvent = run.graph.events.find((item) => item.id === "planning-event");
    if (!planningEvent) throw new Error("Planning event is required for replan");
    return {
      ...run,
      currentEventId: planningEvent.id,
      currentNodeId: "planning",
      iteration: run.iteration + 1,
      trace: [...run.trace, { from: event.id, to: planningEvent.id, relation: "replan", reason: action.reason, iteration: run.iteration + 1 }],
      history: [...run.history, snapshot(run)],
    };
  }
  if (action.type === "RETRY") {
    return {
      ...run,
      iteration: run.iteration + 1,
      trace: [...run.trace, { from: event.id, to: event.id, relation: "retry", iteration: run.iteration + 1 }],
      history: [...run.history, snapshot(run)],
    };
  }
  if (action.type === "ADVANCE") {
    if (event.relation === "decision") throw new Error("Branch selection required");
    if (event.relation === "parallel") throw new Error("Parallel branches must complete");
    if (!event.next) {
      return {
        ...run,
        status: "completed",
        trace: [...run.trace, { from: event.id, to: null, relation: "complete", iteration: run.iteration }],
        history: [...run.history, snapshot(run)],
      };
    }
    return move(run, event.next, event.relation);
  }
  throw new Error(`Unknown action: ${action.type}`);
}
