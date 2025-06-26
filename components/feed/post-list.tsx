"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Heart, MessageSquare, Share2, MoreHorizontal, Clock } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Post } from "@/types"
import { cn } from "@/lib/utils"

interface PostListProps {
  posts: Post[]
  onLikePost: (postId: string) => Promise<void>
  onCommentPost: (postId: string, content: string) => Promise<void>
}

export default function PostList({ posts, onLikePost, onCommentPost }: PostListProps) {
  const { data: session } = useSession()
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set())

  const toggleExpanded = (postId: string) => {
    setExpandedPosts((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(postId)) {
        newSet.delete(postId)
      } else {
        newSet.add(postId)
      }
      return newSet
    })
  }

  const isPostLiked = (post: Post) => {
    return post.likedBy?.includes(session?.user?.id || "") || false
  }

  const formatPostDate = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true })
    } catch {
      return "recently"
    }
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
          <MessageSquare className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No posts yet</h3>
        <p className="text-gray-500 dark:text-gray-400">Be the first to share something with the community!</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => {
        const isExpanded = expandedPosts.has(post.id)
        const shouldTruncate = post.content.length > 300
        const displayContent = shouldTruncate && !isExpanded ? post.content.slice(0, 300) + "..." : post.content

        return (
          <Card key={post.id} className="overflow-hidden">
            <CardContent className="pt-6">
              {/* Post Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={post.author.image || "/placeholder.svg"} alt={post.author.name} />
                    <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{post.author.name}</h3>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                      <Clock className="w-3 h-3 mr-1" />
                      {formatPostDate(post.createdAt)}
                    </div>
                  </div>
                </div>
                <Button variant="ghost" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>

              {/* Post Content */}
              {post.content && (
                <div className="mb-4">
                  <p className="text-gray-900 dark:text-white whitespace-pre-wrap">{displayContent}</p>
                  {shouldTruncate && (
                    <Button
                      variant="link"
                      className="p-0 h-auto text-blue-600 hover:text-blue-700"
                      onClick={() => toggleExpanded(post.id)}
                    >
                      {isExpanded ? "Show less" : "Show more"}
                    </Button>
                  )}
                </div>
              )}

              {/* Post Images */}
              {post.images && post.images.length > 0 && (
                <div
                  className={cn(
                    "grid gap-2 mb-4 rounded-lg overflow-hidden",
                    post.images.length === 1 && "grid-cols-1",
                    post.images.length === 2 && "grid-cols-2",
                    post.images.length >= 3 && "grid-cols-2",
                  )}
                >
                  {post.images.slice(0, 4).map((image, index) => (
                    <div
                      key={index}
                      className={cn(
                        "relative bg-gray-100 dark:bg-gray-800",
                        post.images.length === 3 && index === 0 && "row-span-2",
                        post.images.length === 1 && "aspect-video",
                        post.images.length > 1 && "aspect-square",
                      )}
                    >
                      <img
                        src={image || "/placeholder.svg"}
                        alt={`Post image ${index + 1}`}
                        className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity"
                        loading="lazy"
                      />
                      {index === 3 && post.images.length > 4 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="text-white text-lg font-semibold">+{post.images.length - 4}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>

            {/* Post Actions */}
            <CardFooter className="pt-0">
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onLikePost(post.id)}
                    className={cn("text-gray-500 hover:text-red-500", isPostLiked(post) && "text-red-500")}
                  >
                    <Heart className={cn("h-4 w-4 mr-2", isPostLiked(post) && "fill-current")} />
                    {post.likes}
                  </Button>

                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-500">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    {post.comments}
                  </Button>

                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-green-500">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share
                  </Button>
                </div>
              </div>
            </CardFooter>
          </Card>
        )
      })}
    </div>
  )
}
