import { getMockDiagnosisRuns } from "@/services/mock-client"

export async function listDiagnosisRuns() {
  return getMockDiagnosisRuns()
}

export async function getDiagnosisRun(runId: string) {
  const runs = await getMockDiagnosisRuns()
  return runs.find((run) => run.id === runId) ?? runs[0]
}

export async function getLatestDiagnosisRun() {
  const runs = await getMockDiagnosisRuns()
  return runs[0]
}
