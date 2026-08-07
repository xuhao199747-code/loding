export type ViewId = "overview" | "monitor" | "advisor" | "content" | "schedule";
export const routes: Array<{ id: ViewId; label: string; description: string }> = [
  { id: "overview", label: "经营", description: "旅游经营总览" },
  { id: "monitor", label: "线索", description: "游客流程监控" },
  { id: "advisor", label: "顾问", description: "旅行顾问工作台" },
  { id: "content", label: "内容", description: "旅游内容中心" },
  { id: "schedule", label: "调度", description: "跟进调度中心" },
];
