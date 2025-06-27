"use client"

import { AlertTriangle, Clock, Mail, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function MaintenancePage() {
  const handleRefresh = () => {
    window.location.reload()
  }

  const handleContact = () => {
    window.location.href = "mailto:support@alhaqq.com"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Under Maintenance</CardTitle>
          <CardDescription className="text-gray-600">
            We're currently performing scheduled maintenance to improve your experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-4">
              <Clock className="w-4 h-4" />
              <span>Expected duration: 30-60 minutes</span>
            </div>
            <p className="text-sm text-gray-600">
              We apologize for any inconvenience. Our team is working hard to get everything back online as soon as
              possible.
            </p>
          </div>

          <div className="space-y-3">
            <Button onClick={handleRefresh} className="w-full bg-transparent" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Check Again
            </Button>
            <Button onClick={handleContact} className="w-full" variant="ghost">
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Follow us on social media for real-time updates about our service status.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
