import { type NextRequest, NextResponse } from "next/server"
import { getServerAuthSession } from "@/lib/auth"

// This would be your posts database in production
const posts = [
  // Mock posts data would be here
]

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const postId = params.id
    const userId = session.user.id

    const postIndex = posts.findIndex((post) => post.id === postId)
    if (postIndex === -1) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 })
    }

    const post = posts[postIndex]
    const likedBy = post.likedBy || []
    const isLiked = likedBy.includes(userId)

    if (isLiked) {
      // Unlike the post
      post.likedBy = likedBy.filter((id) => id !== userId)
      post.likes = Math.max(0, post.likes - 1)
    } else {
      // Like the post
      post.likedBy = [...likedBy, userId]
      post.likes += 1
    }

    posts[postIndex] = post

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error liking post:", error)
    return NextResponse.json({ message: "Failed to like post" }, { status: 500 })
  }
}
