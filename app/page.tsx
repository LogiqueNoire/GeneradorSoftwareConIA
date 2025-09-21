import { Suspense } from "react"
import HomePageClient from "./HomePageClient"

export default function HomePage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <HomePageClient />
    </Suspense>
  )
}
