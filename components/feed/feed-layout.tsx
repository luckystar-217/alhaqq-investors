"use client"

import type { ReactNode } from "react"
import { useSession } from "next-auth/react"
import Header from "@/components/layout/header"
import Sidebar from "@/components/layout/sidebar"

interface FeedLayoutProps {
  children: ReactNode
}

export default function FeedLayout({ children }: FeedLayoutProps) {
  const { data: session } = useSession()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      <div className="flex">
        <Sidebar />
        <main className="flex-1 lg:flex lg:gap-8 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
