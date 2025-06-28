import { neon } from "@neondatabase/serverless"
import { dbConfig } from "./env"
import { logger } from "./logger"
import { DatabaseConnectionError } from "./error-handler"

// Initialize Neon SQL client
let sql: ReturnType<typeof neon> | null = null

try {
  if (!dbConfig.url) {
    throw new Error("DATABASE_URL is required")
  }
  sql = neon(dbConfig.url)
  logger.info("Database client initialized successfully")
} catch (error) {
  logger.error("Failed to initialize database client", { error })
  if (process.env.NODE_ENV === "production") {
    throw error
  }
}

export function getSQL() {
  if (!sql) {
    throw new DatabaseConnectionError("Database client is not initialized")
  }
  return sql
}

// Database health check
export async function checkDatabaseHealth(): Promise<{
  connected: boolean
  latency?: number
  error?: string
}> {
  if (!sql) {
    return { connected: false, error: "SQL client not initialized" }
  }

  try {
    const startTime = Date.now()
    await sql`SELECT 1 as health_check`
    const latency = Date.now() - startTime

    return { connected: true, latency }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown database error"
    logger.error("Database health check failed", { error: errorMessage })
    return { connected: false, error: errorMessage }
  }
}

// User operations
export async function createUser(userData: {
  email: string
  username?: string
  passwordHash?: string
  fullName?: string
  avatarUrl?: string
  stackUserId?: string
}) {
  const sql = getSQL()

  const [user] = await sql`
    INSERT INTO users (email, username, password_hash, full_name, avatar_url, stack_user_id, email_verified)
    VALUES (${userData.email}, ${userData.username}, ${userData.passwordHash}, ${userData.fullName}, ${userData.avatarUrl}, ${userData.stackUserId}, true)
    RETURNING *
  `

  return user
}

export async function getUserByEmail(email: string) {
  const sql = getSQL()

  const [user] = await sql`
    SELECT u.*, up.bio, up.location, up.website_url, up.occupation, up.cover_image_url
    FROM users u
    LEFT JOIN user_profiles up ON u.id = up.user_id
    WHERE u.email = ${email}
  `

  return user
}

export async function getUserById(id: string) {
  const sql = getSQL()

  const [user] = await sql`
    SELECT u.*, up.bio, up.location, up.website_url, up.occupation, up.cover_image_url,
           us.post_count, us.follower_count, us.following_count, us.portfolio_count, us.total_portfolio_value
    FROM users u
    LEFT JOIN user_profiles up ON u.id = up.user_id
    LEFT JOIN user_stats us ON u.id = us.id
    WHERE u.id = ${id}
  `

  return user
}

// Post operations
export async function createPost(postData: {
  userId: string
  content: string
  images?: string[]
  postType?: string
  tags?: string[]
}) {
  const sql = getSQL()

  const [post] = await sql`
    INSERT INTO posts (user_id, content, images, post_type, tags)
    VALUES (${postData.userId}, ${postData.content}, ${postData.images || []}, ${postData.postType || "general"}, ${postData.tags || []})
    RETURNING *
  `

  return post
}

export async function getPosts(limit = 20, offset = 0) {
  const sql = getSQL()

  const posts = await sql`
    SELECT p.*, u.full_name, u.username, u.avatar_url, u.is_verified
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.is_public = true
    ORDER BY p.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `

  return posts
}

export async function getPostById(id: string) {
  const sql = getSQL()

  const [post] = await sql`
    SELECT p.*, u.full_name, u.username, u.avatar_url, u.is_verified
    FROM posts p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ${id}
  `

  return post
}

export async function likePost(postId: string, userId: string) {
  const sql = getSQL()

  try {
    await sql`BEGIN`

    // Insert like
    await sql`
      INSERT INTO post_likes (post_id, user_id)
      VALUES (${postId}, ${userId})
      ON CONFLICT (post_id, user_id) DO NOTHING
    `

    // Update like count
    await sql`
      UPDATE posts 
      SET like_count = (SELECT COUNT(*) FROM post_likes WHERE post_id = ${postId})
      WHERE id = ${postId}
    `

    await sql`COMMIT`

    const [updatedPost] = await sql`
      SELECT like_count FROM posts WHERE id = ${postId}
    `

    return updatedPost
  } catch (error) {
    await sql`ROLLBACK`
    throw error
  }
}

export async function unlikePost(postId: string, userId: string) {
  const sql = getSQL()

  try {
    await sql`BEGIN`

    // Remove like
    await sql`
      DELETE FROM post_likes 
      WHERE post_id = ${postId} AND user_id = ${userId}
    `

    // Update like count
    await sql`
      UPDATE posts 
      SET like_count = (SELECT COUNT(*) FROM post_likes WHERE post_id = ${postId})
      WHERE id = ${postId}
    `

    await sql`COMMIT`

    const [updatedPost] = await sql`
      SELECT like_count FROM posts WHERE id = ${postId}
    `

    return updatedPost
  } catch (error) {
    await sql`ROLLBACK`
    throw error
  }
}

// Portfolio operations
export async function getUserPortfolios(userId: string) {
  const sql = getSQL()

  const portfolios = await sql`
    SELECT p.*, pp.holding_count, pp.avg_holding_return
    FROM portfolios p
    LEFT JOIN portfolio_performance pp ON p.id = pp.id
    WHERE p.user_id = ${userId}
    ORDER BY p.created_at DESC
  `

  return portfolios
}

export async function getPortfolioById(id: string) {
  const sql = getSQL()

  const [portfolio] = await sql`
    SELECT p.*, u.full_name as owner_name, u.username as owner_username
    FROM portfolios p
    JOIN users u ON p.user_id = u.id
    WHERE p.id = ${id}
  `

  return portfolio
}

export async function getPortfolioHoldings(portfolioId: string) {
  const sql = getSQL()

  const holdings = await sql`
    SELECT h.*, md.change_24h, md.change_percentage_24h
    FROM holdings h
    LEFT JOIN market_data md ON h.symbol = md.symbol
    WHERE h.portfolio_id = ${portfolioId}
    ORDER BY h.market_value DESC
  `

  return holdings
}

export async function createPortfolio(portfolioData: {
  userId: string
  name: string
  description?: string
  portfolioType?: string
  riskLevel?: string
  isPublic?: boolean
}) {
  const sql = getSQL()

  const [portfolio] = await sql`
    INSERT INTO portfolios (user_id, name, description, portfolio_type, risk_level, is_public)
    VALUES (${portfolioData.userId}, ${portfolioData.name}, ${portfolioData.description}, 
            ${portfolioData.portfolioType || "personal"}, ${portfolioData.riskLevel || "moderate"}, 
            ${portfolioData.isPublic || false})
    RETURNING *
  `

  return portfolio
}

// Follow operations
export async function followUser(followerId: string, followingId: string) {
  const sql = getSQL()

  await sql`
    INSERT INTO user_follows (follower_id, following_id)
    VALUES (${followerId}, ${followingId})
    ON CONFLICT (follower_id, following_id) DO NOTHING
  `
}

export async function unfollowUser(followerId: string, followingId: string) {
  const sql = getSQL()

  await sql`
    DELETE FROM user_follows 
    WHERE follower_id = ${followerId} AND following_id = ${followingId}
  `
}

export async function isFollowing(followerId: string, followingId: string) {
  const sql = getSQL()

  const [result] = await sql`
    SELECT EXISTS(
      SELECT 1 FROM user_follows 
      WHERE follower_id = ${followerId} AND following_id = ${followingId}
    ) as is_following
  `

  return result.is_following
}

// Market data operations
export async function updateMarketData(marketData: {
  symbol: string
  name?: string
  currentPrice: number
  change24h?: number
  changePercentage24h?: number
  marketCap?: number
  volume24h?: number
  high24h?: number
  low24h?: number
  assetType?: string
}) {
  const sql = getSQL()

  await sql`
    INSERT INTO market_data (symbol, name, current_price, change_24h, change_percentage_24h, 
                           market_cap, volume_24h, high_24h, low_24h, asset_type, last_updated)
    VALUES (${marketData.symbol}, ${marketData.name}, ${marketData.currentPrice}, 
            ${marketData.change24h}, ${marketData.changePercentage24h}, ${marketData.marketCap},
            ${marketData.volume24h}, ${marketData.high24h}, ${marketData.low24h}, 
            ${marketData.assetType}, NOW())
    ON CONFLICT (symbol) DO UPDATE SET
      current_price = EXCLUDED.current_price,
      change_24h = EXCLUDED.change_24h,
      change_percentage_24h = EXCLUDED.change_percentage_24h,
      market_cap = EXCLUDED.market_cap,
      volume_24h = EXCLUDED.volume_24h,
      high_24h = EXCLUDED.high_24h,
      low_24h = EXCLUDED.low_24h,
      last_updated = NOW()
  `
}

export async function getMarketData(symbols?: string[]) {
  const sql = getSQL()

  if (symbols && symbols.length > 0) {
    return await sql`
      SELECT * FROM market_data 
      WHERE symbol = ANY(${symbols})
      ORDER BY symbol
    `
  }

  return await sql`
    SELECT * FROM market_data 
    ORDER BY market_cap DESC NULLS LAST
    LIMIT 50
  `
}

// Investment strategies
export async function getInvestmentStrategies() {
  const sql = getSQL()

  const strategies = await sql`
    SELECT s.*, u.full_name as created_by_name, u.username as created_by_username
    FROM investment_strategies s
    LEFT JOIN users u ON s.created_by = u.id
    WHERE s.is_active = true
    ORDER BY s.created_at DESC
  `

  return strategies
}

// Notifications
export async function createNotification(notificationData: {
  userId: string
  type: string
  title: string
  message?: string
  data?: any
}) {
  const sql = getSQL()

  const [notification] = await sql`
    INSERT INTO notifications (user_id, type, title, message, data)
    VALUES (${notificationData.userId}, ${notificationData.type}, ${notificationData.title}, 
            ${notificationData.message}, ${JSON.stringify(notificationData.data || {})})
    RETURNING *
  `

  return notification
}

export async function getUserNotifications(userId: string, limit = 20) {
  const sql = getSQL()

  const notifications = await sql`
    SELECT * FROM notifications 
    WHERE user_id = ${userId}
    ORDER BY created_at DESC
    LIMIT ${limit}
  `

  return notifications
}

export async function markNotificationAsRead(notificationId: string) {
  const sql = getSQL()

  await sql`
    UPDATE notifications 
    SET is_read = true 
    WHERE id = ${notificationId}
  `
}
