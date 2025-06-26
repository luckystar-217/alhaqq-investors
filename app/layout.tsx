import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AlHaqq Investment Platform - Connect, Invest, Grow Together",
  description:
    "Join our vibrant investment community where meaningful connections are made, portfolios are shared, and wealth grows through smart investing and social collaboration.",
  keywords: ["investment", "social network", "portfolio", "trading", "finance", "wealth building"],
  authors: [{ name: "AlHaqq Investment Team" }],
  openGraph: {
    title: "AlHaqq Investment Platform - Connect, Invest, Grow Together",
    description:
      "Join our vibrant investment community where meaningful connections are made and wealth grows through collaboration.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "AlHaqq Investment Platform - Connect, Invest, Grow Together",
    description:
      "Join our vibrant investment community where meaningful connections are made and wealth grows through collaboration.",
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
