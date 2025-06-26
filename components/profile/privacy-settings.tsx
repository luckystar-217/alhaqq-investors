"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Shield, Eye, Bell, Lock, Users, Mail, Smartphone, Globe } from "lucide-react"

interface PrivacyPreferences {
  isPublic: boolean
  showInvestments: boolean
  showActivity: boolean
  emailNotifications: boolean
  pushNotifications: boolean
}

interface PrivacySettingsProps {
  preferences: PrivacyPreferences
  onUpdate: (preferences: PrivacyPreferences) => void
}

export function PrivacySettings({ preferences, onUpdate }: PrivacySettingsProps) {
  const [localPreferences, setLocalPreferences] = useState(preferences)
  const [isSaving, setIsSaving] = useState(false)
  const { toast } = useToast()

  const handlePreferenceChange = (key: keyof PrivacyPreferences, value: boolean) => {
    setLocalPreferences((prev) => ({
      ...prev,
      [key]: value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onUpdate(localPreferences)
      toast({
        title: "Settings Updated",
        description: "Your privacy settings have been saved successfully.",
      })
    } catch (error) {
      console.error("Error saving privacy settings:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save settings. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const hasChanges = JSON.stringify(preferences) !== JSON.stringify(localPreferences)

  return (
    <div className="space-y-6">
      {/* Profile Visibility */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Profile Visibility
          </CardTitle>
          <CardDescription>Control who can see your profile and information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="public-profile">Public Profile</Label>
              <p className="text-sm text-muted-foreground">Allow anyone to view your profile and basic information</p>
            </div>
            <Switch
              id="public-profile"
              checked={localPreferences.isPublic}
              onCheckedChange={(checked) => handlePreferenceChange("isPublic", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-investments">Show Investment Portfolio</Label>
              <p className="text-sm text-muted-foreground">Display your investment portfolio to other users</p>
            </div>
            <Switch
              id="show-investments"
              checked={localPreferences.showInvestments}
              onCheckedChange={(checked) => handlePreferenceChange("showInvestments", checked)}
              disabled={!localPreferences.isPublic}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="show-activity">Show Social Activity</Label>
              <p className="text-sm text-muted-foreground">Display your posts and social interactions</p>
            </div>
            <Switch
              id="show-activity"
              checked={localPreferences.showActivity}
              onCheckedChange={(checked) => handlePreferenceChange("showActivity", checked)}
              disabled={!localPreferences.isPublic}
            />
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Preferences
          </CardTitle>
          <CardDescription>Manage how you receive notifications and updates</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="email-notifications" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive notifications about account activity via email</p>
            </div>
            <Switch
              id="email-notifications"
              checked={localPreferences.emailNotifications}
              onCheckedChange={(checked) => handlePreferenceChange("emailNotifications", checked)}
            />
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="push-notifications" className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                Push Notifications
              </Label>
              <p className="text-sm text-muted-foreground">Receive push notifications on your devices</p>
            </div>
            <Switch
              id="push-notifications"
              checked={localPreferences.pushNotifications}
              onCheckedChange={(checked) => handlePreferenceChange("pushNotifications", checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security & Privacy
          </CardTitle>
          <CardDescription>Additional security and privacy controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            <Button variant="outline" className="justify-start">
              <Lock className="h-4 w-4 mr-2" />
              Change Password
            </Button>
            <Button variant="outline" className="justify-start">
              <Users className="h-4 w-4 mr-2" />
              Blocked Users
            </Button>
            <Button variant="outline" className="justify-start">
              <Globe className="h-4 w-4 mr-2" />
              Data Export
            </Button>
            <Button variant="outline" className="justify-start text-red-600 hover:text-red-700">
              <Shield className="h-4 w-4 mr-2" />
              Delete Account
            </Button>
          </div>

          <Separator />

          <div className="bg-muted/50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Privacy Notice</h4>
            <p className="text-sm text-muted-foreground">
              Your privacy is important to us. We use your data to provide personalized investment recommendations and
              improve our services. You can control what information is shared and with whom using the settings above.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save Button */}
      {hasChanges && (
        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  )
}
