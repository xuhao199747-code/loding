import { getMockDiagnosisRuns, getMockProjects } from "@/services/mock-client"

export async function listProjects() {
  return getMockProjects()
}

export async function getProject(projectId: string) {
  const projects = await getMockProjects()
  return projects.find((project) => project.id === projectId) ?? projects[0]
}

export async function getProjectSummary() {
  const [projects, runs] = await Promise.all([getMockProjects(), getMockDiagnosisRuns()])
  return {
    project: projects[0],
    latestRun: runs[0],
  }
}
