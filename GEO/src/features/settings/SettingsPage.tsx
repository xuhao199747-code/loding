import { PageHeader } from "@/components/common/PageHeader"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export function SettingsPage() {
  return (
    <div>
      <PageHeader title="Settings" description="Maintain brand profiles, competitors, prompt library, and model display preferences." />
      <Tabs defaultValue="brand">
        <TabsList>
          <TabsTrigger value="brand">Brand Profile</TabsTrigger>
          <TabsTrigger value="prompts">Prompt Library</TabsTrigger>
          <TabsTrigger value="models">Model Display</TabsTrigger>
        </TabsList>
        <TabsContent value="brand">
          <Card className="rounded-lg">
            <CardHeader><CardTitle className="text-base">Brand Profile</CardTitle></CardHeader>
            <CardContent className="grid gap-4">
              <Input defaultValue="Nihao Jewelry" />
              <Input defaultValue="www.nihaojewelry.com" />
              <Textarea defaultValue="Wholesale fashion jewelry and accessories supplier." />
              <Button className="w-fit">Save</Button>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="prompts">
          <Card className="rounded-lg">
            <CardContent className="p-4 text-sm text-muted-foreground">Wholesale sourcing, shipping and service, and competitor comparisons.</CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="models">
          <Card className="rounded-lg">
            <CardContent className="p-4 text-sm text-muted-foreground">ChatGPT, Perplexity, Gemini, and Claude are shown as frontend mocks only.</CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
