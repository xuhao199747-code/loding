export function countPrompts(value: string) {
  return value.split('\n').map(line => line.trim()).filter(Boolean).length
}

export function parsePrompts(value: string) {
  return value.split('\n').map(line => line.trim()).filter(Boolean)
}

export function formatElapsed(ms: number) {
  const seconds = Math.max(0, Math.floor(ms / 1000))
  return seconds < 60 ? `${seconds}s` : `${Math.floor(seconds / 60)}m ${seconds % 60}s`
}

export function formatTime(timestamp: number) {
  return new Intl.DateTimeFormat('zh-CN', { hour: '2-digit', minute: '2-digit' }).format(timestamp)
}
