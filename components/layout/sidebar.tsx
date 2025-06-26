"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { Home, User, Users, MessageSquare, Bell, Bookmark, Calendar, TrendingUp, Settings } from "lucide-react"

export default function Sidebar() {
  const { data: session } = useSession()
  const pathname = usePathname()

  const navigationItems = [
    { href: "/feed", label: "Home", icon: Home },
    { href: "/profile", label: "Profile", icon: User },
    { href: "/friends", label: "Friends", icon: Users, badge: 12 },
    { href: "/messages", label: "Messages", icon: MessageSquare, badge: 3 },
    { href: "/notifications", label: "Notifications", icon: Bell, badge: 5 },
    { href: "/bookmarks", label: "Bookmarks", icon: Bookmark },
    { href: "/events", label: "Events", icon: Calendar },
    { href: "/trending", label: "Trending", icon: TrendingUp },
    { href: "/settings", label: "Settings", icon: Settings },
  ]

  return (
    <aside className="hidden lg:flex lg:w-64 lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16">
      <div className="flex flex-col flex-1 min-h-0 bg-white dark:bg-gray-800 border-r">
        <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
          {/* User Profile Section */}
          {session?.user && (
            <div className="flex items-center px-4 mb-6">
              <Avatar className="h-10 w-10">
                <AvatarImage src={session.user.image || ""} alt={session.user.name || "User"} />
                <AvatarFallback>{session.user.name?.charAt(0) || "U"}</AvatarFallback>
              </Avatar>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{session.user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">View profile</p>
              </div>
            </div>
          )}

          {/* Navigation */}
          <nav className="flex-1 px-2 space-y-1">
            {navigationItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start",
                      isActive && "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-100",
                    )}
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {item.badge && (
                      <Badge variant="secondary" className="ml-auto">
                        {item.badge}
                      </Badge>
                    )}
                  </Button>
                </Link>
              )
            })}
          </nav>

          {/* Quick Actions */}
          <div className="px-2 mt-6">
            <div className="bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
              <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">Quick Actions</h3>
              <div className="space-y-2">
                <Button size="sm" className="w-full" variant="outline">
                  Create Post
                </Button>
                <Button size="sm" className="w-full" variant="outline">
                  Find Friends
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
