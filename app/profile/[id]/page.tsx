"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { InvestmentHistory } from "@/components/profile/investment-history"
import { SocialActivity } from "@/components/profile/social-activity"
import {
  UserPlus,
  MessageSquare,
  MoreHorizontal,
  Shield,
  MapPin,
  Calendar,
  Briefcase,
  Globe,
  TrendingUp,
  Users,
} from "lucide-react"
import Image from "next/image"

interface PublicUserProfile {
  id: string
  name: string
  avatar?: string
  coverImage?: string
  bio?: string
  location?: string
  website?: string
  occupation?: string
  joinedDate: string
  isVerified: boolean
  isFollowing: boolean
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
  }
}

export default function PublicProfilePage() {
  const { id } = useParams()
  const { user, loading } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const [profile, setProfile] = useState<PublicUserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFollowing, setIsFollowing] = useState(false)

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/signin")
    } else {
      loadPublicProfile()
    }
  }, [id, user, loading, router])

  const loadPublicProfile = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockProfile: PublicUserProfile = {
        id: id as string,
        name: "Sarah Johnson",
        avatar: "/images/investment-growth-coins.jpeg",
        coverImage: "/images/financial-dashboard.jpeg",
        bio: "Senior Portfolio Manager with 15+ years of experience in sustainable investing. Passionate about ESG funds and helping others build wealth responsibly.",
        location: "San Francisco, CA",
        website: "https://sarahjohnson.com",
        occupation: "Senior Portfolio Manager",
        joinedDate: "2022-03-15",
        isVerified: true,
        isFollowing: Math.random() > 0.5,
        stats: {
          totalInvestments: 32,
          portfolioValue: 285000,
          connections: 1250,
          posts: 156,
          followers: 3400,
          following: 890,
        },
        preferences: {
          isPublic: true,
          showInvestments: true,
          showActivity: true,
        },
      }

      setProfile(mockProfile)
      setIsFollowing(mockProfile.isFollowing)
    } catch (error) {
      console.error("Error loading public profile:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollowToggle = async () => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 500))

      setIsFollowing(!isFollowing)

      if (profile) {
        setProfile((prev) =>
          prev
            ? {
                ...prev,
                stats: {
                  ...prev.stats,
                  followers: isFollowing ? prev.stats.followers - 1 : prev.stats.followers + 1,
                },
              }
            : null,
        )
      }

      toast({
        title: isFollowing ? "Unfollowed" : "Following",
        description: isFollowing
          ? `You are no longer following ${profile?.name}`
          : `You are now following ${profile?.name}`,
      })
    } catch (error) {
      console.error("Error toggling follow:", error)
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update follow status. Please try again.",
      })
    }
  }

  if (loading || isLoading || !profile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  const isOwnProfile = user?.id === profile.id

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Cover Image Section */}
      <Card className="overflow-hidden">
        <div className="relative h-48 md:h-64">
          {profile.coverImage ? (
            <Image
              src={profile.coverImage || "/placeholder.svg"}
              alt="Cover image"
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-600" />
          )}
        </div>

        {/* Profile Info Section */}
        <CardContent className="relative -mt-16 md:-mt-20 pt-0">
          <div className="flex flex-col md:flex-row gap-4 md:items-end">
            {/* Avatar */}
            <Avatar className="h-24 w-24 md:h-32 md:w-32 border-4 border-background">
              <AvatarImage src={profile.avatar || "/placeholder.svg"} alt={profile.name} />
              <AvatarFallback className="text-2xl md:text-4xl">{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>

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
                {profile.website && (
                  <div className="flex items-center gap-1">
                    <Globe className="h-4 w-4" />
                    <a
                      href={profile.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      Website
                    </a>
                  </div>
                )}
              </div>

              {profile.bio && <p className="text-sm text-muted-foreground max-w-2xl">{profile.bio}</p>}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {!isOwnProfile && (
                <>
                  <Button variant={isFollowing ? "outline" : "default"} onClick={handleFollowToggle}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    {isFollowing ? "Following" : "Follow"}
                  </Button>
                  <Button variant="outline">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message
                  </Button>
                </>
              )}
              {isOwnProfile && <Button onClick={() => router.push("/profile")}>Edit Profile</Button>}
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {profile.preferences.showInvestments && (
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600">${profile.stats.portfolioValue.toLocaleString()}</div>
              <div className="text-sm text-muted-foreground">Portfolio Value</div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{profile.stats.followers}</div>
            <div className="text-sm text-muted-foreground">Followers</div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{profile.stats.following}</div>
            <div className="text-sm text-muted-foreground">Following</div>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          {profile.preferences.showInvestments && <TabsTrigger value="investments">Investments</TabsTrigger>}
          {profile.preferences.showActivity && <TabsTrigger value="activity">Activity</TabsTrigger>}
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
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
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Connections</span>
                    <span className="font-medium">{profile.stats.connections}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {profile.preferences.showInvestments && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Investment Overview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Total Investments</span>
                      <span className="font-medium">{profile.stats.totalInvestments}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Portfolio Value</span>
                      <span className="font-medium text-green-600">
                        ${profile.stats.portfolioValue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>

        {profile.preferences.showInvestments && (
          <TabsContent value="investments">
            <InvestmentHistory userId={profile.id} />
          </TabsContent>
        )}

        {profile.preferences.showActivity && (
          <TabsContent value="activity">
            <SocialActivity userId={profile.id} />
          </TabsContent>
        )}
      </Tabs>
    </div>
  )
}
