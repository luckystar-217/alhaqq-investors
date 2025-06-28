import { type NextRequest, NextResponse } from "next/server"
import { getServerAuthSession } from "@/lib/auth"

// Mock posts database - In production, use a real database
const posts = [
  {
    id: "1",
    content:
      "Welcome to SocialConnect! This is my first post on this amazing platform. Looking forward to connecting with everyone! 🎉",
    images: ["/placeholder.svg?height=400&width=600"],
    author: {
      id: "1",
      name: "John Doe",
      image: "/placeholder.svg?height=40&width=40",
    },
    likes: 12,
    comments: 3,
    likedBy: [],
    createdAt: new Date(Date.now() - 3600000).toISOString(),
  },
  {
    id: "2",
    content: "Just had an amazing coffee at the local café! The latte art was incredible. ☕️ #CoffeeLovers",
    images: [],
    author: {
      id: "2",
      name: "Jane Smith",
      image: "/placeholder.svg?height=40&width=40",
    },
    likes: 8,
    comments: 5,
    likedBy: [],
    createdAt: new Date(Date.now() - 7200000).toISOString(),
  },
]

export async function GET() {
  try {
    return NextResponse.json({ posts })
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ message: "Failed to fetch posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerAuthSession()
    if (!session?.user) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const { content, images } = await request.json()

    if (!content?.trim() && (!images || images.length === 0)) {
      return NextResponse.json({ message: "Post content or images are required" }, { status: 400 })
    }

    const newPost = {
      id: (posts.length + 1).toString(),
      content: content?.trim() || "",
      images: images || [],
      author: {
        id: session.user.id,
        name: session.user.name || "Unknown User",
        image: session.user.image || "/placeholder.svg?height=40&width=40",
      },
      likes: 0,
      comments: 0,
      likedBy: [],
      createdAt: new Date().toISOString(),
    }

    posts.unshift(newPost)

    return NextResponse.json(newPost, { status: 201 })
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ message: "Failed to create post" }, { status: 500 })
  }
}
