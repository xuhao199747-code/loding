export type Channel = "all" | "xhs" | "dy" | "wx";
export type WorkflowStage = "breakthrough" | "intent" | "plan" | "booking" | "deal";

export type Visitor = {
  id: string;
  name: string;
  subtitle?: string;
  channel: Exclude<Channel, "all">;
  stage: WorkflowStage;
  status: string;
  lastMessage?: string;
  time?: string;
  tags?: string[];
  avatarTone?: string;
};

export type WorkflowColumn = {
  id: WorkflowStage;
  title: string;
  color: string;
  description: string;
};

export const channels: Array<{ id: Channel; label: string }> = [
  { id: "all", label: "全部" },
  { id: "xhs", label: "小红书" },
  { id: "dy", label: "抖音" },
  { id: "wx", label: "企业微信" },
];

export const workflowColumns: WorkflowColumn[] = [
  { id: "breakthrough", title: "破冰", color: "bg-sky-500", description: "新客首触与留资" },
  { id: "intent", title: "意向热聊", color: "bg-amber-500", description: "识别需求与意向" },
  { id: "plan", title: "行程方案", color: "bg-violet-500", description: "路线和方案沟通" },
  { id: "booking", title: "预订促成", color: "bg-blue-500", description: "确认资料与支付" },
  { id: "deal", title: "成交跟进", color: "bg-emerald-500", description: "出行服务与复购" },
];

export const visitors: Visitor[] = [
  { id: "v1", name: "奶茶不加糖", subtitle: "小红书 · 亲子旅行", channel: "xhs", stage: "breakthrough", status: "已留资", time: "刚刚", lastMessage: "想了解暑期亲子路线", tags: ["高意向", "手机号·微信"], avatarTone: "from-rose-300 to-rose-500" },
  { id: "v2", name: "月亮邮差", subtitle: "小红书 · 长线旅行", channel: "xhs", stage: "breakthrough", status: "已点加企微", time: "2 分钟前", lastMessage: "可以先加个微信吗？", tags: ["待通过"], avatarTone: "from-pink-300 to-red-400" },
  { id: "v3", name: "椰椰茶仙女", subtitle: "抖音 · 旅行保障", channel: "dy", stage: "breakthrough", status: "已留资", time: "3 分钟前", lastMessage: "想看看30岁旅行怎么规划", tags: ["高意向"], avatarTone: "from-orange-300 to-amber-500" },
  { id: "v4", name: "奶爸不躺平", subtitle: "企业微信 · 家庭出行", channel: "wx", stage: "intent", status: "确认中", time: "1 分钟前", lastMessage: "预算 1.5 万以内能接受", tags: ["需求确认 6/8 题", "高意向"], avatarTone: "from-cyan-300 to-blue-500" },
  { id: "v5", name: "向日葵姐姐", subtitle: "企业微信 · 方案报价", channel: "wx", stage: "plan", status: "超时 8h", time: "今 08:30", lastMessage: "好的我先看看", tags: ["待跟进", "方案未读"], avatarTone: "from-amber-300 to-orange-500" },
  { id: "v6", name: "赵女士", subtitle: "抖音 · 预订咨询", channel: "dy", stage: "booking", status: "资料确认", time: "10 分钟前", lastMessage: "那我现在要提交什么资料？", tags: ["待预订"], avatarTone: "from-violet-300 to-purple-500" },
  { id: "v7", name: "云端漫游者", subtitle: "企业微信 · 已成交", channel: "wx", stage: "deal", status: "出行服务", time: "昨天", lastMessage: "等订单下来麻烦提醒下", tags: ["已成交", "复购潜力"], avatarTone: "from-emerald-300 to-green-500" },
  { id: "v8", name: "山野慢慢", subtitle: "抖音 · 川西路线", channel: "dy", stage: "breakthrough", status: "新咨询", time: "5 分钟前", lastMessage: "第一次去川西适合怎么玩？", tags: ["待回复"], avatarTone: "from-sky-300 to-cyan-500" },
  { id: "v9", name: "橘子海", subtitle: "小红书 · 海岛度假", channel: "xhs", stage: "breakthrough", status: "已读未回", time: "8 分钟前", lastMessage: "想找一个人少一点的海岛", tags: ["待跟进"], avatarTone: "from-orange-300 to-rose-400" },
  { id: "v10", name: "北漂小鱼", subtitle: "抖音 · 长线旅行", channel: "dy", stage: "intent", status: "需求确认", time: "12 分钟前", lastMessage: "预算两万，想去西北环线", tags: ["高意向"], avatarTone: "from-blue-300 to-indigo-500" },
  { id: "v11", name: "葡萄汽水", subtitle: "小红书 · 闺蜜旅行", channel: "xhs", stage: "intent", status: "需求确认", time: "18 分钟前", lastMessage: "我们两个人想看自然风景", tags: ["高意向"], avatarTone: "from-fuchsia-300 to-pink-500" },
  { id: "v12", name: "小岛日记", subtitle: "企业微信 · 亲子旅行", channel: "wx", stage: "intent", status: "确认中", time: "23 分钟前", lastMessage: "孩子六岁，不能太赶", tags: ["需求确认 4/8 题"], avatarTone: "from-teal-300 to-emerald-500" },
  { id: "v13", name: "风从山来", subtitle: "抖音 · 自驾旅行", channel: "dy", stage: "intent", status: "需求确认", time: "31 分钟前", lastMessage: "车辆和住宿怎么安排？", tags: ["待确认"], avatarTone: "from-violet-300 to-blue-500" },
  { id: "v14", name: "晚风有信", subtitle: "企业微信 · 银发旅行", channel: "wx", stage: "intent", status: "确认中", time: "42 分钟前", lastMessage: "希望安排轻松一点的行程", tags: ["高意向"], avatarTone: "from-amber-300 to-yellow-500" },
  { id: "v15", name: "林女士", subtitle: "小红书 · 亲子长线", channel: "xhs", stage: "plan", status: "方案已读", time: "1 小时前", lastMessage: "两套路线我更喜欢第二套", tags: ["待报价"], avatarTone: "from-rose-300 to-red-500" },
  { id: "v16", name: "阿哲去旅行", subtitle: "抖音 · 西北环线", channel: "dy", stage: "plan", status: "超时 2h", time: "2 小时前", lastMessage: "可以再优化一下住宿吗？", tags: ["待跟进", "高风险"], avatarTone: "from-slate-300 to-slate-500" },
];

export const overviewMetrics = [
  { label: "今日成交", value: "3", unit: "单", delta: "+2", tone: "rose" },
  { label: "今日 GMV", value: "28,600", unit: "元", delta: "+18%", tone: "sky" },
  { label: "本月毛利", value: "6,860", unit: "元", delta: "+12%", tone: "amber" },
];
