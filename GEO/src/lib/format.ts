export function formatScore(score: number): string {
  return `${Math.round(score)}/100`
}

export function formatPercent(value: number): string {
  const sign = value > 0 ? "+" : ""
  return `${sign}${value.toFixed(1)}%`
}

export function formatDateTime(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value))
}

export function getSeverityLabel(severity: "high" | "medium" | "low"): string {
  const labels = {
    high: "High Priority",
    medium: "Medium Priority",
    low: "Low Priority",
  }

  return labels[severity]
}
