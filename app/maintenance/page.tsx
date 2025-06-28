"use client"

import { Wrench, Clock, AlertTriangle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-3 bg-orange-100 rounded-full w-fit">
            <Wrench className="h-8 w-8 text-orange-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">Under Maintenance</CardTitle>
          <CardDescription className="text-gray-600">
            We're currently performing scheduled maintenance to improve your experience.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <Clock className="h-4 w-4 text-blue-500" />
              <span>Estimated completion: 30 minutes</span>
            </div>
            <div className="flex items-center space-x-3 text-sm text-gray-600">
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
              <span>All data is safe and secure</span>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">What we're updating:</h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Database optimizations</li>
              <li>• Security enhancements</li>
              <li>• Performance improvements</li>
              <li>• New features preparation</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button onClick={() => window.location.reload()} className="w-full" variant="default">
              Check Again
            </Button>
            <Button onClick={() => window.history.back()} className="w-full" variant="outline">
              Go Back
            </Button>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500">
              Need immediate assistance?{" "}
              <a href="mailto:support@alhaqq.com" className="text-blue-600 hover:underline">
                Contact Support
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
