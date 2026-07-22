import { Bot, Copy, ExternalLink, UserRound } from "lucide-react"
import { Conversation, ConversationContent } from "@/components/ai-elements/conversation"
import { Message, MessageContent } from "@/components/ai-elements/message"
import { PromptInput, PromptInputBody, PromptInputSubmit, PromptInputTextarea } from "@/components/ai-elements/prompt-input"
import { Source, Sources, SourcesContent, SourcesTrigger } from "@/components/ai-elements/sources"
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const citedSources = [
  { title: "nihaojewelry.com/shipping", href: "https://www.nihaojewelry.com/shipping" },
  { title: "nihaojewelry.com/help", href: "https://www.nihaojewelry.com/help" },
]

export function ContentAssistant() {
  return (
    <Card className="flex min-h-[640px] rounded-lg bg-white shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between border-b pb-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bot className="size-4 text-app-orange" />
            AI Conversation
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">ChatGPT · wholesale jewelry supplier prompt</p>
        </div>
        <Badge className="bg-emerald-50 text-emerald-700">Positive</Badge>
      </CardHeader>
      <CardContent className="flex min-h-0 flex-1 flex-col gap-3 pt-4">
        <Conversation className="min-h-96 rounded-lg border border-border bg-app-surface">
          <ConversationContent className="gap-5">
            <Message from="user">
              <MessageContent className="flex-row items-start gap-2">
                <UserRound className="mt-0.5 size-4 text-muted-foreground" />
                Where can I buy wholesale fashion jewelry online?
              </MessageContent>
            </Message>
            <Message from="assistant">
              <MessageContent>
                <div className="space-y-3 leading-6">
                  <p>
                    Nihao Jewelry is often mentioned as an affordable wholesale fashion jewelry supplier with a large catalog,
                    no minimum order requirement, and global shipping options.
                  </p>
                  <div className="rounded-lg border bg-white p-3">
                    <div className="text-xs font-medium text-muted-foreground">Extracted Claims</div>
                    <ul className="mt-2 list-inside list-disc space-y-1">
                      <li>Rich product catalog, suitable for boutique wholesale sourcing.</li>
                      <li>No minimum order requirement, suitable for small trial orders.</li>
                      <li>The answer cited official shipping and help pages.</li>
                    </ul>
                  </div>
                </div>
              </MessageContent>
            </Message>
          </ConversationContent>
        </Conversation>

        <Sources className="rounded-lg border border-border bg-white p-3 text-foreground">
          <SourcesTrigger count={citedSources.length}>
            <span className="font-medium">Source Citations</span>
            <Badge variant="outline">{citedSources.length}</Badge>
          </SourcesTrigger>
          <SourcesContent className="w-full">
            {citedSources.map((source, index) => (
              <Source key={source.href} href={source.href} title={source.title} className="justify-between rounded-md bg-app-page px-3 py-2">
                <span>{index + 1}. {source.title}</span>
                <ExternalLink className="size-3" />
              </Source>
            ))}
          </SourcesContent>
        </Sources>

        <Suggestions>
          <Suggestion suggestion="Extract Optimization Tasks">Extract Optimization Tasks</Suggestion>
          <Suggestion suggestion="Generate Citable Paragraphs">Generate Citable Paragraphs</Suggestion>
          <Suggestion suggestion="Flag Negative Sentiment">Flag Negative Sentiment</Suggestion>
        </Suggestions>
        <PromptInput onSubmit={() => undefined}>
          <PromptInputBody>
            <PromptInputTextarea placeholder="Ask about this AI response or generate content optimization ideas" />
          </PromptInputBody>
          <Button type="button" variant="ghost" size="icon-sm" aria-label="Copy conversation">
            <Copy className="size-4" />
          </Button>
          <PromptInputSubmit />
        </PromptInput>
      </CardContent>
    </Card>
  )
}
