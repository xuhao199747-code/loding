import type { ReactNode } from "react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

type StatusBadgeProps = {
  tone?: "success" | "warning" | "danger" | "neutral" | "info"
  children: ReactNode
}

const toneClassNames = {
  success: "border-transparent bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
  warning: "border-transparent bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  danger: "border-transparent bg-red-50 text-red-700 dark:bg-red-950 dark:text-red-300",
  neutral: "border-transparent bg-muted text-muted-foreground",
  info: "border-transparent bg-sky-50 text-sky-700 dark:bg-sky-950 dark:text-sky-300",
}

export function StatusBadge({ tone = "neutral", children }: StatusBadgeProps) {
  return <Badge className={cn("font-medium", toneClassNames[tone])}>{children}</Badge>
}
