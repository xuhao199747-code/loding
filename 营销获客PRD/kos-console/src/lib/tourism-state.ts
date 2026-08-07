import type { Channel, Visitor, WorkflowStage } from "@/data/tourism";

export type TourismAction = "retain" | "wechat" | "takeover" | "qualify" | "quote" | "payment" | "travel" | "repurchase";
export type ConversationMessage = { id: string; visitorId: string; sender: "visitor" | "advisor" | "ai"; text: string; time: string };
export type TimelineEvent = { id: string; label: string; detail: string; time: string };
export type TourismState = { visitors: Visitor[]; messages: ConversationMessage[]; timeline: Record<string, TimelineEvent[]>; selectedVisitorId?: string; feedback?: string };

const nextStage: Record<WorkflowStage, WorkflowStage> = { breakthrough: "intent", intent: "plan", plan: "booking", booking: "deal", deal: "deal" };
const actionCopy: Record<TourismAction, { label: string; detail: string; status: string }> = {
  retain: { label: "留资", detail: "已记录游客联系方式", status: "已留资" },
  wechat: { label: "加企微", detail: "已发起企业微信添加", status: "已点加企微" },
  takeover: { label: "接管会话", detail: "已由顾问接管自动跟进", status: "顾问跟进" },
  qualify: { label: "确认意向", detail: "已确认游客出行意向", status: "高意向" },
  quote: { label: "确认报价", detail: "已记录报价确认", status: "报价待确认" },
  payment: { label: "提醒支付", detail: "已发送支付提醒", status: "待支付" },
  travel: { label: "出行服务", detail: "已进入出行服务跟进", status: "出行服务" },
  repurchase: { label: "复购召回", detail: "已加入复购召回队列", status: "复购跟进" },
};

export function filterVisitorsByChannel(items: Visitor[], channel: Channel) {
  return channel === "all" ? items : items.filter((visitor) => visitor.channel === channel);
}

export function advanceVisitor(visitor: Visitor, action: TourismAction) {
  const copy = actionCopy[action];
  const stage = action === "qualify" || action === "takeover" ? nextStage[visitor.stage] : visitor.stage;
  return {
    visitor: { ...visitor, stage, status: copy.status, tags: Array.from(new Set([...(visitor.tags ?? []), copy.label])) },
    event: { id: `${visitor.id}-${Date.now()}`, label: copy.label, detail: copy.detail, time: "刚刚" },
  };
}

export function appendMessage(state: TourismState, visitorId: string, text: string): TourismState {
  const trimmed = text.trim();
  if (!trimmed) return state;
  return { ...state, messages: [...state.messages, { id: `message-${Date.now()}`, visitorId, sender: "advisor", text: trimmed, time: "刚刚" }] };
}

export function applyVisitorAction(state: TourismState, visitorId: string, action: TourismAction): TourismState {
  const visitor = state.visitors.find((item) => item.id === visitorId);
  if (!visitor) return state;
  const result = advanceVisitor(visitor, action);
  return {
    ...state,
    visitors: state.visitors.map((item) => item.id === visitorId ? result.visitor : item),
    timeline: { ...state.timeline, [visitorId]: [...(state.timeline[visitorId] ?? []), result.event] },
    feedback: `${visitor.name}：${result.event.label}成功`,
  };
}
