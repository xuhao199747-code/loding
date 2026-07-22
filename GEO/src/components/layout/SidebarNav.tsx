import type { ComponentType } from "react"
import {
  Blocks,
  CalendarClock,
  ChartNoAxesCombined,
  ChartNoAxesGantt,
  ChevronDown,
  HeartMinus,
  ListTree,
  MessageCircleMore,
  Moon,
  PanelLeft,
  Settings,
  Sun,
  UserRound,
} from "lucide-react"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import alibabaBrandAvatar from "@/assets/alibaba-brand-avatar.png"
import alpharankMascotLogo from "@/assets/alpharank-mascot-logo.png"
import alpharankWordmark from "@/assets/alpharank-wordmark.svg"
import brandCaretSort from "@/assets/brand-caret-sort.svg"

const navGroups = [
  {
    label: "智能体",
    items: [
      { title: "营销Agent", href: "/", icon: MessageCircleMore },
      { title: "定时任务", href: "/tasks", icon: CalendarClock },
    ],
  },
  {
    label: "诊断",
    items: [{ title: "GEO诊断", href: "/geo-diagnosis", icon: MonitorTrendIcon }],
  },
  {
    label: "品牌监测工作台",
    items: [
      { title: "数据大盘", href: "/diagnosis", icon: Blocks },
      { title: "AI对话记录", href: "/content-studio", icon: MessageCircleMore },
      { title: "AI引用来源", href: "/answer-monitor", icon: ListTree },
      { title: "分平台AI引用统计", href: "/answer-monitor?view=platform", icon: ChartNoAxesGantt },
      { title: "品牌情感倾向", href: "/sentiment", icon: HeartMinus },
      { title: "品牌提及率", href: "/reports", icon: ChartNoAxesCombined },
    ],
  },
] as const

function isActive(pathname: string, search: string, href: string) {
  const [hrefPathname, hrefSearch = ""] = href.split("?")
  const normalizedHrefSearch = hrefSearch ? `?${hrefSearch}` : ""

  return pathname === hrefPathname && search === normalizedHrefSearch
}

export function SidebarNav() {
  const location = useLocation()
  const [expanded, setExpanded] = useState(false)

  return (
    <TooltipProvider delayDuration={100}>
      <aside
        data-testid="sidebar-nav"
        className={cn(
          "group/sidebar sticky top-0 flex h-screen shrink-0 flex-col border-r border-app-border bg-app-surface py-3 text-app-ink transition-[width,padding] duration-200",
          expanded ? "w-[280px] gap-4 px-3" : "w-[60px] items-center gap-6 px-[14px]",
        )}
      >
        <div className={cn("relative flex w-full items-center", expanded ? "h-10 gap-1" : "h-10 justify-center")}>
          {expanded ? (
            <div className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-lg">
              <img src={alpharankMascotLogo} alt="AlphaRank 标志" className="size-10 max-w-none object-contain" />
            </div>
          ) : null}
          {expanded ? (
            <div className="flex min-w-0 flex-1 items-center">
              <img src={alpharankWordmark} alt="AlphaRank 字标" className="h-[19px] w-[102px] object-contain" />
            </div>
          ) : null}
          {!expanded ? (
            <img
              src={alpharankMascotLogo}
              alt="AlphaRank 标志"
              className="pointer-events-none absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 object-contain opacity-100 transition-opacity group-hover/sidebar:opacity-0"
            />
          ) : null}
          <Button
            variant={expanded ? "ghost" : "outline"}
            size="icon-sm"
            className={cn(
              "size-8 rounded-md text-app-muted shadow-none",
              expanded
                ? "bg-transparent hover:bg-app-panel"
                : "border-app-border bg-white opacity-0 transition-opacity hover:bg-app-panel group-hover/sidebar:opacity-100",
            )}
            data-testid="sidebar-toggle"
            aria-expanded={expanded}
            aria-label={expanded ? "收起侧边栏" : "展开侧边栏"}
            onClick={() => setExpanded((value) => !value)}
          >
            <PanelLeft className="size-4" />
          </Button>
        </div>

        <Button
          type="button"
          variant="ghost"
          className={cn(
            "relative flex items-center border border-app-border bg-white p-0 font-normal shadow-none transition-colors hover:bg-app-surface",
            expanded ? "h-10 w-full justify-between gap-6 rounded-md px-3 py-2" : "size-8 justify-center rounded-md",
          )}
          aria-label="当前品牌 Alibaba.com"
        >
          <span className={cn("flex shrink-0 items-center", expanded ? "gap-2" : "justify-center")}>
            <span className={cn("relative shrink-0 overflow-hidden rounded-lg", expanded ? "size-6" : "size-4")}>
              <span className="absolute inset-0 rounded-full bg-muted" />
              <img src={alibabaBrandAvatar} alt="Alibaba.com 标志" className="absolute inset-0 size-full max-w-none object-cover" />
            </span>
            {expanded ? <span className="truncate text-sm font-normal leading-5 text-app-ink">Alibaba.com</span> : null}
          </span>
          {expanded ? (
            <ChevronDown className="size-4 shrink-0 text-app-muted" />
          ) : (
            <img
              src={brandCaretSort}
              alt="切换品牌"
              data-testid="brand-corner-mask"
              className="absolute left-5 top-5 size-3 max-w-none"
            />
          )}
        </Button>

        {expanded ? (
          <div className="flex min-h-0 flex-1 flex-col gap-4 px-2">
            {navGroups.map((group) => (
              <RailGroup
                key={group.label}
                group={group}
                pathname={location.pathname}
                search={location.search}
                expanded={expanded}
              />
            ))}
          </div>
        ) : (
          <>
            <RailSeparator expanded={expanded} />
            <RailGroup group={navGroups[0]} pathname={location.pathname} search={location.search} expanded={expanded} />
            <div className="flex w-full flex-col items-center gap-6">
              <RailSeparator expanded={expanded} />
              <CollapsedMonitorShortcut active={isActive(location.pathname, location.search, "/geo-diagnosis")} />
              <RailSeparator expanded={expanded} />
            </div>
            <RailGroup group={navGroups[2]} pathname={location.pathname} search={location.search} expanded={expanded} />
          </>
        )}

        <div className={cn("flex items-end", expanded ? "mt-auto w-full" : "flex-1")}>
          <AccountMenu expanded={expanded} />
        </div>
      </aside>
    </TooltipProvider>
  )
}

function CollapsedMonitorShortcut({ active }: { active: boolean }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          to="/geo-diagnosis"
          aria-label="GEO诊断快捷入口"
          data-testid="sidebar-monitor-shortcut"
          className={cn(
            "flex size-8 items-center justify-center rounded-md text-app-muted transition-colors hover:bg-app-panel",
            active && "bg-app-panel",
          )}
        >
          <MonitorTrendIcon className="size-4 shrink-0 text-app-muted" />
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="bg-app-ink text-white">
        GEO诊断
      </TooltipContent>
    </Tooltip>
  )
}

function RailGroup({
  expanded,
  group,
  pathname,
  search,
}: {
  expanded: boolean
  group: (typeof navGroups)[number]
  pathname: string
  search: string
}) {
  return (
    <nav className={cn("flex w-full flex-col gap-2", expanded ? "items-stretch" : "items-center")}>
      {expanded ? <div className="h-4 text-xs font-normal leading-4 text-app-muted">{group.label}</div> : null}
      {group.items.map((item) => (
        <RailLink
          key={item.title}
          href={item.href}
          title={item.title}
          icon={item.icon}
          active={isActive(pathname, search, item.href)}
          expanded={expanded}
        />
      ))}
    </nav>
  )
}

function RailLink({
  active,
  expanded,
  href,
  icon: Icon,
  title,
}: {
  active: boolean
  expanded: boolean
  href: string
  icon: ComponentType<{ className?: string }>
  title: string
}) {
  const link = (
    <Link
      to={href}
      aria-label={title}
      className={cn(
        "flex h-8 items-center rounded-md text-app-muted transition-colors hover:bg-app-panel",
        expanded ? "w-full justify-start gap-2 px-2" : "size-8 justify-center px-2",
        active && "bg-app-panel",
      )}
    >
      <Icon className="size-4 shrink-0 text-app-muted" />
      {expanded ? <span className="truncate text-sm font-normal text-app-ink">{title}</span> : null}
    </Link>
  )

  if (expanded) {
    return link
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right" className="bg-app-ink text-white">
        {title}
      </TooltipContent>
    </Tooltip>
  )
}

function MonitorTrendIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      className={className}
      aria-hidden="true"
    >
      <rect x="3" y="4.5" width="18" height="13" rx="2.2" />
      <path d="M8 20.5h8" />
      <path d="M12 17.5v3" />
      <path d="M7 13l3.1-3 2.5 2 4.4-4" />
    </svg>
  )
}

function RailSeparator({ expanded }: { expanded: boolean }) {
  return <div className={cn("h-0.5 shrink-0 rounded-full bg-app-border", expanded ? "w-full" : "w-8")} />
}

function AccountMenu({ expanded }: { expanded: boolean }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          className={cn(
            "flex h-10 items-center p-0 text-sm font-normal text-app-muted shadow-none transition-colors hover:bg-app-surface",
            expanded ? "w-full justify-start gap-2 overflow-hidden pr-2 pt-3" : "size-10 justify-center rounded-full border border-app-border bg-white",
          )}
          aria-label="当前用户菜单"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full border border-app-border bg-white text-sm font-normal">CN</span>
          {expanded ? (
            <>
              <span className="flex min-w-0 flex-1 flex-col items-start">
                <span className="text-sm font-normal leading-5 text-app-ink">当前用户</span>
                <span className="text-xs font-normal leading-4 text-app-muted">xuhao199747</span>
              </span>
              <Settings className="size-4 shrink-0 text-app-muted" />
            </>
          ) : null}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent side="right" align="end" className="w-[184px] rounded-[10px] border-app-border bg-white p-1 shadow-lg">
        <DropdownMenuItem className="h-7 rounded-md bg-app-panel px-2 py-1 text-sm font-normal text-app-ink focus:bg-app-panel">
          <UserRound className="size-4" />
          账号设置
        </DropdownMenuItem>
        <DropdownMenuItem className="h-7 rounded-md px-2 py-1 text-sm font-normal text-app-ink">
          <Settings className="size-4" />
          偏好设置
        </DropdownMenuItem>
        <DropdownMenuItem className="flex h-9 items-center justify-between rounded-md px-2 py-1 text-sm font-normal text-app-ink">
          <span className="flex items-center gap-2">
            <Sun className="size-4" />
            模式
          </span>
          <span className="flex h-7 items-center gap-0.5 rounded-lg bg-app-panel p-0.5">
            <span className="flex size-6 items-center justify-center rounded-md">
              <Sun className="size-3.5" />
            </span>
            <span className="flex size-6 items-center justify-center rounded-md bg-white">
              <Moon className="size-3.5" />
            </span>
          </span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="h-7 rounded-md bg-red-50 px-2 py-1 text-sm font-normal text-red-600 focus:bg-red-50 focus:text-red-600">
          退出登录
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
