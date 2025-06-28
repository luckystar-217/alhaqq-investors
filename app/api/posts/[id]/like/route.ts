import { type NextRequest, NextResponse } from "next/server"
import { getServerAuthSession } from "@/lib/auth"
import { likePost, unlikePost, getUserByEmail } from "@/lib/database"
import { logger } from "@/lib/logger"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const postId = params.id
    const user = await getUserByEmail(session.user.email!)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const result = await likePost(postId, user.id)

    logger.info("Post liked successfully", { postId, userId: user.id })

    return NextResponse.json(result)
  } catch (error) {
    logger.error("Error liking post", { error, postId: params.id })
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const postId = params.id
    const user = await getUserByEmail(session.user.email!)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const result = await unlikePost(postId, user.id)

    logger.info("Post unliked successfully", { postId, userId: user.id })

    return NextResponse.json(result)
  } catch (error) {
    logger.error("Error unliking post", { error, postId: params.id })
    return NextResponse.json({ error: "Failed to unlike post" }, { status: 500 })
  }
}
