"use client"

import type React from "react"

import { StackProvider, StackTheme } from "@stackframe/stack"
import { getStackClientApp } from "@/lib/stack-auth"
import { logger } from "@/lib/logger"

interface StackAuthProviderProps {
  children: React.ReactNode
}

export function StackAuthProvider({ children }: StackAuthProviderProps) {
  try {
    const stackApp = getStackClientApp()

    return (
      <StackProvider app={stackApp}>
        <StackTheme>{children}</StackTheme>
      </StackProvider>
    )
  } catch (error) {
    logger.error("Failed to initialize Stack Auth Provider", { error })

    // Fallback UI when Stack Auth is not configured
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
              <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Authentication Configuration Required</h3>
            <p className="mt-1 text-sm text-gray-500">
              Stack Auth is not properly configured. Please check your environment variables.
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                onClick={() => window.location.reload()}
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
