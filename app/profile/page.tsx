"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ImageUpload } from "@/components/ui/image-upload"
import { ProfileImageEditor } from "@/components/profile/profile-image-editor"
import { InvestmentHistory } from "@/components/profile/investment-history"
import { SocialActivity } from "@/components/profile/social-activity"
import { PrivacySettings } from "@/components/profile/privacy-settings"
import { User, Camera, Edit3, MapPin, Calendar, Briefcase, Shield, TrendingUp, Users } from "lucide-react"
import Image from "next/image"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar?: string
  coverImage?: string
  bio?: string
  location?: string
  website?: string
  occupation?: string
  joinedDate: string
  isVerified: boolean
  stats: {
    totalInvestments: number
    portfolioValue: number
    connections: number
    posts: number
    followers: number
    following: number
  }
  preferences: {
    isPublic: boolean
    showInvestments: boolean
    showActivity: boolean
    emailNotifications: boolean
    pushNotifications: boolean
  }
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [showImageEditor, setShowImageEditor] = useState(false)
  const [editingImage, setEditingImage] = useState<"avatar" | "cover" | null>(null)

  // Form states
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    location: "",
    website: "",
    occupation: "",
    avatar: "",
    coverImage: "",
  })

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    } else if (user) {
      loadUserProfile()
    }
  }, [user, loading, router])

  const loadUserProfile = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockProfile: UserProfile = {
        id: user?.id || "user-1",
        name: user?.name || "John Doe",
        email: user?.email || "john@example.com",
        avatar: user?.image || "/images/investment-growth-coins.jpeg",
        coverImage: "/images/financial-dashboard.jpeg",
        bio: "Experienced investor focused on sustainable growth and technology investments. Passionate about helping others achieve financial independence.",
        location: "New York, NY",
        website: "https://johndoe.com",
        occupation: "Senior Investment Analyst",
        joinedDate: "2023-01-15",
        isVerified: true,
        stats: {
          totalInvestments: 24,
          portfolioValue: 125000,
          connections: 342,
          posts: 89,
          followers: 1250,
          following: 456,
        },
        preferences: {
          isPublic: true,
          showInvestments: true,
          showActivity: true,
          emailNotifications: true,
          pushNotifications: false,
        },
      }

      setProfile(mockProfile)
      setFormData({
        name: mockProfile.name,
        bio: mockProfile.bio || "",
        location: mockProfile.location || "",
        website: mockProfile.website || "",
        occupation: mockProfile.occupation || "",
        avatar: mockProfile.avatar || "",
        coverImage: mockProfile.coverImage || "",
      })
    } catch (error) {
      console.error("Error loading profile:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile. Please try again.",
      })
    }
  }

  const handleSaveProfile = async () => {
    setIsSaving(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))

      if (profile) {
        const updatedProfile = {
          ...profile,
          ...formData,
        }
        setProfile(updatedProfile)
      }

      setIsEditing(false)
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      })
    } catch (error) {
      console.error("Error saving profile:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save profile. Please try again.",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleImageUpload = (type: "avatar" | "cover", imageUrl: string) => {
    setFormData((prev) => ({
      ...prev,
      [type === "avatar" ? "avatar" : "coverImage"]: imageUrl,
    }))
    setEditingImage(type)
    setShowImageEditor(true)
  }

  const handleImageSave = (editedImageUrl: string) => {
    if (editingImage) {
      setFormData((prev) => ({
        ...prev,
        [editingImage === "avatar" ? "avatar" : "coverImage"]: editedImageUrl,
      }))
    }
    setShowImageEditor(false)
    setEditingImage(null)
  }

  if (loading || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Cover Image Section */}
      <Card className="overflow-hidden">
        <div className="relative h-48 md:h-64">
          {formData.coverImage ? (
            <Image
              src={formData.coverImage || "/placeholder.svg"}
              alt="Cover image"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
          )}

          {isEditing && (
            <div className="absolute top-4 right-4">
              <ImageUpload
                value={formData.coverImage}
                onChange={(url) => handleImageUpload("cover", url)}
                aspectRatio={3}
                maxSizeMB={10}
                className="w-auto"
              >
                <Button size="sm" variant="secondary">
                  <Camera className="h-4 w-4 mr-2" />
                  Change Cover
                </Button>
              </ImageUpload>
            </div>
          )}
        </div>

        {/* Profile Info Section */}
        <CardContent className="relative -mt-16 md:-mt-20 pt-0">
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
                <AvatarImage src={formData.avatar || "/placeholder.svg"} alt={profile.name} />
                <AvatarFallback className="text-2xl md:text-4xl">{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>

              {isEditing && (
                <div className="absolute -bottom-2 -right-2">
                  <ImageUpload
                    value={formData.avatar}
                    onChange={(url) => handleImageUpload("avatar", url)}
                    aspectRatio={1}
                    maxSizeMB={5}
                    className="w-auto"
                  >
                    <Button size="sm" className="rounded-full h-8 w-8 p-0">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </ImageUpload>
                </div>
              )}
            </div>

            {/* Profile Header Info */}
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <h1 className="text-2xl md:text-3xl font-bold">{profile.name}</h1>
                {profile.isVerified && (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    <Shield className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {profile.occupation && (
                  <div className="flex items-center gap-1">
                    <Briefcase className="h-4 w-4" />
                    {profile.occupation}
                  </div>
                )}
                {profile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {profile.location}
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(profile.joinedDate).toLocaleDateString()}
                </div>
              </div>

              {profile.bio && <p className="text-sm text-muted-foreground max-w-2xl">{profile.bio}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {!isEditing ? (
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              ) : (
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsEditing(false)
                      // Reset form data
                      setFormData({
                        name: profile.name,
                        bio: profile.bio || "",
                        location: profile.location || "",
                        website: profile.website || "",
                        occupation: profile.occupation || "",
                        avatar: profile.avatar || "",
                        coverImage: profile.coverImage || "",
                      })
                    }}
                  >
                    Cancel
                  </Button>
                  <Button onClick={handleSaveProfile} disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">${profile.stats.portfolioValue.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">Portfolio Value</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{profile.stats.totalInvestments}</div>
            <div className="text-sm text-muted-foreground">Investments</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{profile.stats.connections}</div>
            <div className="text-sm text-muted-foreground">Connections</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{profile.stats.posts}</div>
            <div className="text-sm text-muted-foreground">Posts</div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="investments">Investments</TabsTrigger>
          <TabsTrigger value="activity">Activity</TabsTrigger>
          <TabsTrigger value="edit">Edit Profile</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  Recent Performance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Month</span>
                    <span className="text-green-600 font-medium">+12.5%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Quarter</span>
                    <span className="text-green-600 font-medium">+8.2%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">This Year</span>
                    <span className="text-green-600 font-medium">+15.7%</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Social Stats
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Followers</span>
                    <span className="font-medium">{profile.stats.followers}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Following</span>
                    <span className="font-medium">{profile.stats.following}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Posts</span>
                    <span className="font-medium">{profile.stats.posts}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="investments">
          <InvestmentHistory userId={profile.id} />
        </TabsContent>

        <TabsContent value="activity">
          <SocialActivity userId={profile.id} />
        </TabsContent>

        <TabsContent value="edit" className="space-y-6">
          {isEditing ? (
            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                  <CardDescription>Update your basic profile information</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={formData.bio}
                      onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                      placeholder="Tell others about yourself..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occupation">Occupation</Label>
                    <Input
                      id="occupation"
                      value={formData.occupation}
                      onChange={(e) => setFormData((prev) => ({ ...prev, occupation: e.target.value }))}
                      placeholder="Your job title or profession"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                      placeholder="City, Country"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                      placeholder="https://your-website.com"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Profile Images</CardTitle>
                  <CardDescription>Update your profile and cover images</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label>Profile Picture</Label>
                    <ImageUpload
                      value={formData.avatar}
                      onChange={(url) => handleImageUpload("avatar", url)}
                      aspectRatio={1}
                      maxSizeMB={5}
                    />
                    <p className="text-xs text-muted-foreground">Recommended: Square image, at least 400x400 pixels</p>
                  </div>

                  <div className="space-y-2">
                    <Label>Cover Image</Label>
                    <ImageUpload
                      value={formData.coverImage}
                      onChange={(url) => handleImageUpload("cover", url)}
                      aspectRatio={3}
                      maxSizeMB={10}
                      className="h-[150px]"
                    />
                    <p className="text-xs text-muted-foreground">Recommended: 1200x400 pixels</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <User className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium mb-2">Edit Your Profile</h3>
                <p className="text-muted-foreground mb-4">Click "Edit Profile" to update your information and images</p>
                <Button onClick={() => setIsEditing(true)}>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Start Editing
                </Button>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <PrivacySettings
            preferences={profile.preferences}
            onUpdate={(newPreferences) => {
              setProfile((prev) => (prev ? { ...prev, preferences: newPreferences } : null))
            }}
          />
        </TabsContent>
      </Tabs>

      {/* Image Editor Modal */}
      {showImageEditor && editingImage && (
        <ProfileImageEditor
          imageUrl={formData[editingImage === "avatar" ? "avatar" : "coverImage"]}
          aspectRatio={editingImage === "avatar" ? 1 : 3}
          onSave={handleImageSave}
          onCancel={() => {
            setShowImageEditor(false)
            setEditingImage(null)
          }}
        />
      )}
    </div>
  )
}
