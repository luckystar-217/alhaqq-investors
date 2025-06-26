import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// Create the NextAuth handler
const handler = NextAuth(authOptions)

// Export the handler for both GET and POST requests
export { handler as GET, handler as POST }

// Add OPTIONS handler for CORS preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  })
}
