"use client"

import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AlertCircle, Home, RefreshCw } from "lucide-react"
import Link from "next/link"
import { Suspense } from "react"

function ErrorContent() {
  const searchParams = useSearchParams()
  const error = searchParams.get("error")

  const getErrorMessage = (error: string | null) => {
    switch (error) {
      case "Configuration":
        return {
          title: "Server Configuration Error",
          description: "There is a problem with the server configuration. Please contact support.",
          suggestion: "This usually indicates a missing or invalid environment variable.",
        }
      case "AccessDenied":
        return {
          title: "Access Denied",
          description: "You do not have permission to sign in.",
          suggestion: "Please check your credentials or contact an administrator.",
        }
      case "Verification":
        return {
          title: "Verification Error",
          description: "The verification token has expired or is invalid.",
          suggestion: "Please try signing in again.",
        }
      case "CredentialsSignin":
        return {
          title: "Invalid Credentials",
          description: "The email or password you entered is incorrect.",
          suggestion: "Please check your credentials and try again.",
        }
      case "SessionRequired":
        return {
          title: "Session Required",
          description: "You must be signed in to access this page.",
          suggestion: "Please sign in to continue.",
        }
      case "CLIENT_FETCH_ERROR":
        return {
          title: "Connection Error",
          description: "Unable to connect to the authentication server.",
          suggestion: "Please check your internet connection and try again.",
        }
      default:
        return {
          title: "Authentication Error",
          description: "An unexpected error occurred during authentication.",
          suggestion: "Please try again or contact support if the problem persists.",
        }
    }
  }

  const errorInfo = getErrorMessage(error)

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            <CardTitle className="mt-4 text-xl font-semibold text-gray-900">{errorInfo.title}</CardTitle>
            <CardDescription className="mt-2 text-sm text-gray-600">{errorInfo.description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
              <p className="text-sm text-blue-800">
                <strong>Suggestion:</strong> {errorInfo.suggestion}
              </p>
            </div>

            {error && (
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <p className="text-xs text-gray-600">
                  <strong>Error Code:</strong> {error}
                </p>
              </div>
            )}

            <div className="flex flex-col space-y-2">
              <Button asChild className="w-full">
                <Link href="/auth/signin">
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Link>
              </Button>
              <Button variant="outline" asChild className="w-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function AuthErrorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
        </div>
      }
    >
      <ErrorContent />
    </Suspense>
  )
}
