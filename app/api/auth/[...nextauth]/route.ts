import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// NextAuth handles both GET and POST for all its sub-endpoints
export const { GET, POST } = NextAuth(authOptions)
