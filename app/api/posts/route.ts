import { type NextRequest, NextResponse } from "next/server"
import { Database } from "@/lib/database"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { user_id, content, image_url } = body

    // Validate required fields
    if (!user_id || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Create post
    const post = await Database.createPost({
      user_id,
      content,
      image_url,
    })

    if (!post) {
      return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
    }

    logger.info("Post created successfully", { postId: post.id, userId: user_id })

    return NextResponse.json({ post })
  } catch (error) {
    logger.error("Post creation failed", {}, error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const posts = await Database.getPosts(limit, offset)

    return NextResponse.json({ posts })
  } catch (error) {
    logger.error("Posts fetch failed", {}, error as Error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
