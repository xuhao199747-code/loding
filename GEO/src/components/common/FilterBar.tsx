import type { ReactNode } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"

type FilterBarProps = {
  searchPlaceholder?: string
  filters?: ReactNode
  actions?: ReactNode
}

export function FilterBar({ searchPlaceholder = "Search", filters, actions }: FilterBarProps) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3 rounded-lg border border-border bg-card p-3 max-lg:flex-col max-lg:items-stretch">
      <div className="relative min-w-64 max-lg:w-full">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input className="pl-9" placeholder={searchPlaceholder} />
      </div>
      <div className="flex items-center gap-2 max-md:flex-wrap">
        {filters}
        {actions}
      </div>
    </div>
  )
}
