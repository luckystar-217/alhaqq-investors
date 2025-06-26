"use client"

import type React from "react"
import { SessionProvider } from "next-auth/react"
import { AuthProvider as CustomAuthProvider } from "@/lib/auth-context"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CustomAuthProvider>{children}</CustomAuthProvider>
    </SessionProvider>
  )
}
