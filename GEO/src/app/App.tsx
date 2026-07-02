import { BrowserRouter } from "react-router-dom"
import { AppRoutes } from "@/app/router"
import { Providers } from "@/app/providers"

export default function App() {
  return (
    <Providers>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </Providers>
  )
}
