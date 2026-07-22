import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { DataTable } from "@/components/common/DataTable"
import { FilterBar } from "@/components/common/FilterBar"
import { PageHeader } from "@/components/common/PageHeader"
import { StatusBadge } from "@/components/common/StatusBadge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Project } from "@/lib/types"
import { formatDateTime } from "@/lib/format"
import { listProjects } from "@/features/projects/project-service"

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])

  useEffect(() => {
    void listProjects().then(setProjects)
  }, [])

  return (
    <div>
      <PageHeader
        title="Projects"
        description="Manage brands, domains, competitors, and prompt monitoring scope."
        actions={
          <Button size="sm" className="gap-2">
            <Plus className="size-4" />
            New Project
          </Button>
        }
      />
      <FilterBar searchPlaceholder="Search projects or domains" />
      <DataTable empty={projects.length === 0}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Projects</TableHead>
              <TableHead>Domain</TableHead>
              <TableHead>Market</TableHead>
              <TableHead>Competitors</TableHead>
              <TableHead>Prompt</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Last Diagnosis</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((project) => (
              <TableRow key={project.id}>
                <TableCell>
                  <Link className="font-medium hover:underline" to={`/projects/${project.id}`}>
                    {project.brandName}
                  </Link>
                  <div className="text-xs text-muted-foreground">{project.name}</div>
                </TableCell>
                <TableCell>{project.domain}</TableCell>
                <TableCell>{project.market}</TableCell>
                <TableCell>{project.competitors.length}</TableCell>
                <TableCell>{project.promptGroups.reduce((total, group) => total + group.prompts.length, 0)}</TableCell>
                <TableCell>
                  <StatusBadge tone="success">Monitoring</StatusBadge>
                </TableCell>
                <TableCell>{formatDateTime(project.lastRunAt)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
    </div>
  )
}
