import type { Platform } from "@/lib/types"

export const APP_NAME = "AlphaRank"

export const NAV_ITEMS = [
  { title: "工作台", href: "/", icon: "LayoutDashboard" },
  { title: "项目", href: "/projects", icon: "FolderKanban" },
  { title: "GEO 诊断", href: "/diagnosis", icon: "Activity" },
  { title: "AI 答案监控", href: "/answer-monitor", icon: "Bot" },
  { title: "情感与话题", href: "/sentiment", icon: "MessagesSquare" },
  { title: "竞争分析", href: "/competitors", icon: "Swords" },
  { title: "内容机会", href: "/opportunities", icon: "Lightbulb" },
  { title: "内容编辑器", href: "/content-studio", icon: "PenLine" },
  { title: "任务计划", href: "/tasks", icon: "ListChecks" },
  { title: "报告中心", href: "/reports", icon: "FileBarChart" },
  { title: "设置", href: "/settings", icon: "Settings" },
] as const

export const PLATFORMS: { value: Platform; label: string }[] = [
  { value: "chatgpt", label: "ChatGPT" },
  { value: "perplexity", label: "Perplexity" },
  { value: "gemini", label: "Gemini" },
  { value: "claude", label: "Claude" },
]
