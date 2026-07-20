const DIRECT_NONLINEAR_RELATIONS = new Set(["callback", "replan", "retry"]);

export function completedEdgeIdsForTrace(graph, trace) {
  const events = new Map(graph.events.map((event) => [event.id, event]));
  const edges = new Map(graph.edges.map((edge) => [edge.id, edge]));
  return new Set(trace.flatMap((entry) => {
    const event = events.get(entry.from);
    const edgeIds = event?.edgeIds ?? [];
    const choice = event?.choices?.[entry.choice];
    if (!choice) {
      if (entry.relation === "join" && event?.relation === "parallel") {
        return edgeIds.filter((edgeId) => entry.branches?.includes(edges.get(edgeId)?.branch));
      }
      if (!DIRECT_NONLINEAR_RELATIONS.has(entry.relation)) return edgeIds;
      return edgeIds.filter((edgeId) => edges.get(edgeId)?.type === entry.relation);
    }
    if (choice.branches) return edgeIds.filter((edgeId) => choice.branches.includes(edges.get(edgeId)?.branch));
    const targetNodeId = events.get(entry.to)?.nodeId;
    return edgeIds.filter((edgeId) => {
      const edge = edges.get(edgeId);
      return edge?.type === entry.relation && edge.to === targetNodeId;
    });
  }));
}
