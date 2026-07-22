import { Outlet, useLocation } from "react-router-dom"
import { SidebarNav } from "@/components/layout/SidebarNav"

export function AppShell() {
  const location = useLocation()
  const isFullCanvasRoute =
    location.pathname === "/" ||
    location.pathname === "/tasks" ||
    location.pathname === "/diagnosis" ||
    location.pathname === "/geo-diagnosis" ||
    location.pathname === "/answer-monitor" ||
    location.pathname === "/sentiment" ||
    location.pathname === "/content-studio" ||
    location.pathname === "/reports"

  return (
    <div className="h-screen overflow-hidden bg-app-panel text-foreground">
      <div className="grid h-screen grid-cols-[auto_1fr]">
        <SidebarNav />
        <div className="flex min-h-0 min-w-0 flex-col">
          {isFullCanvasRoute ? (
            <div className="min-w-0 flex-1 overflow-auto bg-white">
              <Outlet />
            </div>
          ) : (
            <main className="min-w-0 flex-1 overflow-auto bg-app-page">
              <div className="mx-auto min-h-screen w-full max-w-[1440px] px-6 py-6 max-md:px-4">
                <Outlet />
              </div>
            </main>
          )}
        </div>
      </div>
    </div>
  )
}
