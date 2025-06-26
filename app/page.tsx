import { redirect } from "next/navigation"
import { getServerAuthSession } from "@/lib/auth"
import LandingPage from "@/components/landing-page"

export default async function Home() {
  const session = await getServerAuthSession()

  if (session) {
    redirect("/feed")
  }

  return <LandingPage />
}
