import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Clock, Mail } from "lucide-react"
import { env } from "@/lib/env"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-yellow-100">
            <AlertTriangle className="h-6 w-6 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl font-bold">Under Maintenance</CardTitle>
          <CardDescription>{env.APP_NAME} is currently undergoing scheduled maintenance</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>We'll be back shortly</span>
          </div>
          <div className="flex items-center space-x-3 text-sm text-muted-foreground">
            <Mail className="h-4 w-4" />
            <span>Contact support if urgent: {env.FROM_EMAIL || "support@alhaqq.com"}</span>
          </div>
          <div className="mt-6 text-center text-xs text-muted-foreground">Thank you for your patience</div>
        </CardContent>
      </Card>
    </div>
  )
}
