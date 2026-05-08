import * as React from "react"
import {
  ArrowUpIcon,
  BookmarkIcon,
  BoldIcon,
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronsUpDownIcon,
  CommandIcon,
  CreditCardIcon,
  DatabaseIcon,
  FileTypeIcon,
  FormInputIcon,
  Layers3Icon,
  LayoutGridIcon,
  MessageSquareMoreIcon,
  MoonIcon,
  FileTextIcon,
  HomeIcon,
  InfoIcon,
  ItalicIcon,
  MousePointerClickIcon,
  NavigationIcon,
  SearchIcon,
  SettingsIcon,
  SmileIcon,
  SunIcon,
  TerminalIcon,
  UnderlineIcon,
  UserIcon,
} from "lucide-react"
import { toast } from "sonner"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
  type ColumnDef,
  type VisibilityState,
} from "@tanstack/react-table"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import { Calendar } from "@/components/ui/calendar"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DirectionProvider } from "@/components/ui/direction"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Field, FieldDescription, FieldLabel, FieldSet } from "@/components/ui/field"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { Input } from "@/components/ui/input"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupText } from "@/components/ui/input-group"
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp"
import { Item, ItemActions, ItemContent, ItemDescription, ItemMedia, ItemTitle } from "@/components/ui/item"
import { Kbd, KbdGroup } from "@/components/ui/kbd"
import { Label } from "@/components/ui/label"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from "@/components/ui/menubar"
import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/ui/native-select"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Sheet, SheetContent, SheetDescription, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"
import { Toaster } from "@/components/ui/sonner"
import { Spinner } from "@/components/ui/spinner"
import { Switch } from "@/components/ui/switch"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"

type ComponentDoc = {
  id: string
  group: string
  name: string
  badge: string
  description: string
  install: string
  code: string
  source?: string
  sourcePreview?: string
  example: React.ReactNode
}

type Payment = {
  id: string
  component: string
  type: string
  status: string
}

const dataTableRows: Payment[] = [
  { id: "1", component: "Button", type: "Action", status: "Ready" },
  { id: "2", component: "Dialog", type: "Overlay", status: "Ready" },
  { id: "3", component: "Data Table", type: "Composite", status: "Review" },
]

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt.js",
  "Remix",
  "Astro",
] as const

const navigationItems = [
  {
    title: "Alert Dialog",
    href: "#alert-dialog",
    description: "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "#hover-card",
    description: "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "#progress",
    description: "Displays an indicator showing the completion progress of a task.",
  },
  {
    title: "Scroll Area",
    href: "#scroll-area",
    description: "Visually or semantically separates content.",
  },
] as const

const DRAWER_SIDES = ["top", "right", "bottom", "left"] as const

const GROUP_META: Record<string, { label: string; icon: React.ComponentType<{ className?: string }> }> = {
  Basic: { label: "基础", icon: Layers3Icon },
  Forms: { label: "表单", icon: FormInputIcon },
  Overlay: { label: "浮层", icon: LayoutGridIcon },
  Navigation: { label: "导航", icon: NavigationIcon },
  Layout: { label: "布局", icon: LayoutGridIcon },
  Data: { label: "数据", icon: DatabaseIcon },
  Feedback: { label: "反馈", icon: MessageSquareMoreIcon },
  Controls: { label: "控件", icon: MousePointerClickIcon },
  Design: { label: "规范", icon: FileTypeIcon },
}

const tokenGroups = [
  {
    title: "基础语义",
    items: [
      ["--background", "页面背景", "oklch(1 0 0)", "#ffffffff", "oklch(0.145 0 0)", "#0a0a0aff"],
      ["--foreground", "正文前景", "oklch(0.145 0 0)", "#0a0a0aff", "oklch(0.985 0 0)", "#fafafaff"],
      ["--card", "卡片背景", "oklch(1 0 0)", "#ffffffff", "oklch(0.205 0 0)", "#171717ff"],
      ["--card-foreground", "卡片文字", "oklch(0.145 0 0)", "#0a0a0aff", "oklch(0.985 0 0)", "#fafafaff"],
      ["--popover", "浮层背景", "oklch(1 0 0)", "#ffffffff", "oklch(0.205 0 0)", "#171717ff"],
      ["--popover-foreground", "浮层文字", "oklch(0.145 0 0)", "#0a0a0aff", "oklch(0.985 0 0)", "#fafafaff"],
    ],
  },
  {
    title: "交互与状态",
    items: [
      ["--primary", "主色", "oklch(0.205 0 0)", "#171717ff", "oklch(0.922 0 0)", "#e5e5e5ff"],
      ["--secondary", "次级背景", "oklch(0.97 0 0)", "#f5f5f5ff", "oklch(0.269 0 0)", "#262626ff"],
      ["--muted", "弱化背景", "oklch(0.97 0 0)", "#f5f5f5ff", "oklch(0.269 0 0)", "#262626ff"],
      ["--accent", "强调背景", "oklch(0.97 0 0)", "#f5f5f5ff", "oklch(0.269 0 0)", "#262626ff"],
      ["--destructive", "危险态", "oklch(0.577 0.245 27.325)", "#e7000bff", "oklch(0.704 0.191 22.216)", "#ff6467ff"],
      ["--ring", "聚焦描边", "oklch(0.708 0 0)", "#a1a1a1ff", "oklch(0.556 0 0)", "#737373ff"],
    ],
  },
  {
    title: "结构边界",
    items: [
      ["--border", "分割线/描边", "oklch(0.922 0 0)", "#e5e5e5ff", "oklch(1 0 0 / 10%)", "#ffffff1a"],
      ["--input", "输入框边界", "oklch(0.922 0 0)", "#e5e5e5ff", "oklch(1 0 0 / 15%)", "#ffffff26"],
      ["--sidebar", "侧边栏背景", "oklch(0.985 0 0)", "#fafafaff", "oklch(0.205 0 0)", "#171717ff"],
      ["--sidebar-accent", "侧边栏 hover", "oklch(0.97 0 0)", "#f5f5f5ff", "oklch(0.269 0 0)", "#262626ff"],
      ["--sidebar-border", "侧边栏边界", "oklch(0.922 0 0)", "#e5e5e5ff", "oklch(1 0 0 / 10%)", "#ffffff1a"],
      ["--sidebar-ring", "侧边栏聚焦", "oklch(0.708 0 0)", "#a1a1a1ff", "oklch(0.556 0 0)", "#737373ff"],
    ],
  },
] as const

const colorSwatches = [
  { name: "Background", token: "--background", classToken: "bg-background", sample: "bg-background", ring: "ring-border", light: "#ffffffff", dark: "#0a0a0aff" },
  { name: "Foreground", token: "--foreground", classToken: "text-foreground", sample: "bg-foreground", ring: "ring-border", light: "#0a0a0aff", dark: "#fafafaff" },
  { name: "Card", token: "--card", classToken: "bg-card", sample: "bg-card", ring: "ring-border", light: "#ffffffff", dark: "#171717ff" },
  { name: "Primary", token: "--primary", classToken: "bg-primary", sample: "bg-primary", ring: "ring-primary/20", light: "#171717ff", dark: "#e5e5e5ff" },
  { name: "Secondary", token: "--secondary", classToken: "bg-secondary", sample: "bg-secondary", ring: "ring-border", light: "#f5f5f5ff", dark: "#262626ff" },
  { name: "Muted", token: "--muted", classToken: "bg-muted", sample: "bg-muted", ring: "ring-border", light: "#f5f5f5ff", dark: "#262626ff" },
  { name: "Accent", token: "--accent", classToken: "bg-accent", sample: "bg-accent", ring: "ring-border", light: "#f5f5f5ff", dark: "#262626ff" },
  { name: "Destructive", token: "--destructive", classToken: "bg-destructive", sample: "bg-destructive", ring: "ring-destructive/20", light: "#e7000bff", dark: "#ff6467ff" },
  { name: "Border", token: "--border", classToken: "border-border", sample: "bg-border", ring: "ring-border", light: "#e5e5e5ff", dark: "#ffffff1a" },
  { name: "Ring", token: "--ring", classToken: "ring-ring", sample: "bg-ring", ring: "ring-ring/20", light: "#a1a1a1ff", dark: "#737373ff" },
  { name: "Sidebar", token: "--sidebar", classToken: "bg-sidebar", sample: "bg-sidebar", ring: "ring-sidebar-border", light: "#fafafaff", dark: "#171717ff" },
  { name: "Sidebar Accent", token: "--sidebar-accent", classToken: "bg-sidebar-accent", sample: "bg-sidebar-accent", ring: "ring-sidebar-border", light: "#f5f5f5ff", dark: "#262626ff" },
] as const

const radiusScale = [
  ["--radius-sm", "6px", "rounded-sm"],
  ["--radius-md", "8px", "rounded-md"],
  ["--radius-lg", "10px", "rounded-lg"],
  ["--radius-xl", "14px", "rounded-xl"],
  ["--radius-2xl", "18px", "rounded-2xl"],
  ["--radius-3xl", "22px", "rounded-3xl"],
] as const

const spacingScale = [
  ["space-1", "4px", "图标与文字、超紧凑列表"],
  ["space-2", "8px", "表单项内部、按钮组"],
  ["space-3", "12px", "卡片内容小节"],
  ["space-4", "16px", "默认区块间距"],
  ["space-6", "24px", "组件面板、双栏块"],
  ["space-8", "32px", "页面级段落"],
] as const

const borderRules = [
  ["Border", "border-border", "用于容器边界、表格分隔、输入框描边"],
  ["Input", "border-input", "用于表单控件默认描边"],
  ["Ring", "ring-ring/50", "用于 focus-visible 和交互聚焦态"],
] as const

const elevationScale = [
  ["None", "shadow-none", "无阴影，文档默认基调"],
  ["Small", "shadow-sm", "浮层、轻量卡片、inset 布局"],
  ["Medium", "shadow-md", "下拉层、菜单、悬浮内容"],
] as const

const typographyScale = [
  { label: "Display", className: "text-5xl font-semibold tracking-tight", sample: "组件库视觉标题" },
  { label: "H1", className: "text-4xl font-semibold tracking-tight", sample: "页面主标题" },
  { label: "H2", className: "text-3xl font-semibold tracking-tight", sample: "章节标题" },
  { label: "H3", className: "text-2xl font-semibold tracking-tight", sample: "卡片标题" },
  { label: "Body", className: "text-base text-foreground", sample: "正文用于描述规则、说明约束和解释交互逻辑。" },
  { label: "Muted", className: "text-sm text-muted-foreground", sample: "辅助说明、元数据和次级注释。" },
] as const

const dataTableColumns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: () => <Checkbox aria-label="Select all" />,
    cell: () => <Checkbox aria-label="Select row" />,
  },
  {
    accessorKey: "component",
    header: "组件",
  },
  {
    accessorKey: "type",
    header: "类型",
  },
  {
    accessorKey: "status",
    header: "状态",
  },
]

function sourcePath(id: string) {
  const composite: Record<string, string> = {
    combobox: "组合：button.tsx + command.tsx + popover.tsx",
    "date-picker": "组合：button.tsx + calendar.tsx + popover.tsx",
    "data-table": "组合：table.tsx + input.tsx + dropdown-menu.tsx + @tanstack/react-table",
    "design-tokens": "设计规范：src/index.css 中的语义变量和 @theme 映射",
    "design-colors": "设计规范：src/index.css 中的颜色变量 + Tailwind token 映射",
    "design-radius": "设计规范：src/index.css 中的 --radius 系列变量",
    "design-spacing": "设计规范：Tailwind spacing scale 与组件布局间距约定",
    "design-borders": "设计规范：border / input / ring 语义边界规则",
    "design-elevation": "设计规范：容器阴影层级和使用场景",
    typography: "样式规范：src/index.css + Tailwind classes",
  }

  return composite[id] ?? `src/components/ui/${id}.tsx`
}

const sourcePreviewById: Record<string, string> = {
  "toggle-group": `function ToggleGroup({
  className,
  variant,
  size,
  spacing = 0,
  orientation = "horizontal",
  children,
  ...props
}) {
  return (
    <ToggleGroupPrimitive.Root
      data-slot="toggle-group"
      className={cn(
        "group/toggle-group flex w-fit flex-row items-center",
        className
      )}
      {...props}
    >
      <ToggleGroupContext.Provider value={{ variant, size, spacing, orientation }}>
        {children}
      </ToggleGroupContext.Provider>
    </ToggleGroupPrimitive.Root>
  )
}`,
  button: `const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        outline: "border bg-background",
        destructive: "bg-destructive text-white",
      },
    },
  }
)`,
  table: `function Table({ className, ...props }) {
  return (
    <div data-slot="table-container" className="relative w-full overflow-x-auto">
      <table data-slot="table" className={cn("w-full caption-bottom text-sm", className)} {...props} />
    </div>
  )
}`,
}

const chartData = [
  { month: "Jan", desktop: 186 },
  { month: "Feb", desktop: 305 },
  { month: "Mar", desktop: 237 },
  { month: "Apr", desktop: 173 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "var(--chart-1)",
  },
}

function FormExample() {
  return (
    <form
      className="w-full max-w-sm space-y-4"
      onSubmit={(event) => {
        event.preventDefault()
        toast.success("表单已提交")
      }}
    >
      <FieldSet>
        <Field>
          <FieldLabel htmlFor="form-username">用户名</FieldLabel>
          <Input id="form-username" placeholder="vibcoding" required minLength={2} />
          <FieldDescription>当前 shadcn 版本使用 Field 组织表单字段。</FieldDescription>
        </Field>
      </FieldSet>
      <Button type="submit">保存</Button>
    </form>
  )
}

function DatePickerExample() {
  const [date, setDate] = React.useState<Date | undefined>(new Date())

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <CalendarIcon className="size-4" />
          {date ? date.toLocaleDateString() : "Pick a date"}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar mode="single" selected={date} onSelect={setDate} />
      </PopoverContent>
    </Popover>
  )
}

function ComboboxExample() {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[220px] justify-between"
          onClick={() => setOpen((current) => !current)}
        >
          {value || "Select framework..."}
          <ChevronsUpDownIcon className="size-4 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[220px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {frameworks.map((framework) => (
                <CommandItem
                  key={framework}
                  value={framework}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : framework)
                    setOpen(false)
                  }}
                >
                  <CheckIcon className={`size-4 ${value === framework ? "opacity-100" : "opacity-0"}`} />
                  {framework}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

function DataTableExample() {
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const table = useReactTable({
    data: dataTableRows,
    columns: dataTableColumns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility,
    },
  })

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>组件清单</CardTitle>
        <CardDescription>真正使用 TanStack Table row model 渲染。</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Input
            className="max-w-xs"
            placeholder="Filter components..."
            value={(table.getColumn("component")?.getFilterValue() as string) ?? ""}
            onChange={(event) => table.getColumn("component")?.setFilterValue(event.target.value)}
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">Columns</Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    checked={column.getIsVisible()}
                    className="capitalize"
                    onCheckedChange={(value) => column.toggleVisibility(!!value)}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

const docs: ComponentDoc[] = [
  {
    id: "accordion",
    group: "Basic",
    name: "Accordion 手风琴",
    badge: "Disclosure",
    description: "直接使用 Accordion、AccordionItem、AccordionTrigger、AccordionContent。",
    install: "pnpm dlx shadcn@latest add accordion",
    code: `import { Accordion } from "@/components/ui/accordion"`,
    example: (
      <Accordion type="single" collapsible className="w-full max-w-xl">
        <AccordionItem value="item-1">
          <AccordionTrigger>Is it accessible?</AccordionTrigger>
          <AccordionContent>Yes. It adheres to the WAI-ARIA design pattern.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Is it styled?</AccordionTrigger>
          <AccordionContent>
            Yes. It comes with default styles that matches the other components&apos; aesthetic.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Is it animated?</AccordionTrigger>
          <AccordionContent>Yes. It&apos;s animated by default, but you can disable it if you prefer.</AccordionContent>
        </AccordionItem>
      </Accordion>
    ),
  },
  {
    id: "alert",
    group: "Basic",
    name: "Alert 提示",
    badge: "Feedback",
    description: "Alert 组件用于状态提示。",
    install: "pnpm dlx shadcn@latest add alert",
    code: `import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"`,
    example: (
      <Alert className="max-w-xl">
        <TerminalIcon className="size-4" />
        <AlertTitle>Heads up!</AlertTitle>
        <AlertDescription>You can add components to your app using the cli.</AlertDescription>
      </Alert>
    ),
  },
  {
    id: "alert-dialog",
    group: "Overlay",
    name: "Alert Dialog 警告弹窗",
    badge: "Modal",
    description: "用于不可逆操作确认。",
    install: "pnpm dlx shadcn@latest add alert-dialog",
    code: `import { AlertDialog } from "@/components/ui/alert-dialog"`,
    example: (
      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button variant="outline">Show Dialog</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction>Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    ),
  },
  {
    id: "aspect-ratio",
    group: "Basic",
    name: "Aspect Ratio 比例容器",
    badge: "Media",
    description: "保持媒体区域固定比例。",
    install: "pnpm dlx shadcn@latest add aspect-ratio",
    code: `import { AspectRatio } from "@/components/ui/aspect-ratio"`,
    example: (
      <AspectRatio ratio={16 / 9} className="max-w-xl overflow-hidden rounded-lg bg-muted">
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-900 to-teal-600 text-white">16:9 Preview</div>
      </AspectRatio>
    ),
  },
  {
    id: "avatar",
    group: "Basic",
    name: "Avatar 头像",
    badge: "Identity",
    description: "用户头像和 fallback。",
    install: "pnpm dlx shadcn@latest add avatar",
    code: `import { Avatar } from "@/components/ui/avatar"`,
    example: (
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
    ),
  },
  {
    id: "badge",
    group: "Basic",
    name: "Badge 徽标",
    badge: "Status",
    description: "状态、标签和轻量分类。",
    install: "pnpm dlx shadcn@latest add badge",
    code: `import { Badge } from "@/components/ui/badge"`,
    example: (
      <div className="flex flex-wrap gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
        <Badge variant="destructive">Error</Badge>
      </div>
    ),
  },
  {
    id: "breadcrumb",
    group: "Basic",
    name: "Breadcrumb 面包屑",
    badge: "Navigation",
    description: "页面层级路径。",
    install: "pnpm dlx shadcn@latest add breadcrumb",
    code: `import { Breadcrumb } from "@/components/ui/breadcrumb"`,
    example: (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="#">Docs</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbLink href="#">Components</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Button</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
  },
  {
    id: "button",
    group: "Basic",
    name: "Button 按钮",
    badge: "Action",
    description: "主操作、次操作和危险操作。",
    install: "pnpm dlx shadcn@latest add button",
    code: `import { Button } from "@/components/ui/button"`,
    example: (
      <div className="flex flex-wrap items-center gap-2">
        <Button>Button</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="outline">Outline</Button>
        <Button variant="ghost">Ghost</Button>
        <Button variant="link">Link</Button>
        <Button variant="destructive">Destructive</Button>
        <Button size="icon" aria-label="Submit">
          <ArrowUpIcon className="size-4" />
        </Button>
      </div>
    ),
  },
  {
    id: "button-group",
    group: "Basic",
    name: "Button Group 按钮组",
    badge: "Action",
    description: "连续操作组合。",
    install: "pnpm dlx shadcn@latest add button-group",
    code: `import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group"

export function ButtonGroupDemo() {
  return (
    <ButtonGroup>
      <Button variant="outline">Save</Button>
      <Button variant="outline">Preview</Button>
      <ButtonGroupSeparator />
      <Button variant="outline">Publish</Button>
    </ButtonGroup>
  )
}`,
    example: (
      <ButtonGroup>
        <Button variant="outline">Save</Button>
        <Button variant="outline">Preview</Button>
        <ButtonGroupSeparator />
        <Button variant="outline">Publish</Button>
      </ButtonGroup>
    ),
  },
  {
    id: "calendar",
    group: "Forms",
    name: "Calendar 日历",
    badge: "Date",
    description: "真实 Calendar 组件。",
    install: "pnpm dlx shadcn@latest add calendar",
    code: `import { Calendar } from "@/components/ui/calendar"`,
    example: <Calendar mode="single" defaultMonth={new Date()} selected={new Date()} className="rounded-md border" />,
  },
  {
    id: "carousel",
    group: "Basic",
    name: "Carousel 轮播",
    badge: "Media",
    description: "真实 Carousel、CarouselContent、CarouselItem、CarouselPrevious、CarouselNext 组件。",
    install: "pnpm dlx shadcn@latest add carousel",
    code: `import { Carousel } from "@/components/ui/carousel"`,
    example: (
      <Carousel className="w-full max-w-xs px-12">
        <CarouselContent>
          {[1, 2, 3, 4, 5].map((item) => (
            <CarouselItem key={item}>
              <Card>
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <span className="text-4xl font-semibold">{item}</span>
                </CardContent>
              </Card>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0" />
        <CarouselNext className="right-0" />
      </Carousel>
    ),
  },
  {
    id: "card",
    group: "Basic",
    name: "Card 卡片",
    badge: "Layout",
    description: "CardHeader、CardContent、CardFooter、CardAction 组合。",
    install: "pnpm dlx shadcn@latest add card",
    code: `import { Card } from "@/components/ui/card"`,
    example: (
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
          <CardAction>
            <Button variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email-card">Email</Label>
                <Input id="email-card" type="email" placeholder="m@example.com" required />
              </div>
              <div className="grid gap-2">
                <div className="flex items-center">
                  <Label htmlFor="password-card">Password</Label>
                  <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password-card" type="password" required />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter className="flex-col gap-2">
          <Button type="submit" className="w-full">Login</Button>
          <Button variant="outline" className="w-full">Login with Google</Button>
        </CardFooter>
      </Card>
    ),
  },
  {
    id: "checkbox",
    group: "Forms",
    name: "Checkbox 复选框",
    badge: "Input",
    description: "Checkbox 与 Label 组合。",
    install: "pnpm dlx shadcn@latest add checkbox",
    code: `import { Checkbox } from "@/components/ui/checkbox"`,
    example: (
      <div className="flex items-center gap-2">
        <Checkbox id="terms" />
        <Label htmlFor="terms">Accept terms and conditions</Label>
      </div>
    ),
  },
  {
    id: "collapsible",
    group: "Layout",
    name: "Collapsible 折叠",
    badge: "Disclosure",
    description: "真实 Collapsible、CollapsibleTrigger、CollapsibleContent 组件。",
    install: "pnpm dlx shadcn@latest add collapsible",
    code: `import { Collapsible } from "@/components/ui/collapsible"`,
    example: (
      <Collapsible className="w-full max-w-md space-y-2">
        <div className="flex items-center justify-between rounded-lg border px-4 py-2">
          <div className="text-sm font-medium">@peduarte starred 3 repositories</div>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">Toggle</Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent className="rounded-lg border bg-muted px-4 py-3 text-sm">
          @radix-ui/primitives
        </CollapsibleContent>
      </Collapsible>
    ),
  },
  {
    id: "combobox",
    group: "Forms",
    name: "Combobox 组合选择",
    badge: "Composite",
    description: "Command + Popover + Button 组合。",
    install: "pnpm dlx shadcn@latest add button command popover",
    code: `const [open, setOpen] = React.useState(false)
const [value, setValue] = React.useState("")

<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" role="combobox" aria-expanded={open}>
      {value || "Select framework..."}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-[220px] p-0">
    <Command>
      <CommandInput placeholder="Search framework..." />
      <CommandList>
        <CommandGroup>
          {frameworks.map((framework) => (
            <CommandItem key={framework} value={framework}>
              <CheckIcon className="size-4" />
              {framework}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  </PopoverContent>
</Popover>`,
    example: <ComboboxExample />,
  },
  {
    id: "command",
    group: "Navigation",
    name: "Command 命令面板",
    badge: "Search",
    description: "命令搜索和快捷跳转。",
    install: "pnpm dlx shadcn@latest add command",
    code: `import { Command } from "@/components/ui/command"`,
    example: (
      <Command className="max-w-md rounded-lg border">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem><CalendarIcon className="size-4" />Calendar</CommandItem>
            <CommandItem><SmileIcon className="size-4" />Search Emoji</CommandItem>
            <CommandItem><CommandIcon className="size-4" />Calculator</CommandItem>
          </CommandGroup>
          <CommandGroup heading="Settings">
            <CommandItem><UserIcon className="size-4" />Profile</CommandItem>
            <CommandItem><CreditCardIcon className="size-4" />Billing</CommandItem>
            <CommandItem><SettingsIcon className="size-4" />Settings</CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    ),
  },
  {
    id: "context-menu",
    group: "Navigation",
    name: "Context Menu 右键菜单",
    badge: "Menu",
    description: "右键触发菜单。",
    install: "pnpm dlx shadcn@latest add context-menu",
    code: `import { ContextMenu } from "@/components/ui/context-menu"`,
    example: (
      <ContextMenu>
        <ContextMenuTrigger className="flex h-32 w-full max-w-md items-center justify-center rounded-md border border-dashed">
          Right click here
        </ContextMenuTrigger>
        <ContextMenuContent>
          <ContextMenuItem>Back</ContextMenuItem>
          <ContextMenuItem>Reload</ContextMenuItem>
          <ContextMenuItem>Save Page As...</ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    ),
  },
  {
    id: "date-picker",
    group: "Forms",
    name: "Date Picker 日期选择",
    badge: "Composite",
    description: "Button + Popover + Calendar 组合。",
    install: "pnpm dlx shadcn@latest add button calendar popover",
    code: `import { Calendar } from "@/components/ui/calendar"`,
    example: <DatePickerExample />,
  },
  {
    id: "dialog",
    group: "Overlay",
    name: "Dialog 对话框",
    badge: "Modal",
    description: "阻断式弹窗。",
    install: "pnpm dlx shadcn@latest add dialog",
    code: `import { Dialog } from "@/components/ui/dialog"`,
    example: (
      <Dialog>
        <DialogTrigger asChild><Button variant="outline">Edit Profile</Button></DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>Make changes to your profile here. Click save when you&apos;re done.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name-dialog" className="text-right">Name</Label>
              <Input id="name-dialog" defaultValue="Pedro Duarte" className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username-dialog" className="text-right">Username</Label>
              <Input id="username-dialog" defaultValue="@peduarte" className="col-span-3" />
            </div>
          </div>
          <DialogFooter><Button type="submit">Save changes</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    ),
  },
  {
    id: "drawer",
    group: "Overlay",
    name: "Drawer 抽屉",
    badge: "Mobile",
    description: "底部抽屉。",
    install: "pnpm dlx shadcn@latest add drawer",
    code: `const DRAWER_SIDES = ["top", "right", "bottom", "left"] as const

{DRAWER_SIDES.map((side) => (
  <Drawer key={side} direction={side === "bottom" ? undefined : side}>
    <DrawerTrigger asChild>
      <Button variant="outline">{side}</Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader>
        <DrawerTitle>Move Goal</DrawerTitle>
        <DrawerDescription>Set your daily activity goal.</DrawerDescription>
      </DrawerHeader>
      <DrawerFooter>
        <Button>Submit</Button>
        <DrawerClose asChild>
          <Button variant="outline">Cancel</Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
))`,
    example: (
      <Drawer>
        <div className="flex flex-wrap gap-2">
          {DRAWER_SIDES.map((side) => (
            <Drawer
              key={side}
              direction={side === "bottom" ? undefined : side}
            >
              <DrawerTrigger asChild>
                <Button variant="outline" className="capitalize">{side}</Button>
              </DrawerTrigger>
              <DrawerContent className="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
                <DrawerHeader>
                  <DrawerTitle>Move Goal</DrawerTitle>
                  <DrawerDescription>Set your daily activity goal.</DrawerDescription>
                </DrawerHeader>
                <div className="overflow-y-auto px-4">
                  {Array.from({ length: 6 }).map((_, index) => (
                    <p key={index} className="mb-4 leading-normal text-sm text-muted-foreground">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut
                      labore et dolore magna aliqua.
                    </p>
                  ))}
                </div>
                <DrawerFooter>
                  <Button>Submit</Button>
                  <DrawerClose asChild>
                    <Button variant="outline">Cancel</Button>
                  </DrawerClose>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          ))}
        </div>
      </Drawer>
    ),
  },
  {
    id: "direction",
    group: "Layout",
    name: "Direction 文本方向",
    badge: "Layout",
    description: "DirectionProvider 用于为子树提供 LTR / RTL 方向。",
    install: "pnpm dlx shadcn@latest add direction",
    code: `import { DirectionProvider } from "@/components/ui/direction"`,
    example: (
      <DirectionProvider dir="rtl">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>RTL Direction</CardTitle>
            <CardDescription>这个 Card 子树由 DirectionProvider 设置为 rtl。</CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline">زر الإجراء</Button>
          </CardContent>
        </Card>
      </DirectionProvider>
    ),
  },
  {
    id: "dropdown-menu",
    group: "Navigation",
    name: "Dropdown Menu 下拉菜单",
    badge: "Menu",
    description: "更多操作菜单。",
    install: "pnpm dlx shadcn@latest add dropdown-menu",
    code: `import { DropdownMenu } from "@/components/ui/dropdown-menu"`,
    example: (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="outline">Open</Button></DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-56">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Profile</DropdownMenuItem>
          <DropdownMenuItem>Billing</DropdownMenuItem>
          <DropdownMenuItem>Team</DropdownMenuItem>
          <DropdownMenuItem>Subscription</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
  {
    id: "empty",
    group: "Feedback",
    name: "Empty 空状态",
    badge: "State",
    description: "空数据状态。",
    install: "pnpm dlx shadcn@latest add empty",
    code: `import { Empty } from "@/components/ui/empty"`,
    example: (
      <Empty className="max-w-md border">
        <EmptyHeader>
          <EmptyMedia variant="icon"><FileTextIcon /></EmptyMedia>
          <EmptyTitle>暂无组件</EmptyTitle>
          <EmptyDescription>创建第一个组件文档。</EmptyDescription>
        </EmptyHeader>
        <EmptyContent><Button>新增组件</Button></EmptyContent>
      </Empty>
    ),
  },
  {
    id: "field",
    group: "Forms",
    name: "Field 字段布局",
    badge: "Form",
    description: "字段标签、说明和控件布局。",
    install: "pnpm dlx shadcn@latest add field",
    code: `import { Field } from "@/components/ui/field"`,
    example: (
      <FieldSet className="max-w-sm">
        <Field>
          <FieldLabel htmlFor="field-email">Email</FieldLabel>
          <Input id="field-email" type="email" placeholder="m@example.com" />
          <FieldDescription>We&apos;ll never share your email with anyone else.</FieldDescription>
        </Field>
      </FieldSet>
    ),
  },
  {
    id: "form",
    group: "Forms",
    name: "Form 表单布局",
    badge: "Field",
    description: "当前官网推荐使用 Field 组件组织表单字段；这里展示 Field + Input + Button 的真实组合。",
    install: "pnpm dlx shadcn@latest add field input button",
    code: `import { Field, FieldLabel, FieldDescription } from "@/components/ui/field"`,
    example: <FormExample />,
  },
  {
    id: "hover-card",
    group: "Overlay",
    name: "Hover Card 悬停卡片",
    badge: "Overlay",
    description: "悬停展示额外信息。",
    install: "pnpm dlx shadcn@latest add hover-card",
    code: `import { HoverCard } from "@/components/ui/hover-card"`,
    example: (
      <HoverCard>
        <HoverCardTrigger asChild>
          <Button variant="link">@nextjs</Button>
        </HoverCardTrigger>
        <HoverCardContent className="w-80">
          <div className="flex justify-between gap-4">
            <Avatar>
              <AvatarImage src="https://github.com/vercel.png" />
              <AvatarFallback>VC</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <h4 className="text-sm font-semibold">@nextjs</h4>
              <p className="text-sm">The React Framework - created and maintained by @vercel.</p>
              <div className="flex items-center pt-2">
                <CalendarIcon className="mr-2 size-4 opacity-70" />
                <span className="text-xs text-muted-foreground">Joined December 2021</span>
              </div>
            </div>
          </div>
        </HoverCardContent>
      </HoverCard>
    ),
  },
  {
    id: "input",
    group: "Forms",
    name: "Input 输入框",
    badge: "Input",
    description: "单行输入。",
    install: "pnpm dlx shadcn@latest add input",
    code: `import { Input } from "@/components/ui/input"`,
    example: <Input className="max-w-sm" placeholder="name@example.com" />,
  },
  {
    id: "input-group",
    group: "Forms",
    name: "Input Group 输入组",
    badge: "Input",
    description: "前后缀输入组合。",
    install: "pnpm dlx shadcn@latest add input-group",
    code: `import { InputGroup } from "@/components/ui/input-group"`,
    example: (
      <InputGroup className="max-w-sm">
        <InputGroupAddon><InputGroupText>@</InputGroupText></InputGroupAddon>
        <InputGroupInput placeholder="username" />
      </InputGroup>
    ),
  },
  {
    id: "input-otp",
    group: "Forms",
    name: "Input OTP 验证码",
    badge: "Input",
    description: "一次性验证码输入。",
    install: "pnpm dlx shadcn@latest add input-otp",
    code: `import { InputOTP } from "@/components/ui/input-otp"`,
    example: (
      <InputOTP maxLength={6}>
        <InputOTPGroup>
          {[0, 1, 2, 3, 4, 5].map((index) => <InputOTPSlot key={index} index={index} />)}
        </InputOTPGroup>
      </InputOTP>
    ),
  },
  {
    id: "item",
    group: "Controls",
    name: "Item 条目",
    badge: "Layout",
    description: "列表条目结构。",
    install: "pnpm dlx shadcn@latest add item",
    code: `import { Item } from "@/components/ui/item"`,
    example: (
      <Item variant="outline" className="max-w-md">
        <ItemMedia variant="icon"><InfoIcon className="size-4" /></ItemMedia>
        <ItemContent>
          <ItemTitle>shadcn/ui</ItemTitle>
          <ItemDescription>Beautifully designed components built with Radix UI and Tailwind CSS.</ItemDescription>
        </ItemContent>
        <ItemActions><Button variant="outline" size="sm">Open</Button></ItemActions>
      </Item>
    ),
  },
  {
    id: "kbd",
    group: "Controls",
    name: "Kbd 键盘键",
    badge: "Display",
    description: "键盘快捷键展示。",
    install: "pnpm dlx shadcn@latest add kbd",
    code: `import { Kbd } from "@/components/ui/kbd"`,
    example: <KbdGroup><Kbd>⌘</Kbd><Kbd>K</Kbd></KbdGroup>,
  },
  {
    id: "label",
    group: "Forms",
    name: "Label 标签",
    badge: "Form",
    description: "表单标签。",
    install: "pnpm dlx shadcn@latest add label",
    code: `import { Label } from "@/components/ui/label"`,
    example: <div className="grid max-w-sm gap-2"><Label htmlFor="email-label">Email</Label><Input id="email-label" placeholder="Email" /></div>,
  },
  {
    id: "menubar",
    group: "Navigation",
    name: "Menubar 菜单栏",
    badge: "Menu",
    description: "桌面菜单栏。",
    install: "pnpm dlx shadcn@latest add menubar",
    code: `import { Menubar } from "@/components/ui/menubar"`,
    example: (
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>File</MenubarTrigger>
          <MenubarContent><MenubarItem>New Tab</MenubarItem><MenubarItem>New Window</MenubarItem></MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>Edit</MenubarTrigger>
          <MenubarContent><MenubarItem>Undo</MenubarItem><MenubarItem>Redo</MenubarItem></MenubarContent>
        </MenubarMenu>
        <MenubarMenu>
          <MenubarTrigger>View</MenubarTrigger>
          <MenubarContent><MenubarItem>Always Show Bookmarks Bar</MenubarItem><MenubarItem>Full Screen</MenubarItem></MenubarContent>
        </MenubarMenu>
      </Menubar>
    ),
  },
  {
    id: "native-select",
    group: "Forms",
    name: "Native Select 原生选择",
    badge: "Select",
    description: "移动端友好的原生 select。",
    install: "pnpm dlx shadcn@latest add native-select",
    code: `import { NativeSelect } from "@/components/ui/native-select"`,
    example: <NativeSelect defaultValue="system"><NativeSelectOption value="light">Light</NativeSelectOption><NativeSelectOption value="dark">Dark</NativeSelectOption><NativeSelectOption value="system">System</NativeSelectOption></NativeSelect>,
  },
  {
    id: "navigation-menu",
    group: "Navigation",
    name: "Navigation Menu 导航菜单",
    badge: "Menu",
    description: "复杂导航菜单。",
    install: "pnpm dlx shadcn@latest add navigation-menu",
    code: `import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"`,
    example: (
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <a
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-linear-to-b from-muted/50 to-muted p-6 no-underline outline-hidden"
                      href="#overview"
                    >
                      <div className="mb-2 mt-4 text-lg font-medium">shadcn/ui</div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Beautifully designed components built with Radix UI and Tailwind CSS.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a href="#installation" className="block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Introduction</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Re-usable components built using Radix UI and Tailwind CSS.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a href="#installation" className="block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Installation</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        How to install dependencies and structure your app.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
                <li>
                  <NavigationMenuLink asChild>
                    <a href="#typography" className="block space-y-1 rounded-md p-3 leading-none no-underline outline-hidden transition-colors hover:bg-accent hover:text-accent-foreground">
                      <div className="text-sm font-medium leading-none">Typography</div>
                      <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                        Styles for headings, paragraphs, lists, and more.
                      </p>
                    </a>
                  </NavigationMenuLink>
                </li>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
          <NavigationMenuItem>
            <NavigationMenuTrigger>Components</NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
                {navigationItems.map((item) => (
                  <li key={item.title}>
                    <NavigationMenuLink asChild>
                      <a
                        href={item.href}
                        className={navigationMenuTriggerStyle({ className: "h-auto flex-col items-start justify-start whitespace-normal rounded-md p-3" })}
                      >
                        <div className="text-sm font-medium leading-none">{item.title}</div>
                        <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{item.description}</p>
                      </a>
                    </NavigationMenuLink>
                  </li>
                ))}
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    ),
  },
  {
    id: "pagination",
    group: "Navigation",
    name: "Pagination 分页",
    badge: "Navigation",
    description: "分页导航。",
    install: "pnpm dlx shadcn@latest add pagination",
    code: `import { Pagination } from "@/components/ui/pagination"`,
    example: (
      <Pagination>
        <PaginationContent>
          <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
          <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
          <PaginationItem><PaginationLink href="#">2</PaginationLink></PaginationItem>
          <PaginationItem><PaginationNext href="#" /></PaginationItem>
        </PaginationContent>
      </Pagination>
    ),
  },
  {
    id: "popover",
    group: "Overlay",
    name: "Popover 浮层",
    badge: "Overlay",
    description: "轻量浮层。",
    install: "pnpm dlx shadcn@latest add popover",
    code: `import { Popover } from "@/components/ui/popover"`,
    example: (
      <Popover>
        <PopoverTrigger asChild><Button variant="outline">Open popover</Button></PopoverTrigger>
        <PopoverContent className="w-80">
          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="leading-none font-medium">Dimensions</h4>
              <p className="text-sm text-muted-foreground">Set the dimensions for the layer.</p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width-popover">Width</Label>
                <Input id="width-popover" defaultValue="100%" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxWidth-popover">Max. width</Label>
                <Input id="maxWidth-popover" defaultValue="300px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="height-popover">Height</Label>
                <Input id="height-popover" defaultValue="25px" className="col-span-2 h-8" />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="maxHeight-popover">Max. height</Label>
                <Input id="maxHeight-popover" defaultValue="none" className="col-span-2 h-8" />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    ),
  },
  {
    id: "progress",
    group: "Feedback",
    name: "Progress 进度条",
    badge: "Feedback",
    description: "任务进度。",
    install: "pnpm dlx shadcn@latest add progress",
    code: `import { Progress } from "@/components/ui/progress"`,
    example: <Progress value={64} className="max-w-sm" />,
  },
  {
    id: "radio-group",
    group: "Forms",
    name: "Radio Group 单选组",
    badge: "Input",
    description: "互斥选项。",
    install: "pnpm dlx shadcn@latest add radio-group",
    code: `import { RadioGroup } from "@/components/ui/radio-group"`,
    example: (
      <RadioGroup defaultValue="comfortable">
        <div className="flex items-center gap-2"><RadioGroupItem value="default" id="r1" /><Label htmlFor="r1">Default</Label></div>
        <div className="flex items-center gap-2"><RadioGroupItem value="comfortable" id="r2" /><Label htmlFor="r2">Comfortable</Label></div>
        <div className="flex items-center gap-2"><RadioGroupItem value="compact" id="r3" /><Label htmlFor="r3">Compact</Label></div>
      </RadioGroup>
    ),
  },
  {
    id: "resizable",
    group: "Layout",
    name: "Resizable 可调整面板",
    badge: "Layout",
    description: "可拖拽分栏。",
    install: "pnpm dlx shadcn@latest add resizable",
    code: `import { ResizablePanelGroup } from "@/components/ui/resizable"`,
    example: (
        <ResizablePanelGroup orientation="horizontal" className="min-h-40 max-w-xl rounded-lg border">
        <ResizablePanel defaultSize={50}><div className="flex h-full items-center justify-center p-6"><span className="font-semibold">One</span></div></ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}><div className="flex h-full items-center justify-center p-6"><span className="font-semibold">Two</span></div></ResizablePanel>
      </ResizablePanelGroup>
    ),
  },
  {
    id: "scroll-area",
    group: "Layout",
    name: "Scroll Area 滚动区域",
    badge: "Layout",
    description: "自定义滚动区域。",
    install: "pnpm dlx shadcn@latest add scroll-area",
    code: `import { ScrollArea } from "@/components/ui/scroll-area"`,
    example: (
      <ScrollArea className="h-44 w-72 rounded-md border p-4">
        {Array.from({ length: 20 }).map((_, index) => <div key={index} className="border-b py-2 text-sm">Tag {index + 1}</div>)}
      </ScrollArea>
    ),
  },
  {
    id: "select",
    group: "Forms",
    name: "Select 选择器",
    badge: "Select",
    description: "自定义选择器。",
    install: "pnpm dlx shadcn@latest add select",
    code: `import { Select } from "@/components/ui/select"`,
    example: (
      <Select>
        <SelectTrigger className="w-[180px]"><SelectValue placeholder="Select a fruit" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="blueberry">Blueberry</SelectItem>
          <SelectItem value="grapes">Grapes</SelectItem>
          <SelectItem value="pineapple">Pineapple</SelectItem>
        </SelectContent>
      </Select>
    ),
  },
  {
    id: "separator",
    group: "Basic",
    name: "Separator 分隔线",
    badge: "Layout",
    description: "水平或垂直分隔。",
    install: "pnpm dlx shadcn@latest add separator",
    code: `import { Separator } from "@/components/ui/separator"`,
    example: (
      <div className="w-full max-w-md">
        <div className="space-y-1"><h4 className="text-sm font-medium">Radix Primitives</h4><p className="text-sm text-muted-foreground">An open-source UI component library.</p></div>
        <Separator className="my-4" />
        <div className="flex h-5 items-center gap-4 text-sm"><span>Blog</span><Separator orientation="vertical" /><span>Docs</span><Separator orientation="vertical" /><span>Source</span></div>
      </div>
    ),
  },
  {
    id: "sheet",
    group: "Overlay",
    name: "Sheet 侧边抽屉",
    badge: "Overlay",
    description: "侧边面板。",
    install: "pnpm dlx shadcn@latest add sheet",
    code: `import { Sheet } from "@/components/ui/sheet"`,
    example: (
      <Sheet>
        <SheetTrigger asChild><Button variant="outline">Open</Button></SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>Make changes to your profile here. Click save when you&apos;re done.</SheetDescription>
          </SheetHeader>
          <div className="grid flex-1 auto-rows-min gap-6 px-4">
            <div className="grid gap-3">
              <Label htmlFor="sheet-name">Name</Label>
              <Input id="sheet-name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="sheet-username">Username</Label>
              <Input id="sheet-username" defaultValue="@peduarte" />
            </div>
          </div>
          <SheetFooter>
            <Button type="submit">Save changes</Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    ),
  },
  {
    id: "sidebar",
    group: "Navigation",
    name: "Sidebar 侧边栏",
    badge: "Layout",
    description: "应用级侧边栏。",
    install: "pnpm dlx shadcn@latest add sidebar",
    code: `import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar"`,
    example: (
      <div className="h-72 w-full max-w-xl overflow-hidden rounded-lg border">
        <SidebarProvider className="min-h-0">
          <Sidebar collapsible="none" className="relative h-72">
            <SidebarHeader>
              <SidebarInput placeholder="Search" />
            </SidebarHeader>
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupLabel>Application</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    <SidebarMenuItem><SidebarMenuButton isActive><HomeIcon />Playground</SidebarMenuButton></SidebarMenuItem>
                    <SidebarMenuItem><SidebarMenuButton><SettingsIcon />Settings</SidebarMenuButton></SidebarMenuItem>
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
            <SidebarRail />
          </Sidebar>
          <SidebarInset className="min-h-0">
            <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
              <SidebarTrigger />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <span className="text-sm font-medium">Project Overview</span>
            </header>
            <div className="flex flex-1 items-center justify-center p-4 text-sm text-muted-foreground">
              Select a view from the sidebar.
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    ),
  },
  {
    id: "skeleton",
    group: "Basic",
    name: "Skeleton 骨架屏",
    badge: "Loading",
    description: "加载占位。",
    install: "pnpm dlx shadcn@latest add skeleton",
    code: `import { Skeleton } from "@/components/ui/skeleton"`,
    example: <div className="w-full max-w-sm space-y-3"><Skeleton className="h-4 w-[250px]" /><Skeleton className="h-4 w-[200px]" /><Skeleton className="h-4 w-[320px]" /></div>,
  },
  {
    id: "slider",
    group: "Forms",
    name: "Slider 滑块",
    badge: "Input",
    description: "范围输入。",
    install: "pnpm dlx shadcn@latest add slider",
    code: `import { Slider } from "@/components/ui/slider"`,
    example: <Slider defaultValue={[42]} max={100} step={1} className="max-w-sm" />,
  },
  {
    id: "sonner",
    group: "Feedback",
    name: "Sonner / Toast 消息",
    badge: "Toast",
    description: "轻量消息反馈。",
    install: "pnpm dlx shadcn@latest add sonner",
    code: `import { toast } from "sonner"`,
    example: <Button variant="outline" onClick={() => toast("Event has been created")}>Show Toast</Button>,
  },
  {
    id: "spinner",
    group: "Feedback",
    name: "Spinner 加载",
    badge: "Loading",
    description: "加载中状态。",
    install: "pnpm dlx shadcn@latest add spinner",
    code: `import { Spinner } from "@/components/ui/spinner"`,
    example: <Spinner className="size-6" />,
  },
  {
    id: "switch",
    group: "Forms",
    name: "Switch 开关",
    badge: "Input",
    description: "开关设置。",
    install: "pnpm dlx shadcn@latest add switch",
    code: `import { Switch } from "@/components/ui/switch"`,
    example: <div className="flex items-center gap-2"><Switch id="airplane-mode" /><Label htmlFor="airplane-mode">Airplane Mode</Label></div>,
  },
  {
    id: "table",
    group: "Data",
    name: "Table 表格",
    badge: "Data",
    description: "结构化数据展示。",
    install: "pnpm dlx shadcn@latest add table",
    code: `import { Table } from "@/components/ui/table"`,
    example: (
      <Table className="max-w-xl">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Invoice</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Method</TableHead>
            <TableHead className="text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableCell className="font-medium">INV001</TableCell>
            <TableCell>Paid</TableCell>
            <TableCell>Credit Card</TableCell>
            <TableCell className="text-right">$250.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">INV002</TableCell>
            <TableCell>Pending</TableCell>
            <TableCell>PayPal</TableCell>
            <TableCell className="text-right">$150.00</TableCell>
          </TableRow>
          <TableRow>
            <TableCell className="font-medium">INV003</TableCell>
            <TableCell>Unpaid</TableCell>
            <TableCell>Bank Transfer</TableCell>
            <TableCell className="text-right">$350.00</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    ),
  },
  {
    id: "tabs",
    group: "Layout",
    name: "Tabs 标签页",
    badge: "Layout",
    description: "同层级视图切换。",
    install: "pnpm dlx shadcn@latest add tabs",
    code: `import { Tabs } from "@/components/ui/tabs"`,
    example: (
      <Tabs defaultValue="account" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="password">Password</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account</CardTitle>
              <CardDescription>Make changes to your account here. Click save when you&apos;re done.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="name-tabs">Name</Label>
                <Input id="name-tabs" defaultValue="Pedro Duarte" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="username-tabs">Username</Label>
                <Input id="username-tabs" defaultValue="@peduarte" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="password">
          <Card>
            <CardHeader>
              <CardTitle>Password</CardTitle>
              <CardDescription>Change your password here. After saving, you&apos;ll be logged out.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="current-tabs">Current password</Label>
                <Input id="current-tabs" type="password" />
              </div>
              <div className="space-y-1">
                <Label htmlFor="new-tabs">New password</Label>
                <Input id="new-tabs" type="password" />
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save password</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    ),
  },
  {
    id: "textarea",
    group: "Forms",
    name: "Textarea 文本域",
    badge: "Input",
    description: "多行输入。",
    install: "pnpm dlx shadcn@latest add textarea",
    code: `import { Textarea } from "@/components/ui/textarea"`,
    example: <Textarea className="max-w-sm" placeholder="Type your message here." />,
  },
  {
    id: "toast",
    group: "Feedback",
    name: "Toast 轻提示",
    badge: "Legacy",
    description: "官网组件列表仍保留 Toast，但当前 Radix 版本文档已标记为 deprecated，并建议改用 Sonner。",
    install: "Deprecated. Use `pnpm dlx shadcn@latest add sonner` instead.",
    code: `import { toast } from "sonner"

export function ToastDemo() {
  return <Button onClick={() => toast("Event has been created")}>Show Toast</Button>
}`,
    example: <Button onClick={() => toast("Event has been created")}>Show Toast</Button>,
  },
  {
    id: "toggle",
    group: "Controls",
    name: "Toggle 切换按钮",
    badge: "Control",
    description: "按官网 Toggle 默认示例：BookmarkIcon + Toggle。",
    install: "pnpm dlx shadcn@latest add toggle",
    code: `import { BookmarkIcon } from "lucide-react"

import { Toggle } from "@/components/ui/toggle"

export function ToggleDemo() {
  return (
    <Toggle aria-label="Toggle bookmark">
      <BookmarkIcon className="size-4" />
    </Toggle>
  )
}`,
    example: <Toggle aria-label="Toggle bookmark"><BookmarkIcon className="size-4" /></Toggle>,
  },
  {
    id: "toggle-group",
    group: "Controls",
    name: "Toggle Group 切换组",
    badge: "Control",
    description: "按官网 Basic 示例：ToggleGroup type=\"multiple\" spacing={1} + Bold/Italic/Underline。",
    install: "pnpm dlx shadcn@latest add toggle-group",
    code: `import { BoldIcon, ItalicIcon, UnderlineIcon } from "lucide-react"

import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/components/ui/toggle-group"

export function ToggleGroupDemo() {
  return (
    <ToggleGroup type="multiple" spacing={1}>
      <ToggleGroupItem value="bold" aria-label="Toggle bold">
        <BoldIcon className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="italic" aria-label="Toggle italic">
        <ItalicIcon className="size-4" />
      </ToggleGroupItem>
      <ToggleGroupItem value="underline" aria-label="Toggle underline">
        <UnderlineIcon className="size-4" />
      </ToggleGroupItem>
    </ToggleGroup>
  )
}`,
    example: (
      <ToggleGroup type="multiple" spacing={1}>
        <ToggleGroupItem value="bold" aria-label="Toggle bold">
          <BoldIcon className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="italic" aria-label="Toggle italic">
          <ItalicIcon className="size-4" />
        </ToggleGroupItem>
        <ToggleGroupItem value="underline" aria-label="Toggle underline">
          <UnderlineIcon className="size-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    ),
  },
  {
    id: "tooltip",
    group: "Overlay",
    name: "Tooltip 提示气泡",
    badge: "Overlay",
    description: "悬停提示。",
    install: "pnpm dlx shadcn@latest add tooltip",
    code: `import { Tooltip } from "@/components/ui/tooltip"`,
    example: <Tooltip><TooltipTrigger asChild><Button variant="outline">Hover</Button></TooltipTrigger><TooltipContent><p>Add to library</p></TooltipContent></Tooltip>,
  },
  {
    id: "chart",
    group: "Data",
    name: "Chart 图表",
    badge: "Data",
    description: "ChartContainer + Recharts。",
    install: "pnpm dlx shadcn@latest add chart",
    code: `import { ChartContainer } from "@/components/ui/chart"`,
    example: (
      <ChartContainer config={chartConfig} className="min-h-52 w-full max-w-xl">
        <BarChart accessibilityLayer data={chartData}>
          <CartesianGrid vertical={false} />
          <XAxis dataKey="month" tickLine={false} axisLine={false} />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
        </BarChart>
      </ChartContainer>
    ),
  },
  {
    id: "data-table",
    group: "Data",
    name: "Data Table 数据表格",
    badge: "Composite",
    description: "shadcn 的 Data Table 是 TanStack Table 与 Table、Input、Button、DropdownMenu 等组件组合。",
    install: "pnpm dlx shadcn@latest add table button input dropdown-menu checkbox\nnpm install @tanstack/react-table",
    code: `const [columnVisibility, setColumnVisibility] = React.useState({})

const table = useReactTable({
  data,
  columns,
  getCoreRowModel: getCoreRowModel(),
  getFilteredRowModel: getFilteredRowModel(),
  onColumnVisibilityChange: setColumnVisibility,
  state: { columnVisibility },
})

<Input
  value={(table.getColumn("component")?.getFilterValue() as string) ?? ""}
  onChange={(event) => table.getColumn("component")?.setFilterValue(event.target.value)}
/>

<DropdownMenu>
  <DropdownMenuContent align="end">
    {table.getAllColumns().filter((column) => column.getCanHide()).map((column) => (
      <DropdownMenuCheckboxItem
        key={column.id}
        checked={column.getIsVisible()}
        onCheckedChange={(value) => column.toggleVisibility(!!value)}
      >
        {column.id}
      </DropdownMenuCheckboxItem>
    ))}
  </DropdownMenuContent>
</DropdownMenu>`,
    example: <DataTableExample />,
  },
  {
    id: "design-tokens",
    group: "Design",
    name: "Design Tokens 变量",
    badge: "Tokens",
    description: "语义变量直接定义在 src/index.css 中，并通过 @theme inline 暴露为 Tailwind 设计 token。",
    install: "无需安装。直接维护 src/index.css 中的 :root / .dark / @theme inline。",
    code: `:root {
  --radius: 0.625rem;
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
}`,
    example: (
      <div className="w-full max-w-4xl space-y-4">
        {tokenGroups.map((group) => (
          <Card key={group.title}>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{group.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>变量</TableHead>
                    <TableHead>语义</TableHead>
                    <TableHead>Light OKLCH</TableHead>
                    <TableHead>Light HEX</TableHead>
                    <TableHead>Dark OKLCH</TableHead>
                    <TableHead>Dark HEX</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.items.map(([name, usage, light, lightHex, dark, darkHex]) => (
                    <TableRow key={name}>
                      <TableCell className="font-mono text-xs">{name}</TableCell>
                      <TableCell>{usage}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{light}</TableCell>
                      <TableCell className="font-mono text-xs">{lightHex}</TableCell>
                      <TableCell className="font-mono text-xs text-muted-foreground">{dark}</TableCell>
                      <TableCell className="font-mono text-xs">{darkHex}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
  },
  {
    id: "design-colors",
    group: "Design",
    name: "Color System 颜色",
    badge: "Color",
    description: "颜色采用语义命名，不直接在业务组件里写死具体值，浅色和暗色通过变量切换。",
    install: "通过 bg-background / text-foreground / border-border 等 token 类使用。",
    code: `<div className="bg-background text-foreground" />
<div className="bg-card text-card-foreground" />
<Button className="bg-primary text-primary-foreground" />`,
    example: (
      <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {colorSwatches.map((swatch) => (
          <Card key={swatch.name}>
            <CardContent className="space-y-3 p-4">
              <div className={`h-20 rounded-xl ring-1 ${swatch.sample} ${swatch.ring}`} />
              <div className="space-y-1">
                <div className="font-medium">{swatch.name}</div>
                <div className="font-mono text-xs text-muted-foreground">{swatch.token}</div>
                <div className="font-mono text-xs text-muted-foreground">{swatch.classToken}</div>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px]">
                  <div>
                    <div className="text-muted-foreground">Light HEX</div>
                    <div className="font-mono">{swatch.light}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Dark HEX</div>
                    <div className="font-mono">{swatch.dark}</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
  },
  {
    id: "design-radius",
    group: "Design",
    name: "Radius 圆角",
    badge: "Shape",
    description: "圆角基于单一 --radius 派生，组件使用 sm/md/lg/xl/2xl 等层级，保证边界语言统一。",
    install: "使用 rounded-sm / rounded-md / rounded-lg / rounded-xl / rounded-2xl 等类名。",
    code: `@theme inline {
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
}`,
    example: (
      <div className="grid w-full max-w-4xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {radiusScale.map(([token, value, className]) => (
          <Card key={token}>
            <CardContent className="space-y-3 p-4">
              <div className={`flex h-24 items-center justify-center border bg-muted/40 ${className}`}>
                <span className="text-sm font-medium">{value}</span>
              </div>
              <div className="space-y-1">
                <div className="font-mono text-xs">{token}</div>
                <div className="font-mono text-xs text-muted-foreground">{className}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
  },
  {
    id: "design-spacing",
    group: "Design",
    name: "Spacing 间距",
    badge: "Spacing",
    description: "页面与组件统一使用 Tailwind spacing scale，优先保持 4 / 8 / 12 / 16 / 24 / 32 的节奏。",
    install: "使用 gap-2 / gap-4 / gap-6 / p-4 / p-6 / py-3 等 spacing token。",
    code: `<div className="space-y-4" />
<CardContent className="p-6" />
<SidebarContent className="px-4 py-5" />`,
    example: (
      <div className="w-full max-w-4xl space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">间距层级</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Token</TableHead>
                  <TableHead>尺寸</TableHead>
                  <TableHead>用途</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {spacingScale.map(([token, size, usage]) => (
                  <TableRow key={token}>
                    <TableCell className="font-mono text-xs">{token}</TableCell>
                    <TableCell>{size}</TableCell>
                    <TableCell>{usage}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    ),
  },
  {
    id: "design-borders",
    group: "Design",
    name: "Border / Ring 边界",
    badge: "Border",
    description: "边框和聚焦描边使用语义 token，不直接写死灰度值，保证浅色/暗色切换后边界仍然稳定。",
    install: "使用 border-border、border-input、outline-ring/50、focus-visible:ring-2 等类名。",
    code: `* {
  @apply border-border outline-ring/50;
}

<Input className="border-input" />
<Button className="focus-visible:ring-2" />`,
    example: (
      <div className="grid w-full max-w-4xl gap-4 md:grid-cols-3">
        {borderRules.map(([title, token, usage]) => (
          <Card key={title}>
            <CardContent className="space-y-4 p-4">
              <div className="rounded-xl border border-border bg-card p-4">
                <div className="rounded-lg border border-input px-3 py-2 text-sm">Input Surface</div>
                <div className="mt-3 rounded-lg ring-2 ring-ring/50 px-3 py-2 text-sm">Focus Ring</div>
              </div>
              <div className="space-y-1">
                <div className="font-medium">{title}</div>
                <div className="font-mono text-xs text-muted-foreground">{token}</div>
                <div className="text-sm text-muted-foreground">{usage}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
  },
  {
    id: "design-elevation",
    group: "Design",
    name: "Elevation 阴影",
    badge: "Shadow",
    description: "当前系统整体偏克制，优先通过边框和背景层次区分，阴影只保留少量等级。",
    install: "使用 shadow-none、shadow-sm、shadow-md；正文文档区域默认少阴影。",
    code: `<Card className="shadow-none" />
<PopoverContent className="shadow-md" />
<SidebarInset className="shadow-sm" />`,
    example: (
      <div className="grid w-full max-w-4xl gap-4 md:grid-cols-3">
        {elevationScale.map(([label, className, usage]) => (
          <Card key={label}>
            <CardContent className="space-y-4 p-4">
              <div className={`rounded-xl border bg-card p-6 ${className}`}>
                <div className="text-sm font-medium">{label}</div>
              </div>
              <div className="space-y-1">
                <div className="font-mono text-xs text-muted-foreground">{className}</div>
                <div className="text-sm text-muted-foreground">{usage}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    ),
  },
  {
    id: "typography",
    group: "Design",
    name: "Typography 排版",
    badge: "Content",
    description: "排版不是单一交互组件，但页面中用 shadcn 样式 token 组织标题、段落、列表、代码和表格。",
    install: "Typography 是文档排版规范，不需要安装单一组件。",
    code: `html {
  @apply font-sans;
}

@theme inline {
  --font-sans: 'Geist Variable', sans-serif;
  --font-heading: var(--font-sans);
}`,
    example: (
      <div className="w-full max-w-4xl space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">字体层级</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            {typographyScale.map((item) => (
              <div key={item.label} className="space-y-2">
                <div className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{item.label}</div>
                <div className={item.className}>{item.sample}</div>
              </div>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">正文规则</CardTitle>
          </CardHeader>
          <CardContent>
            <article className="space-y-4">
              <p className="text-base leading-7">
                正文使用 Geist Variable，标题使用更高字重和更紧的 tracking，说明文案退到 muted-foreground。
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                <li>页面标题使用 `text-4xl font-semibold tracking-tight`。</li>
                <li>组件说明使用 `text-sm` 或 `text-base`，避免信息层级混乱。</li>
                <li>代码片段统一使用圆角容器和等宽字体。</li>
              </ul>
              <code className="rounded-md bg-muted px-2 py-1 text-sm">font-sans: Geist Variable</code>
            </article>
          </CardContent>
        </Card>
      </div>
    ),
  },
]

const groups = ["Design", "Basic", "Forms", "Overlay", "Navigation", "Layout", "Data", "Feedback", "Controls"]

function App() {
  const [query, setQuery] = React.useState("")
  const [isDark, setIsDark] = React.useState(() => document.documentElement.classList.contains("dark"))
  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(() =>
    Object.fromEntries(groups.map((group) => [group, true]))
  )
  const initialId = window.location.hash.replace("#", "") || docs[0].id
  const [activeId, setActiveId] = React.useState(docs.some((doc) => doc.id === initialId) ? initialId : docs[0].id)
  const active = docs.find((doc) => doc.id === activeId) ?? docs[0]
  const isDesignDoc = active.group === "Design"
  const filtered = docs.filter((doc) => `${doc.name} ${doc.group} ${doc.description}`.toLowerCase().includes(query.toLowerCase()))
  const activeSource = active.source ?? sourcePath(active.id)
  const activeSourcePreview = active.sourcePreview ?? sourcePreviewById[active.id]

  React.useEffect(() => {
    window.history.replaceState(null, "", `#${activeId}`)
  }, [activeId])

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark)
  }, [isDark])

  React.useEffect(() => {
    const syncHash = () => {
      const id = window.location.hash.replace("#", "")
      if (docs.some((doc) => doc.id === id)) {
        setActiveId(id)
      }
    }

    window.addEventListener("hashchange", syncHash)
    return () => window.removeEventListener("hashchange", syncHash)
  }, [])

  return (
    <TooltipProvider>
      <SidebarProvider defaultOpen>
        <div className="flex h-screen w-full overflow-hidden bg-background text-foreground">
          <Sidebar collapsible="none" className="border-r">
            <SidebarHeader className="shrink-0 gap-4 border-b bg-sidebar px-4 py-5">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <h2 className="text-2xl font-semibold tracking-tight">shadcn/ui Docs</h2>
                  <p className="text-sm text-muted-foreground">真实组件预览</p>
                </div>
                <Button variant="outline" size="icon" aria-label="切换暗黑模式" onClick={() => setIsDark((value) => !value)}>
                  {isDark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
                </Button>
              </div>
              <div className="relative">
                <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <SidebarInput
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-11 rounded-xl pl-10 text-base"
                  placeholder="搜索组件"
                />
              </div>
            </SidebarHeader>
            <SidebarSeparator />
            <SidebarContent className="min-h-0 flex-1 overflow-y-auto px-4 py-5">
              {groups.map((group) => {
                const items = filtered.filter((doc) => doc.group === group)
                if (!items.length) return null
                const groupMeta = GROUP_META[group]
                const GroupIcon = groupMeta.icon
                const isOpen = query ? true : openGroups[group]

                return (
                  <Collapsible
                    key={group}
                    open={isOpen}
                    onOpenChange={(open) => setOpenGroups((current) => ({ ...current, [group]: open }))}
                  >
                    <SidebarMenu className="gap-2">
                      <SidebarMenuItem>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            className="h-12 rounded-xl px-2 text-[15px] font-medium"
                            tooltip={groupMeta.label}
                          >
                            <GroupIcon className="size-4" />
                            <span>{groupMeta.label}</span>
                            {isOpen ? <ChevronDownIcon className="ml-auto size-5 shrink-0" /> : <ChevronRightIcon className="ml-auto size-5 shrink-0" />}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pt-2">
                          <SidebarMenuSub className="ml-4 mr-1 gap-2 py-1">
                            {items.map((doc) => (
                              <SidebarMenuSubItem key={doc.id}>
                                <SidebarMenuSubButton
                                  isActive={activeId === doc.id}
                                  className="h-auto min-h-11 rounded-lg px-4 py-2 text-[15px]"
                                  onClick={() => setActiveId(doc.id)}
                                >
                                  <span>{doc.name}</span>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </Collapsible>
                )
              })}
            </SidebarContent>
            <SidebarSeparator />
            <SidebarFooter className="shrink-0 px-4 py-4">
              <div className="rounded-lg border border-sidebar-border bg-sidebar-accent/30 px-3 py-2 text-xs text-sidebar-foreground/70">
                已收录 {docs.length} 个组件示例
              </div>
            </SidebarFooter>
            <SidebarRail />
          </Sidebar>

          <SidebarInset className="min-w-0 overflow-y-auto">
        <main className="min-h-full min-w-0 p-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-4 flex items-center gap-2 md:hidden">
              <SidebarTrigger />
              <span className="text-sm text-muted-foreground">导航</span>
            </div>
            <header className="mb-6 flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight">{active.name}</h1>
                <p className="max-w-3xl text-base text-muted-foreground">{active.description}</p>
              </div>
              <Button variant="outline" onClick={() => navigator.clipboard.writeText(active.install)}>复制安装命令</Button>
            </header>
            <Tabs defaultValue="preview" className="w-full">
              <TabsList className="w-fit">
                <TabsTrigger value="preview" className="flex-none">预览</TabsTrigger>
                <TabsTrigger value="install" className="flex-none">安装</TabsTrigger>
                <TabsTrigger value="implementation" className="flex-none">实现</TabsTrigger>
                {!isDesignDoc ? <TabsTrigger value="source" className="flex-none">源码</TabsTrigger> : null}
              </TabsList>
              <TabsContent value="preview" className="mt-6">
                <div className="space-y-4">
                  <div className="flex min-h-[420px] items-center justify-center rounded-xl border bg-background p-8">
                    {active.example}
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    {active.description}
                  </p>
                </div>
              </TabsContent>
              <TabsContent value="install" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">安装</CardTitle>
                    <CardDescription>当前章节对应的安装方式或维护位置。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="overflow-auto rounded-lg bg-muted p-4 text-sm text-foreground"><code>{active.install}</code></pre>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="implementation" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">实现</CardTitle>
                    <CardDescription>推荐直接复用本地组件和 token，不额外写平行样式。</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <pre className="overflow-auto rounded-lg bg-muted p-4 text-sm text-foreground"><code>{active.code}</code></pre>
                  </CardContent>
                </Card>
              </TabsContent>
              {!isDesignDoc ? (
                <TabsContent value="source" className="mt-6 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">源码位置</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <pre className="overflow-auto rounded-lg bg-muted p-4 text-sm text-foreground"><code>{activeSource}</code></pre>
                    </CardContent>
                  </Card>
                  {activeSourcePreview ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg">源码片段</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <pre className="max-h-72 overflow-auto rounded-lg bg-muted p-4 text-sm text-foreground"><code>{activeSourcePreview}</code></pre>
                      </CardContent>
                    </Card>
                  ) : null}
                </TabsContent>
              ) : null}
            </Tabs>
          </div>
        </main>
          </SidebarInset>
        </div>
        <Toaster />
      </SidebarProvider>
    </TooltipProvider>
  )
}

export default App
