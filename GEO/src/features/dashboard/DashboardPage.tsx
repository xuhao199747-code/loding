import {
  ArrowDown,
  AtSign,
  Backpack,
  BookMinus,
  Brain,
  ChevronDown,
  Ellipsis,
  FileText,
  LoaderCircle,
  Plus,
  Route,
} from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation } from "react-router-dom"
import { Conversation, ConversationContent, ConversationScrollButton } from "@/components/ai-elements/conversation"
import { Message, MessageContent, MessageResponse } from "@/components/ai-elements/message"
import {
  PromptInput,
  PromptInputActionMenu,
  PromptInputActionMenuContent,
  PromptInputActionMenuItem,
  PromptInputActionMenuTrigger,
  PromptInputBody,
  PromptInputFooter,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputTools,
  type PromptInputMessage,
} from "@/components/ai-elements/prompt-input"
import { AsciiGlitchBackground } from "@/components/common/AsciiGlitchBackground"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import agentData from "@/assets/agent-data-badge.png"
import agentStrategy from "@/assets/agent-strategy-badge.png"
import agentWriter from "@/assets/agent-writer-badge.png"
import dataMascot from "@/assets/data-agent-mascot-loop.webm"
import dataMascotPoster from "@/assets/data-agent-mascot-loop-first-frame.png"
import multiAgentMascot from "@/assets/multi-agent-mascot-loop.webm"
import multiAgentMascotPoster from "@/assets/multi-agent-mascot-first-frame.png"
import multiAgentTabIcon from "@/assets/multi-agent-tab-icon.png"
import mascot from "@/assets/strategy-agent-mascot.webm"
import mascotPoster from "@/assets/strategy-agent-mascot-first-frame.png"
import writerMascot from "@/assets/writer-agent-mascot-loop.webm"
import writerMascotPoster from "@/assets/writer-agent-mascot-loop-first-frame.png"

type AgentId = "multi" | "data" | "strategy" | "writer"

type AgentMenuItem = {
  id: AgentId
  title: string
  tabTitle: string
  heading: string
  image: string
  mascotVideo: string
  mascotPoster: string
  placeholder: string
  suggestions: typeof suggestions
}

type HistoryMenuItem = {
  title: string
  meta: string
  active?: boolean
}

const suggestions = [
  { icon: Backpack, iconColor: "text-blue-500", text: "为品牌生成GEO全量策略方案" },
  { icon: BookMinus, iconColor: "text-emerald-600", text: "分析竟品AI可见度差距报告" },
  { icon: Route, iconColor: "text-orange-500", text: "制定AI平台90天策略优化路线" },
]

const agents: AgentMenuItem[] = [
  {
    id: "multi",
    title: "Multi-Agent",
    tabTitle: "Multi-Agent",
    heading: "今天聚焦哪个品牌？",
    image: multiAgentTabIcon,
    mascotVideo: multiAgentMascot,
    mascotPoster: multiAgentMascotPoster,
    placeholder: "分配一个任务，或 @ 委派给某位 Agent...",
    suggestions,
  },
  {
    id: "data",
    title: "DataAgent",
    tabTitle: "DataAgent",
    heading: "你的品牌数据分析师",
    image: agentData,
    mascotVideo: dataMascot,
    mascotPoster: dataMascotPoster,
    placeholder: "我能为您做些什么？",
    suggestions,
  },
  {
    id: "strategy",
    title: "Strategy Agent",
    tabTitle: "Strategy Agent",
    heading: "你的GEO 品牌策略师",
    image: agentStrategy,
    mascotVideo: mascot,
    mascotPoster,
    placeholder: "我能为您做些什么？",
    suggestions,
  },
  {
    id: "writer",
    title: "Writer Agent",
    tabTitle: "Writer Agent",
    heading: "你的内容创作师",
    image: agentWriter,
    mascotVideo: writerMascot,
    mascotPoster: writerMascotPoster,
    placeholder: "我能为您做些什么？",
    suggestions,
  },
]

const agentRouteMap: Record<string, AgentId> = {
  multi: "multi",
  "multi-agent": "multi",
  data: "data",
  "data-agent": "data",
  strategy: "strategy",
  "strategy-agent": "strategy",
  writer: "writer",
  "writer-agent": "writer",
}

const tasks = [
  "实时监控alibaba.com排名情况",
  "实时监控alibaba.com排名情况",
  "实时监控alibaba.com排名情况",
]

const histories: HistoryMenuItem[] = [
  { title: "数据大盘", meta: "Data", active: true },
  { title: "定时任务", meta: "Strategy" },
  { title: "个性化", meta: "Writer" },
]

function AgentMascot({ poster, src }: { poster: string; src: string }) {
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null)
  const isLoaded = loadedSrc === src
  const mascotStyle = { right: 0, top: -16, width: 160, height: 160 }

  useEffect(() => {
    setLoadedSrc(null)
  }, [src])

  return (
    <>
      <img
        src={poster}
        alt=""
        aria-hidden="true"
        data-testid="strategy-agent-mascot-poster"
        className={cn(
          "pointer-events-none absolute scale-x-[-1] object-cover transition-opacity duration-150",
          isLoaded ? "opacity-0" : "opacity-100",
        )}
        style={mascotStyle}
      />
      <video
        key={src}
        src={src}
        poster={poster}
        aria-hidden="true"
        data-testid="strategy-agent-mascot"
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setLoadedSrc(src)}
        className={cn(
          "pointer-events-none absolute scale-x-[-1] object-cover transition-opacity duration-150",
          isLoaded ? "opacity-100" : "opacity-0",
        )}
        style={mascotStyle}
      />
    </>
  )
}

export function DashboardPage() {
  const location = useLocation()
  const routeAgentId = agentRouteMap[new URLSearchParams(location.search).get("agent") ?? ""] ?? "multi"
  const [activeAgentId, setActiveAgentId] = useState<AgentId>(routeAgentId)
  const [promptValue, setPromptValue] = useState("")
  const [conversationPrompt, setConversationPrompt] = useState("")
  const [hasConversation, setHasConversation] = useState(false)
  const hasPromptValue = promptValue.trim().length > 0
  const activeAgent = agents.find((agent) => agent.id === activeAgentId) ?? agents[0]

  useEffect(() => {
    setActiveAgentId(routeAgentId)
  }, [routeAgentId])

  const handleSubmit = (message: PromptInputMessage) => {
    const nextPrompt = message.text.trim() || promptValue.trim()

    if (!nextPrompt) {
      return
    }

    setConversationPrompt(nextPrompt)
    setPromptValue("")
    setHasConversation(true)
  }

  return (
    <div className="flex h-screen min-h-[720px] overflow-hidden bg-white text-app-ink">
      <AgentSidebar
        onNewConversation={() => {
          setPromptValue("")
          setConversationPrompt("")
          setHasConversation(false)
        }}
        onSelectHistory={(agentId) => {
          setActiveAgentId(agentId)
          setPromptValue("")
          setConversationPrompt("为公众生成5篇文章，每篇约500字，稍微幽默和轻松，使用英语，并符合基本的SEO要求。")
          setHasConversation(true)
        }}
      />
      <main
        className={cn(
          "relative flex min-w-0 flex-1 overflow-hidden bg-white",
          hasConversation ? "items-stretch justify-center px-0 py-3" : "items-center justify-center px-5 py-4",
        )}
      >
        {!hasConversation ? (
          <div data-testid="dashboard-ascii-background">
            <AsciiGlitchBackground />
          </div>
        ) : null}
        {hasConversation ? (
          <AgentConversationView
            activeAgent={activeAgent}
            prompt={conversationPrompt}
            promptValue={promptValue}
            hasPromptValue={hasPromptValue}
            onPromptChange={setPromptValue}
            onSubmit={handleSubmit}
          />
        ) : (
        <div className="relative z-10 flex w-[900px] max-w-[calc(100%-40px)] flex-col gap-10">
          <AgentMascot src={activeAgent.mascotVideo} poster={activeAgent.mascotPoster} />
          <section className="relative flex flex-col gap-4">
            <div className="flex flex-col items-start gap-4">
              <h1 className="text-2xl font-semibold leading-8 tracking-normal text-app-ink">
                {activeAgent.heading}
              </h1>
              <div
                data-testid="agent-mode-tabs"
                className="flex items-center gap-1 rounded-full border border-app-control-border bg-app-control-bg/80 p-1 backdrop-blur-[2px]"
              >
                {agents.map((agent) => (
                  <Button
                    key={agent.id}
                    type="button"
                    variant="ghost"
                    onClick={() => setActiveAgentId(agent.id)}
                    className={cn(
                      "flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full px-3 py-1 text-sm font-normal leading-5 text-app-muted shadow-none transition-colors hover:bg-white/70",
                      agent.id === "multi" && "pl-1",
                      agent.id === activeAgentId && "bg-white text-app-ink",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full",
                      )}
                    >
                      <img
                        src={agent.image}
                        alt=""
                        className="size-8 max-w-none object-contain"
                      />
                    </span>
                    {agent.tabTitle}
                  </Button>
                ))}
              </div>
            </div>
            <AgentPromptInput
              placeholder={activeAgent.placeholder}
              value={promptValue}
              hasValue={hasPromptValue}
              onValueChange={setPromptValue}
              onSubmit={handleSubmit}
            />
          </section>

          <section className="flex flex-col">
            <div className="text-sm leading-[22px]">快速开始：</div>
            <div
              data-testid="quick-start-suggestions"
              className="no-scrollbar flex w-full gap-2 overflow-x-auto overflow-y-hidden pb-4 pt-3"
            >
              {activeAgent.suggestions.map((suggestion) => (
                <Button
                  key={suggestion.text}
                  type="button"
                  variant="outline"
                  onClick={() => setPromptValue(suggestion.text)}
                  className="flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-full border-app-control-border bg-white px-4 py-2 text-sm font-normal leading-5 text-app-ink shadow-none hover:bg-white"
                >
                  <suggestion.icon className={cn("size-4", suggestion.iconColor)} />
                  {suggestion.text}
                </Button>
              ))}
            </div>
          </section>
        </div>
        )}
      </main>
    </div>
  )
}

function AgentConversationView({
  activeAgent,
  hasPromptValue,
  onPromptChange,
  onSubmit,
  prompt,
  promptValue,
}: {
  activeAgent: AgentMenuItem
  hasPromptValue: boolean
  onPromptChange: (value: string) => void
  onSubmit: (message: PromptInputMessage) => void
  prompt: string
  promptValue: string
}) {
  const [responseStage, setResponseStage] = useState(0)

  useEffect(() => {
    setResponseStage(0)

    const reasoningTimer = window.setTimeout(() => setResponseStage(1), 80)
    const answerTimer = window.setTimeout(() => setResponseStage(2), 180)
    const reportTimer = window.setTimeout(() => setResponseStage(3), 300)

    return () => {
      window.clearTimeout(reasoningTimer)
      window.clearTimeout(answerTimer)
      window.clearTimeout(reportTimer)
    }
  }, [prompt])

  return (
    <div className="relative z-10 flex h-full w-full flex-col">
      <header className="flex h-8 shrink-0 items-center px-4 text-base font-medium leading-6 text-app-ink">
        {activeAgent.title}
      </header>
      <Conversation className="min-h-0 flex-1 overflow-hidden">
        <ConversationContent className="mx-auto min-h-full w-[700px] max-w-[calc(100%-40px)] gap-6 px-0 pb-[148px] pt-4">
          <div className="flex justify-center text-xs font-normal leading-4 text-app-muted">02月13日12:00</div>
          <Message from="user" className="max-w-full">
            <MessageContent className="max-w-[400px] rounded-lg bg-app-panel px-4 py-3 text-sm font-normal leading-5 text-app-ink">
              {prompt}
            </MessageContent>
          </Message>
          <Message from="assistant" className="max-w-full">
            <MessageContent className="w-[400px] max-w-full gap-4 text-app-ink">
              <div className="text-sm font-medium leading-5">AlphaRank</div>
              {responseStage === 0 ? <GeneratingStatus /> : null}
              {responseStage >= 1 ? <ReasoningBlock thinking={responseStage < 2} /> : null}
              {responseStage >= 2 ? (
                <MessageResponse className="text-sm font-normal leading-5 text-app-ink">
                  数据分析完成。「品牌」当前 AI 可见度得分 62/100（上周 59），过去 28 天提及率升至 26.4%，情感正面率 61%。竞对 Semrush 已达 41%，文心一言提及率下滑 3.2%，已触发预警。完整趋势图表已发送单聊。
                </MessageResponse>
              ) : null}
              {responseStage >= 3 ? <ReportCard /> : null}
            </MessageContent>
          </Message>
        </ConversationContent>
        <ConversationScrollButton className="bottom-[112px] size-9 rounded-full border-app-border bg-white text-app-ink shadow-xs hover:bg-white">
          <ArrowDown className="size-4" />
        </ConversationScrollButton>
      </Conversation>
      <div className="absolute bottom-6 left-1/2 w-[700px] max-w-[calc(100%-40px)] -translate-x-1/2">
        <AgentPromptInput
          placeholder={activeAgent.placeholder}
          value={promptValue}
          hasValue={hasPromptValue}
          onValueChange={onPromptChange}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  )
}

function GeneratingStatus() {
  return (
    <div className="flex items-center gap-2 text-sm font-normal leading-5 text-app-muted" aria-live="polite">
      <LoaderCircle className="size-4 animate-spin" />
      正在理解问题并准备分析上下文...
    </div>
  )
}

function ReasoningBlock({ thinking }: { thinking: boolean }) {
  const [open, setOpen] = useState(true)

  return (
    <div className="flex flex-col gap-3">
      <Button
        type="button"
        variant="ghost"
        onClick={() => setOpen((value) => !value)}
        className="h-5 w-fit gap-2 rounded-none bg-transparent p-0 text-sm font-normal leading-5 text-app-ink shadow-none hover:bg-transparent"
      >
        <Brain className={cn("size-4", thinking && "animate-pulse")} />
        <span>{thinking ? "Thinking..." : "Thought for 4 seconds"}</span>
        <ChevronDown className={cn("size-4 transition-transform", open && "rotate-180")} />
      </Button>
      {open ? (
        <p className="pb-1 text-sm font-normal leading-5 text-app-muted">
          正在拆分任务目标、品牌数据、内容长度与语气要求，并检查是否需要引用 GEO 报告、历史监控结果和竞品趋势。
        </p>
      ) : null}
    </div>
  )
}

function ReportCard() {
  return (
    <div className="flex h-12 w-full items-center gap-4 rounded-lg border border-app-border bg-white p-4">
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <FileText className="size-4 shrink-0 text-blue-500" />
        <span className="truncate text-sm font-medium leading-[22px] text-app-ink">品牌 AI 可见度 28 天趋势</span>
      </div>
      <Ellipsis className="size-4 shrink-0 text-app-muted" />
    </div>
  )
}

function AgentPromptInput({
  hasValue,
  onSubmit,
  onValueChange,
  placeholder,
  value,
}: {
  hasValue: boolean
  onSubmit: (message: PromptInputMessage) => void
  onValueChange: (value: string) => void
  placeholder: string
  value: string
}) {
  return (
    <PromptInput
      onSubmit={onSubmit}
      className="w-full rounded-[24px] border border-app-control-border bg-white shadow-none transition-colors focus-within:border-app-ink"
      inputGroupClassName="rounded-[23px] border-0 shadow-none has-[[data-slot=input-group-control]:focus-visible]:border-0 has-[[data-slot=input-group-control]:focus-visible]:ring-0"
    >
      <PromptInputBody>
        <PromptInputTextarea
          placeholder={placeholder}
          value={value}
          onChange={(event) => onValueChange(event.currentTarget.value)}
          className="min-h-[72px] resize-none border-0 bg-transparent p-3 text-base shadow-none focus-visible:ring-0"
        />
      </PromptInputBody>
      <PromptInputFooter className="px-3 pb-3 pt-1.5">
        <PromptInputTools>
          <PromptInputActionMenu>
            <PromptInputActionMenuTrigger className="size-8 rounded-md bg-transparent text-app-muted hover:bg-app-panel">
              <AtSign className="size-4" />
            </PromptInputActionMenuTrigger>
            <PromptInputActionMenuContent>
              <PromptInputActionMenuItem>引用品牌数据</PromptInputActionMenuItem>
              <PromptInputActionMenuItem>引用诊断报告</PromptInputActionMenuItem>
            </PromptInputActionMenuContent>
          </PromptInputActionMenu>
        </PromptInputTools>
        <PromptInputSubmit
          disabled={!hasValue}
          className={cn(
            "size-8 rounded-md bg-app-orange text-white hover:bg-app-orange/90",
            hasValue ? "opacity-100" : "opacity-60",
          )}
        />
      </PromptInputFooter>
    </PromptInput>
  )
}

function AgentSidebar({
  onNewConversation,
  onSelectHistory,
}: {
  onNewConversation: () => void
  onSelectHistory: (agentId: AgentId) => void
}) {
  const historyAgentMap: Record<string, AgentId> = {
    数据大盘: "data",
    定时任务: "strategy",
    个性化: "writer",
  }

  return (
    <aside className="flex h-full w-[280px] shrink-0 flex-col gap-4 border-r border-app-border bg-white p-3">
      <div className="flex h-8 items-center">
        <div className="text-lg font-medium leading-[26px]">营销Agent</div>
      </div>
      <Button
        type="button"
        onClick={onNewConversation}
        className="h-10 w-full justify-center gap-2 rounded-lg border border-app-orange bg-app-orange text-sm font-medium text-white shadow-none hover:bg-app-orange/90"
      >
        <Plus className="size-4" />
        新建对话
      </Button>
      <div className="flex min-h-0 flex-1 flex-col gap-4 px-2">
        <section className="flex flex-col gap-2 overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="min-w-0 flex-1 text-xs font-medium leading-4 text-app-muted">任务</div>
            <Plus className="size-4 shrink-0 text-app-muted" />
          </div>
          {tasks.map((task, index) => (
            <Button
              key={`${task}-${index}`}
              type="button"
              variant="ghost"
              className="flex h-8 w-full items-center justify-start overflow-hidden rounded-md px-2 text-left text-sm font-normal leading-5 shadow-none hover:bg-app-panel"
            >
              <span className="min-w-0 flex-1 truncate">{task}</span>
            </Button>
          ))}
        </section>
        <section className="flex flex-col overflow-hidden">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1 text-xs font-medium leading-4 text-app-muted">历史记录</div>
            <ChevronDown className="size-4 shrink-0 text-app-muted" />
          </div>
          <div className="mt-2 flex flex-col gap-1">
            {histories.map((history) => (
              <Button
                key={history.title}
                type="button"
                variant="ghost"
                onClick={() => onSelectHistory(historyAgentMap[history.title] ?? "data")}
                className="flex h-8 w-full items-center justify-start gap-2 rounded-md px-2 text-left text-sm font-normal leading-5 shadow-none hover:bg-app-panel"
              >
                <span className="min-w-0 flex-1 truncate">{history.title}</span>
                <span className="shrink-0 text-xs font-normal text-app-muted">{history.meta}</span>
              </Button>
            ))}
          </div>
        </section>
      </div>
    </aside>
  )
}
