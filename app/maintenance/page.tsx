"use client"

import { AlertTriangle, Clock, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">AH</span>
            </div>
            <span className="text-2xl font-bold text-slate-900">AlHaqq Investors</span>
          </div>
        </div>

        {/* Main Card */}
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-6">
            <div className="mx-auto w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="w-8 h-8 text-amber-600" />
            </div>
            <CardTitle className="text-3xl font-bold text-slate-900">We'll be right back!</CardTitle>
            <CardDescription className="text-lg text-slate-600 mt-2">
              AlHaqq Investors is currently undergoing scheduled maintenance to improve your experience.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Status */}
            <div className="bg-slate-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-slate-500" />
                <div>
                  <p className="font-medium text-slate-900">Estimated Duration</p>
                  <p className="text-sm text-slate-600">We expect to be back online within 2-4 hours</p>
                </div>
              </div>
            </div>

            {/* What's happening */}
            <div className="space-y-3">
              <h3 className="font-semibold text-slate-900">What we're working on:</h3>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Upgrading our investment tracking systems</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Enhancing security and performance</span>
                </li>
                <li className="flex items-start space-x-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full mt-2 flex-shrink-0" />
                  <span>Adding new features for better user experience</span>
                </li>
              </ul>
            </div>

            {/* Contact Information */}
            <div className="border-t pt-6">
              <h3 className="font-semibold text-slate-900 mb-3">Need immediate assistance?</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <Mail className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-900">Email Support</p>
                    <p className="text-sm text-slate-600">support@alhaqq.com</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-slate-50 rounded-lg">
                  <Phone className="w-5 h-5 text-slate-500" />
                  <div>
                    <p className="font-medium text-slate-900">Emergency Line</p>
                    <p className="text-sm text-slate-600">+1 (555) 123-4567</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button onClick={() => window.location.reload()} className="flex-1 bg-emerald-600 hover:bg-emerald-700">
                Check Again
              </Button>
              <Button variant="outline" asChild className="flex-1 bg-transparent">
                <Link href="mailto:support@alhaqq.com">Contact Support</Link>
              </Button>
            </div>

            {/* Footer */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-slate-500">
                Follow us on social media for real-time updates on our maintenance progress.
              </p>
              <div className="flex justify-center space-x-4 mt-2">
                <Link href="#" className="text-slate-400 hover:text-slate-600 text-sm">
                  Twitter
                </Link>
                <Link href="#" className="text-slate-400 hover:text-slate-600 text-sm">
                  LinkedIn
                </Link>
                <Link href="#" className="text-slate-400 hover:text-slate-600 text-sm">
                  Status Page
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Additional Info */}
        <div className="text-center">
          <p className="text-sm text-slate-500">
            Last updated: {new Date().toLocaleString()} | Maintenance ID: MAINT-2024-001
          </p>
        </div>
      </div>
    </div>
  )
}
