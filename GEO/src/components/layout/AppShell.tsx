import { Outlet } from "react-router-dom"
import { SidebarNav } from "@/components/layout/SidebarNav"
import { Topbar } from "@/components/layout/Topbar"

export function AppShell() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="grid min-h-screen grid-cols-[248px_1fr] max-lg:grid-cols-1">
        <SidebarNav />
        <div className="flex min-w-0 flex-col">
          <Topbar />
          <main className="min-w-0 flex-1 bg-muted/30 p-6 max-md:p-4">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}
