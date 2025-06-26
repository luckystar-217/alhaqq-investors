"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import Link from "next/link"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Maintenance Mode</CardTitle>
          <CardDescription className="text-gray-600">
            We're currently performing scheduled maintenance to improve your experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center text-sm text-gray-500">
            <p>Our team is working hard to get everything back online.</p>
            <p className="mt-2">Expected completion: Within the next hour</p>
          </div>

          <div className="flex flex-col gap-2">
            <Button onClick={() => window.location.reload()} variant="outline" className="w-full">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Page
            </Button>

            <Link href="/" className="w-full">
              <Button variant="ghost" className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Return to Home
              </Button>
            </Link>
          </div>

          <div className="text-center text-xs text-gray-400 mt-6">
            <p>Need immediate assistance?</p>
            <p>Contact us at support@alhaqq.com</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
