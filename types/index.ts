export interface User {
  id: string
  name: string
  email: string
  image?: string
  bio?: string
  createdAt: string
}

export interface Post {
  id: string
  content: string
  images: string[]
  author: {
    id: string
    name: string
    image?: string
  }
  likes: number
  comments: number
  likedBy: string[]
  createdAt: string
}

export interface Comment {
  id: string
  content: string
  author: {
    id: string
    name: string
    image?: string
  }
  postId: string
  createdAt: string
}
