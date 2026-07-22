import { CalendarDays, RefreshCw, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Topbar() {
  return (
    <header className="flex min-h-16 items-center justify-between gap-4 border-b border-border bg-background px-6 max-md:flex-col max-md:items-stretch max-md:px-4 max-md:py-3">
      <div className="min-w-0">
        <div className="text-sm font-medium">Nihao Jewelry</div>
        <div className="truncate text-xs text-muted-foreground">www.nihaojewelry.com · North America Market</div>
      </div>
      <div className="flex min-w-0 items-center gap-2 max-md:w-full">
        <div className="relative w-72 max-md:w-full">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search prompts, pages, or opportunities" />
        </div>
        <Button variant="outline" size="sm" className="gap-2 max-md:hidden">
          <CalendarDays className="size-4" />
          Last 30 Days
        </Button>
        <Button variant="outline" size="icon" aria-label="Refresh data">
          <RefreshCw className="size-4" />
        </Button>
      </div>
    </header>
  )
}
