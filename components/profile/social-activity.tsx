"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Heart, MessageSquare, Share2, TrendingUp, Users, Calendar, Activity } from "lucide-react"
import Image from "next/image"

interface SocialPost {
  id: string
  content: string
  images: string[]
  likes: number
  comments: number
  shares: number
  createdAt: string
  engagement: number
}

interface Connection {
  id: string
  name: string
  avatar: string
  occupation: string
  mutualConnections: number
  connectedAt: string
}

interface SocialActivityProps {
  userId: string
}

export function SocialActivity({ userId }: SocialActivityProps) {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [connections, setConnections] = useState<Connection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadSocialActivity()
  }, [userId])

  const loadSocialActivity = async () => {
    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const mockPosts: SocialPost[] = [
        {
          id: "post-1",
          content:
            "Just diversified my portfolio with some green energy investments! 🌱 The future is sustainable investing. What are your thoughts on ESG funds?",
          images: ["/images/plant-growth-investment.jpeg"],
          likes: 42,
          comments: 18,
          shares: 7,
          createdAt: "2023-12-01T10:30:00Z",
          engagement: 67,
        },
        {
          id: "post-2",
          content:
            "Market analysis for Q4 2023 shows promising trends in tech sector. Here's my breakdown of the key indicators to watch...",
          images: ["/images/stock-market-chart.jpeg", "/images/financial-dashboard.jpeg"],
          likes: 89,
          comments: 34,
          shares: 15,
          createdAt: "2023-11-28T14:15:00Z",
          engagement: 138,
        },
        {
          id: "post-3",
          content:
            "Real estate investment strategies for 2024. Location, location, location still matters, but now we need to consider climate resilience too.",
          images: ["/images/real-estate-investing-sign.jpeg"],
          likes: 56,
          comments: 23,
          shares: 12,
          createdAt: "2023-11-25T09:45:00Z",
          engagement: 91,
        },
      ]

      const mockConnections: Connection[] = [
        {
          id: "conn-1",
          name: "Sarah Johnson",
          avatar: "/images/investment-growth-coins.jpeg",
          occupation: "Portfolio Manager",
          mutualConnections: 15,
          connectedAt: "2023-11-20T00:00:00Z",
        },
        {
          id: "conn-2",
          name: "Michael Chen",
          avatar: "/images/digital-investment-interface.jpeg",
          occupation: "Financial Advisor",
          mutualConnections: 8,
          connectedAt: "2023-11-18T00:00:00Z",
        },
        {
          id: "conn-3",
          name: "Emily Rodriguez",
          avatar: "/images/hands-growing-coins.jpeg",
          occupation: "Investment Analyst",
          mutualConnections: 22,
          connectedAt: "2023-11-15T00:00:00Z",
        },
      ]

      setPosts(mockPosts)
      setConnections(mockConnections)
    } catch (error) {
      console.error("Error loading social activity:", error)
    } finally {
      setLoading(false)
    }
  }

  const totalEngagement = posts.reduce((sum, post) => sum + post.engagement, 0)
  const avgEngagement = posts.length > 0 ? totalEngagement / posts.length : 0

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Activity Summary */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Posts</p>
                <p className="text-2xl font-bold">{posts.length}</p>
              </div>
              <Activity className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Engagement</p>
                <p className="text-2xl font-bold">{totalEngagement}</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Avg. Engagement</p>
                <p className="text-2xl font-bold">{Math.round(avgEngagement)}</p>
              </div>
              <Heart className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Connections</p>
                <p className="text-2xl font-bold">{connections.length}</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Tabs */}
      <Tabs defaultValue="posts" className="w-full">
        <TabsList>
          <TabsTrigger value="posts">Recent Posts</TabsTrigger>
          <TabsTrigger value="connections">Recent Connections</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="posts" className="space-y-4">
          {posts.map((post) => (
            <Card key={post.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(post.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <Badge variant="outline">{post.engagement} total engagement</Badge>
                  </div>

                  <p className="text-sm leading-relaxed">{post.content}</p>

                  {post.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {post.images.map((image, index) => (
                        <div key={index} className="relative h-32 rounded-lg overflow-hidden">
                          <Image
                            src={image || "/placeholder.svg"}
                            alt={`Post image ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex items-center gap-6">
                      <div className="flex items-center gap-1">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">{post.likes}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">{post.comments}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Share2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">{post.shares}</span>
                      </div>
                    </div>

                    <Button variant="ghost" size="sm">
                      View Post
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="connections" className="space-y-4">
          {connections.map((connection) => (
            <Card key={connection.id}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={connection.avatar || "/placeholder.svg"} alt={connection.name} />
                    <AvatarFallback>{connection.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <h3 className="font-medium">{connection.name}</h3>
                    <p className="text-sm text-muted-foreground">{connection.occupation}</p>
                    <p className="text-xs text-muted-foreground">{connection.mutualConnections} mutual connections</p>
                  </div>

                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">
                      Connected {new Date(connection.connectedAt).toLocaleDateString()}
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      View Profile
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle>Engagement Analytics</CardTitle>
              <CardDescription>Detailed analytics for your social activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <TrendingUp className="h-12 w-12 mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">Analytics Coming Soon</h3>
                <p>Detailed engagement analytics and insights will be available here.</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
