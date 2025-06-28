import { neon } from "@neondatabase/serverless"
import { env } from "./env"
import { logger } from "./logger"

// Initialize Neon client
const sql = neon(env.DATABASE_URL)

export interface User {
  id: string
  email: string
  name: string
  username: string
  avatar_url?: string
  bio?: string
  location?: string
  website?: string
  created_at: Date
  updated_at: Date
}

export interface Post {
  id: string
  user_id: string
  content: string
  image_url?: string
  likes_count: number
  comments_count: number
  created_at: Date
  updated_at: Date
  user?: User
}

export interface Portfolio {
  id: string
  user_id: string
  name: string
  description?: string
  total_value: number
  created_at: Date
  updated_at: Date
}

export interface Holding {
  id: string
  portfolio_id: string
  symbol: string
  quantity: number
  purchase_price: number
  current_price: number
  created_at: Date
  updated_at: Date
}

// Database operations
export class Database {
  static async testConnection(): Promise<boolean> {
    try {
      await sql`SELECT 1`
      return true
    } catch (error) {
      logger.error("Database connection failed", {}, error as Error)
      return false
    }
  }

  // User operations
  static async createUser(userData: {
    email: string
    name: string
    username: string
    password_hash: string
  }): Promise<User | null> {
    try {
      const [user] = await sql`
        INSERT INTO users (email, name, username, password_hash)
        VALUES (${userData.email}, ${userData.name}, ${userData.username}, ${userData.password_hash})
        RETURNING id, email, name, username, avatar_url, bio, location, website, created_at, updated_at
      `
      return user as User
    } catch (error) {
      logger.error("Failed to create user", { email: userData.email }, error as Error)
      return null
    }
  }

  static async getUserByEmail(email: string): Promise<User | null> {
    try {
      const [user] = await sql`
        SELECT id, email, name, username, avatar_url, bio, location, website, created_at, updated_at
        FROM users 
        WHERE email = ${email}
      `
      return (user as User) || null
    } catch (error) {
      logger.error("Failed to get user by email", { email }, error as Error)
      return null
    }
  }

  static async getUserById(id: string): Promise<User | null> {
    try {
      const [user] = await sql`
        SELECT id, email, name, username, avatar_url, bio, location, website, created_at, updated_at
        FROM users 
        WHERE id = ${id}
      `
      return (user as User) || null
    } catch (error) {
      logger.error("Failed to get user by id", { id }, error as Error)
      return null
    }
  }

  // Post operations
  static async createPost(postData: {
    user_id: string
    content: string
    image_url?: string
  }): Promise<Post | null> {
    try {
      const [post] = await sql`
        INSERT INTO posts (user_id, content, image_url)
        VALUES (${postData.user_id}, ${postData.content}, ${postData.image_url || null})
        RETURNING id, user_id, content, image_url, likes_count, comments_count, created_at, updated_at
      `
      return post as Post
    } catch (error) {
      logger.error("Failed to create post", { user_id: postData.user_id }, error as Error)
      return null
    }
  }

  static async getPosts(limit = 20, offset = 0): Promise<Post[]> {
    try {
      const posts = await sql`
        SELECT 
          p.id, p.user_id, p.content, p.image_url, p.likes_count, p.comments_count, p.created_at, p.updated_at,
          u.name as user_name, u.username as user_username, u.avatar_url as user_avatar_url
        FROM posts p
        JOIN users u ON p.user_id = u.id
        ORDER BY p.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `

      return posts.map((post) => ({
        id: post.id,
        user_id: post.user_id,
        content: post.content,
        image_url: post.image_url,
        likes_count: post.likes_count,
        comments_count: post.comments_count,
        created_at: post.created_at,
        updated_at: post.updated_at,
        user: {
          id: post.user_id,
          name: post.user_name,
          username: post.user_username,
          avatar_url: post.user_avatar_url,
          email: "",
          bio: "",
          location: "",
          website: "",
          created_at: new Date(),
          updated_at: new Date(),
        },
      })) as Post[]
    } catch (error) {
      logger.error("Failed to get posts", {}, error as Error)
      return []
    }
  }

  // Portfolio operations
  static async createPortfolio(portfolioData: {
    user_id: string
    name: string
    description?: string
  }): Promise<Portfolio | null> {
    try {
      const [portfolio] = await sql`
        INSERT INTO portfolios (user_id, name, description)
        VALUES (${portfolioData.user_id}, ${portfolioData.name}, ${portfolioData.description || null})
        RETURNING id, user_id, name, description, total_value, created_at, updated_at
      `
      return portfolio as Portfolio
    } catch (error) {
      logger.error("Failed to create portfolio", { user_id: portfolioData.user_id }, error as Error)
      return null
    }
  }

  static async getUserPortfolios(userId: string): Promise<Portfolio[]> {
    try {
      const portfolios = await sql`
        SELECT id, user_id, name, description, total_value, created_at, updated_at
        FROM portfolios
        WHERE user_id = ${userId}
        ORDER BY created_at DESC
      `
      return portfolios as Portfolio[]
    } catch (error) {
      logger.error("Failed to get user portfolios", { userId }, error as Error)
      return []
    }
  }

  // Market data operations
  static async getMarketData(symbols?: string[]): Promise<any[]> {
    try {
      let query = sql`
        SELECT symbol, price, change_24h, volume, market_cap, updated_at
        FROM market_data
        ORDER BY market_cap DESC
      `

      if (symbols && symbols.length > 0) {
        query = sql`
          SELECT symbol, price, change_24h, volume, market_cap, updated_at
          FROM market_data
          WHERE symbol = ANY(${symbols})
          ORDER BY market_cap DESC
        `
      }

      const data = await query
      return data
    } catch (error) {
      logger.error("Failed to get market data", { symbols }, error as Error)
      return []
    }
  }
}
