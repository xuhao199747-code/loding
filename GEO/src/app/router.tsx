import { Route, Routes } from "react-router-dom"
import { AppShell } from "@/components/layout/AppShell"
import { AnswerMonitorPage } from "@/features/answer-monitor/AnswerMonitorPage"
import { CompetitorsPage } from "@/features/competitors/CompetitorsPage"
import { ContentStudioPage } from "@/features/content-studio/ContentStudioPage"
import { DashboardPage } from "@/features/dashboard/DashboardPage"
import { GeoDiagnosisDetailPage } from "@/features/geo-diagnosis/GeoDiagnosisDetailPage"
import { GeoDiagnosisPage } from "@/features/geo-diagnosis/GeoDiagnosisPage"
import { OpportunitiesPage } from "@/features/opportunities/OpportunitiesPage"
import { ProjectDetailPage } from "@/features/projects/ProjectDetailPage"
import { ProjectsPage } from "@/features/projects/ProjectsPage"
import { ReportsPage } from "@/features/reports/ReportsPage"
import { SentimentAnalysisPage } from "@/features/sentiment-analysis/SentimentAnalysisPage"
import { SettingsPage } from "@/features/settings/SettingsPage"
import { TasksPage } from "@/features/tasks/TasksPage"

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<DashboardPage />} />
        <Route path="projects" element={<ProjectsPage />} />
        <Route path="projects/:projectId" element={<ProjectDetailPage />} />
        <Route path="diagnosis" element={<GeoDiagnosisPage />} />
        <Route path="diagnosis/:runId" element={<GeoDiagnosisDetailPage />} />
        <Route path="answer-monitor" element={<AnswerMonitorPage />} />
        <Route path="sentiment" element={<SentimentAnalysisPage />} />
        <Route path="competitors" element={<CompetitorsPage />} />
        <Route path="opportunities" element={<OpportunitiesPage />} />
        <Route path="content-studio" element={<ContentStudioPage />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="reports" element={<ReportsPage />} />
        <Route path="settings" element={<SettingsPage />} />
      </Route>
    </Routes>
  )
}
