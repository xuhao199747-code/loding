import { describe, expect, it } from "vitest";
import { demoGraph } from "../src/data/demo-graph.js";

const labelsFor = (items) => items.map((item) => item.label.zh);
const edgePairs = (edges) => edges.map(({ from, to }) => `${from}->${to}`);

describe("reference topology", () => {
  it("declares the complete reference inventory and labels as presentation data", () => {
    expect(demoGraph.systemBoundary).toMatchObject({
      id: "agent-system",
      label: { zh: "Agent 系统", en: "Agent System" },
      outsideNodes: [
        { nodeId: "user-task", position: "top" },
        { nodeId: "final-response", position: "left" },
      ],
    });

    expect(demoGraph.groups.map(({ id, parentId, layout }) => ({ id, parentId, layout }))).toEqual([
      { id: "core-group", parentId: "agent-system", layout: "contained" },
      { id: "planning-group", parentId: "core-group", layout: "contained" },
      { id: "memory-group", parentId: "core-group", layout: "contained" },
      { id: "rag-group", parentId: "agent-system", layout: "contained" },
      { id: "vector-data-branch", parentId: "rag-group", layout: "branch" },
      { id: "web-branch", parentId: "rag-group", layout: "branch" },
      { id: "tools-group", parentId: "agent-system", layout: "horizontal" },
    ]);

    expect(labelsFor(demoGraph.detailNodes)).toEqual([
      "子目标拆解", "CoT思维链", "观察反思", "自我批判",
      "短期记忆", "长期记忆", "上下文", "跨对话记忆",
      "Query处理", "路由",
      "embedding向量化", "向量库检索", "返回TOPK",
      "关键词搜索", "数据库检索", "返回TOPK",
      "联网搜索", "返回TOPK",
      "结果合并去重", "Rerank", "返回TOP N", "上下文组装",
      "代码执行/沙箱", "外部环境/业务系统",
    ]);

    expect(demoGraph.detailNodes.find((item) => item.id === "code-execution-sandbox")).toMatchObject({
      description: { zh: "在隔离沙箱中执行代码与工具调用", en: "Execute code and tool calls in an isolated sandbox" },
    });
    expect(demoGraph.detailNodes.find((item) => item.id === "external-environment-business-system")).toMatchObject({
      description: { zh: "连接外部环境与业务系统", en: "Connect external environments and business systems" },
    });
    expect(demoGraph.groups.find((item) => item.id === "tools-group").nodeIds).toEqual(["action", "observation"]);
    expect(demoGraph.guardrails).toMatchObject({
      scope: "global",
      layout: "full-width",
      label: { zh: "权限 · 安全 · 评估 · 审计", en: "Permissions · Safety · Evaluation · Audit" },
    });
  });

  it("records the reference relationships without changing reducer edges", () => {
    expect(edgePairs(demoGraph.topologyEdges)).toEqual([
      "user-task->orchestrator", "orchestrator->llm", "llm->final-response",
      "llm->planning", "planning->llm", "llm->memory", "memory->llm",
      "llm->rag-query", "rag-query->rag-routing",
      "rag-routing->embedding-vectorization", "embedding-vectorization->vector-store-retrieval", "vector-store-retrieval->vector-top-k", "vector-top-k->result-merge-deduplicate",
      "rag-routing->keyword-search", "keyword-search->database-retrieval", "database-retrieval->database-top-k", "database-top-k->result-merge-deduplicate",
      "rag-routing->web-search", "web-search->web-top-k", "web-top-k->result-merge-deduplicate",
      "result-merge-deduplicate->rerank", "rerank->top-n", "top-n->rag-context", "rag-context->llm",
      "llm->tools-group", "tools-group->action", "action->observation", "observation->llm", "observation->planning", "memory->action",
    ]);
    expect(demoGraph.edges.map((edge) => edge.id)).toEqual(Array.from({ length: 19 }, (_, index) => `e${index + 1}`));
  });

  it("defines vector, web, and parallel retrieval as the required branch compositions", () => {
    expect(demoGraph.retrievalBranches).toEqual([
      {
        id: "vector",
        detailNodeIds: ["embedding-vectorization", "vector-store-retrieval", "vector-top-k", "keyword-search", "database-retrieval", "database-top-k"],
      },
      {
        id: "web",
        detailNodeIds: ["web-search", "web-top-k"],
      },
      {
        id: "parallel",
        branchIds: ["vector", "web"],
      },
    ]);
  });
});
