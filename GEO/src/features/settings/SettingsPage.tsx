import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export function SettingsPage() {
  return (
    <div>
      <PageHeader title="设置" description="维护品牌资料、竞品、Prompt 库和模型展示偏好。" />
      <Tabs defaultValue="brand">
        <TabsList>
          <TabsTrigger value="brand">品牌资料</TabsTrigger>
          <TabsTrigger value="prompts">Prompt 库</TabsTrigger>
          <TabsTrigger value="models">模型展示</TabsTrigger>
        </TabsList>
        <TabsContent value="brand">
          <Card className="rounded-lg">
            <CardHeader><CardTitle className="text-base">品牌资料</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              <Input defaultValue="Nihao Jewelry" />
              <Input defaultValue="www.nihaojewelry.com" />
              <Textarea defaultValue="Wholesale fashion jewelry and accessories supplier." />
              <Button className="w-fit">保存</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="prompts">
          <Card className="rounded-lg">
            <CardContent className="p-4 text-sm text-muted-foreground">批发采购、物流与服务、竞品对比。</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="models">
          <Card className="rounded-lg">
            <CardContent className="p-4 text-sm text-muted-foreground">ChatGPT、Perplexity、Gemini、Claude 仅作为前端 mock 展示。</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
