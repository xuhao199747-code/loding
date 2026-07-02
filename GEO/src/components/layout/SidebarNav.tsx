import {
  Activity,
  Bot,
  FileBarChart,
  FolderKanban,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  MessagesSquare,
  PenLine,
  Settings,
  Swords,
} from "lucide-react"
import { NavLink } from "react-router-dom"
import { APP_NAME, NAV_ITEMS } from "@/lib/constants"
import { cn } from "@/lib/utils"

const icons = {
  Activity,
  Bot,
  FileBarChart,
  FolderKanban,
  LayoutDashboard,
  Lightbulb,
  ListChecks,
  MessagesSquare,
  PenLine,
  Settings,
  Swords,
}

export function SidebarNav() {
  return (
    <aside className="border-border bg-card max-lg:border-b lg:border-r">
      <div className="flex h-16 items-center border-b border-border px-5">
        <div>
          <div className="text-base font-semibold tracking-normal">{APP_NAME}</div>
          <div className="text-xs text-muted-foreground">GEO 内容优化工作台</div>
        </div>
      </div>
      <nav className="flex gap-1 overflow-x-auto p-3 lg:block lg:space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = icons[item.icon]

          return (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === "/"}
              className={({ isActive }) =>
                cn(
                  "flex h-9 shrink-0 items-center gap-2 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                  isActive && "bg-muted text-foreground",
                )
              }
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{item.title}</span>
            </NavLink>
          )
        })}
      </nav>
    </aside>
  )
}
