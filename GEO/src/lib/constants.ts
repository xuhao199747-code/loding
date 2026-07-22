import type { Platform } from "@/lib/types"

export const APP_NAME = "AlphaRank"

export const NAV_ITEMS = [
  { title: "策略智能体", href: "/", icon: "LayoutDashboard" },
  { title: "GEO诊断", href: "/geo-diagnosis", icon: "LaptopMinimal" },
  { title: "数据大盘", href: "/diagnosis", icon: "Blocks" },
  { title: "AI 引用来源", href: "/answer-monitor", icon: "Bot" },
  { title: "AI 对话记录", href: "/content-studio", icon: "MessagesSquare" },
  { title: "品牌情感倾向", href: "/sentiment", icon: "FileBarChart" },
  { title: "定时任务", href: "/tasks", icon: "ListChecks" },
  { title: "竞品分析", href: "/competitors", icon: "Swords" },
  { title: "内容机会", href: "/opportunities", icon: "Lightbulb" },
  { title: "报告中心", href: "/reports", icon: "FileBarChart" },
  { title: "设置", href: "/settings", icon: "Settings" },
] as const

export const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "chatgpt", label: "ChatGPT" },
  { value: "perplexity", label: "Perplexity" },
  { value: "gemini", label: "Gemini" },
  { value: "claude", label: "Claude" },
]
