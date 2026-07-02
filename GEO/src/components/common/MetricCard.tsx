import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

type MetricCardProps = {
  title: string
  value: string
  helper?: string
  icon?: ReactNode
  className?: string
}

export function MetricCard({ title, value, helper, icon, className }: MetricCardProps) {
  return (
    <Card className={cn("rounded-lg", className)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm text-muted-foreground">{title}</div>
            <div className="mt-2 text-2xl font-semibold tracking-normal">{value}</div>
          </div>
          {icon ? <div className="text-muted-foreground">{icon}</div> : null}
        </div>
        {helper ? <div className="mt-3 text-xs text-muted-foreground">{helper}</div> : null}
      </CardContent>
    </Card>
  )
}
