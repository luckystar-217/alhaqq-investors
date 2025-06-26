"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import FeedLayout from "@/components/feed/feed-layout"
import CreatePost from "@/components/feed/create-post"
import PostList from "@/components/feed/post-list"
import SuggestedUsers from "@/components/feed/suggested-users"
import TrendingTopics from "@/components/feed/trending-topics"
import { useToast } from "@/hooks/use-toast"
import type { Post } from "@/types"

export default function FeedPage() {
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/signin")
    }
  }, [status])

  useEffect(() => {
    if (session) {
      fetchPosts()
    }
  }, [session])

  const fetchPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch("/api/posts")
      if (!response.ok) throw new Error("Failed to fetch posts")

      const data = await response.json()
      setPosts(data.posts || [])
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load posts. Please try again.",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreatePost = async (content: string, images: string[]) => {
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content, images }),
      })

      if (!response.ok) throw new Error("Failed to create post")

      const newPost = await response.json()
      setPosts((prev) => [newPost, ...prev])

      toast({
        title: "Post created!",
        description: "Your post has been shared successfully.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create post. Please try again.",
      })
    }
  }

  const handleLikePost = async (postId: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: "POST",
      })

      if (!response.ok) throw new Error("Failed to like post")

      const updatedPost = await response.json()
      setPosts((prev) => prev.map((post) => (post.id === postId ? updatedPost : post)))
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to like post. Please try again.",
      })
    }
  }

  const handleCommentPost = async (postId: string, content: string) => {
    try {
      const response = await fetch(`/api/posts/${postId}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      })

      if (!response.ok) throw new Error("Failed to add comment")

      const updatedPost = await response.json()
      setPosts((prev) => prev.map((post) => (post.id === postId ? updatedPost : post)))

      toast({
        title: "Comment added!",
        description: "Your comment has been posted.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add comment. Please try again.",
      })
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <FeedLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <CreatePost onCreatePost={handleCreatePost} />

        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <PostList posts={posts} onLikePost={handleLikePost} onCommentPost={handleCommentPost} />
        )}
      </div>

      {/* Sidebar */}
      <div className="hidden lg:block lg:w-80 space-y-6">
        <SuggestedUsers />
        <TrendingTopics />
      </div>
    </FeedLayout>
  )
}
