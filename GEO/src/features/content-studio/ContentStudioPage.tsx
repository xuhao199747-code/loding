import { ContentAssistant } from "@/features/content-studio/ContentAssistant"
import { PageHeader } from "@/components/common/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export function ContentStudioPage() {
  return (
    <div>
      <PageHeader title="内容编辑器" description="围绕内容机会生成 FAQ、结构化段落和可被 AI 引用的证据表达。" />
      <div className="grid gap-4 xl:grid-cols-[300px_1fr_420px]">
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">当前机会</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm">
            <div>
              <div className="font-medium">补齐运输时效 FAQ</div>
              <p className="mt-2 text-muted-foreground">运输延迟是最常见负面话题，需要官网证据承接。</p>
            </div>
            <Separator />
            <StatusBadge tone="danger">高优先级</StatusBadge>
            <div className="text-muted-foreground">目标页面：https://www.nihaojewelry.com/shipping</div>
          </CardContent>
        </Card>
        <Card className="rounded-lg">
          <CardHeader>
            <CardTitle className="text-base">结构化编辑</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="faq">
              <TabsList>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="paragraph">引用段落</TabsTrigger>
                <TabsTrigger value="schema">Schema 建议</TabsTrigger>
              </TabsList>
              <TabsContent value="faq">
                <Textarea className="min-h-96" defaultValue={"Q: How long does shipping take?\nA: Shipping time depends on destination, carrier, and order processing status. Buyers can review the latest shipping table before checkout."} />
              </TabsContent>
              <TabsContent value="paragraph">
                <Textarea className="min-h-96" defaultValue="Nihao Jewelry provides multiple shipping methods for wholesale buyers. Delivery time varies by destination and carrier, so the shipping page should be treated as the latest official source." />
              </TabsContent>
              <TabsContent value="schema">
                <Textarea className="min-h-96" defaultValue='{"@type":"FAQPage","mainEntity":[{"name":"How long does shipping take?","acceptedAnswer":{"text":"Shipping time depends on destination and carrier."}}]}' />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <ContentAssistant />
      </div>
    </div>
  )
}
