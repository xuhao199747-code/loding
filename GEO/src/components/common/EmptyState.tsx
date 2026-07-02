import type { ReactNode } from "react"
import { Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background p-8 text-center">
      <Inbox className="mb-3 size-8 text-muted-foreground" />
      <div className="text-sm font-medium">{title}</div>
      {description ? <p className="mt-1 max-w-md text-sm text-muted-foreground">{description}</p> : null}
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  )
}

export function EmptyActionButton({ children }: { children: ReactNode }) {
  return <Button variant="outline">{children}</Button>
}
