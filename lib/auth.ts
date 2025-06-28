import type { NextAuthOptions } from "next-auth"
import { getServerSession } from "next-auth/next"
import CredentialsProvider from "next-auth/providers/credentials"
import { getUserByEmail } from "./database"
import { logger } from "./logger"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          logger.warn("Missing credentials in auth attempt")
          return null
        }

        try {
          const user = await getUserByEmail(credentials.email)

          if (!user) {
            logger.warn("User not found during auth", { email: credentials.email })
            return null
          }

          if (!user.password_hash) {
            logger.warn("User has no password hash", { email: credentials.email })
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password_hash)

          if (!isPasswordValid) {
            logger.warn("Invalid password during auth", { email: credentials.email })
            return null
          }

          logger.info("User authenticated successfully", { userId: user.id, email: user.email })

          return {
            id: user.id,
            email: user.email,
            name: user.full_name,
            image: user.avatar_url,
          }
        } catch (error) {
          logger.error("Error during authentication", { error, email: credentials.email })
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    error: "/auth/error",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
      }
      return session
    },
  },
  events: {
    async signIn({ user, account, profile }) {
      logger.info("User signed in", {
        userId: user.id,
        email: user.email,
        provider: account?.provider,
      })
    },
    async signOut({ session, token }) {
      logger.info("User signed out", {
        userId: token?.id || session?.user?.id,
      })
    },
  },
  debug: process.env.NODE_ENV === "development",
}

export async function getServerAuthSession() {
  return await getServerSession(authOptions)
}
