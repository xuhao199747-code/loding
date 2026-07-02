import { Bot } from "lucide-react"
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation"
import { Message, MessageContent } from "@/components/ai-elements/message"
import { PromptInput, PromptInputBody, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function ContentAssistant() {
  return (
    <Card className="flex min-h-[560px] rounded-lg">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Bot className="size-4" />
          AI 内容助手
        </CardTitle>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3">
        <Conversation className="min-h-72 rounded-lg border border-border bg-muted/30">
          <ConversationContent>
            <Message from="assistant">
              <MessageContent>
                我会根据当前机会，帮你补充 FAQ、引用友好段落和 E-E-A-T 信号。先从运输时效 FAQ 开始会更稳。
              </MessageContent>
            </Message>
            <Message from="user">
              <MessageContent>帮我生成一组运输时效 FAQ。</MessageContent>
            </Message>
            <Message from="assistant">
              <MessageContent>
                可以。建议按订单处理时间、运输方式、地区差异、追踪方式、延迟处理五组问题展开，并在页面顶部标注最近更新时间。
              </MessageContent>
            </Message>
          </ConversationContent>
        </Conversation>
        <Suggestions>
          <Suggestion suggestion="生成 FAQ">生成 FAQ</Suggestion>
          <Suggestion suggestion="改写为 AI 可引用段落">改写为 AI 可引用段落</Suggestion>
          <Suggestion suggestion="补充 E-E-A-T 信号">补充 E-E-A-T 信号</Suggestion>
        </Suggestions>
        <PromptInput onSubmit={() => undefined}>
          <PromptInputBody>
            <PromptInputTextarea placeholder="输入你想优化的内容或 Prompt" />
          </PromptInputBody>
          <PromptInputSubmit />
        </PromptInput>
      </CardContent>
    </Card>
  )
}
