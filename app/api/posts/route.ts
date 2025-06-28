import { type NextRequest, NextResponse } from "next/server"
import { getServerAuthSession } from "@/lib/auth"
import { createPost, getPosts, getUserByEmail } from "@/lib/database"
import { logger } from "@/lib/logger"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const posts = await getPosts(limit, offset)

    return NextResponse.json({ posts })
  } catch (error) {
    logger.error("Error fetching posts", { error })
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { content, images, postType, tags } = body

    if (!content?.trim()) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    const user = await getUserByEmail(session.user.email!)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const post = await createPost({
      userId: user.id,
      content: content.trim(),
      images,
      postType,
      tags,
    })

    logger.info("Post created successfully", { postId: post.id, userId: user.id })

    return NextResponse.json(post, { status: 201 })
  } catch (error) {
    logger.error("Error creating post", { error })
    return NextResponse.json({ error: "Failed to create post" }, { status: 500 })
  }
}
