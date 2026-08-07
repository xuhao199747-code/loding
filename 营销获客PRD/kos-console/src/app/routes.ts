export type ViewId = "overview" | "monitor";
export const routes: Array<{ id: ViewId; label: string; description: string }> = [
  { id: "overview", label: "经营", description: "旅游经营总览" },
  { id: "monitor", label: "线索", description: "游客流程监控" },
];
