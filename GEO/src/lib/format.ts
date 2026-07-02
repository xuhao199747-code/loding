export function formatScore(score: number): string {
  return `${Math.round(score)}/100`
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(1)}%`
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export function getSeverityLabel(severity: "high" | "medium" | "low"): string {
  const labels = {
    high: "高优先级",
    medium: "中优先级",
    low: "低优先级",
  }

  return labels[severity]
}
