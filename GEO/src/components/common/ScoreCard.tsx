import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { formatScore } from "@/lib/format"
import { cn } from "@/lib/utils"

type ScoreCardProps = {
  label: string
  score: number
  helper?: string
  className?: string
}

export function ScoreCard({ label, score, helper, className }: ScoreCardProps) {
  return (
    <Card className={cn("rounded-lg", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-3 text-2xl font-semibold tracking-normal">{formatScore(score)}</div>
        <Progress value={score} />
        {helper ? <p className="mt-3 text-xs text-muted-foreground">{helper}</p> : null}
      </CardContent>
    </Card>
  )
}
