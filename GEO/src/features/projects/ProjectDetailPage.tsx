import { useEffect, useState } from "react"
import { PageHeader } from "@/components/common/PageHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Project } from "@/lib/types"
import { getProject } from "@/features/projects/project-service"

export function ProjectDetailPage() {
  const [project, setProject] = useState<Project | null>(null)

  useEffect(() => {
    void getProject("project-nihao").then(setProject)
  }, [])

  return (
    <div>
      <PageHeader title="项目详情" description={project ? `${project.brandName} · ${project.domain}` : "加载项目资料"} />
      <Tabs defaultValue="profile">
        <TabsList>
          <TabsTrigger value="profile">品牌资料</TabsTrigger>
          <TabsTrigger value="competitors">竞品</TabsTrigger>
          <TabsTrigger value="prompts">Prompt 组</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card className="rounded-lg">
            <CardHeader>
              <CardTitle className="text-base">{project?.brandName ?? "Nihao Jewelry"}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              当前市场：{project?.market ?? "北美"} · 语言：{project?.language ?? "中文 / English"}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="competitors">
          <Card className="rounded-lg">
            <CardContent className="p-4 text-sm text-muted-foreground">
              {(project?.competitors ?? []).map((competitor) => competitor.name).join("、")}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="prompts">
          <Card className="rounded-lg">
            <CardContent className="space-y-3 p-4 text-sm">
              {(project?.promptGroups ?? []).map((group) => (
                <div key={group.id}>
                  <div className="font-medium">{group.name}</div>
                  <div className="text-muted-foreground">{group.prompts.length} 个 Prompt</div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
