"use client"

import { SessionProvider } from "@/components/session-provider"

export function Providers({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>
}
