"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { UserPlus } from "lucide-react"

const suggestedUsers = [
  {
    id: "3",
    name: "Alice Johnson",
    image: "/placeholder.svg?height=40&width=40",
    mutualFriends: 5,
    bio: "Photography enthusiast",
  },
  {
    id: "4",
    name: "Bob Wilson",
    image: "/placeholder.svg?height=40&width=40",
    mutualFriends: 3,
    bio: "Tech entrepreneur",
  },
  {
    id: "5",
    name: "Carol Davis",
    image: "/placeholder.svg?height=40&width=40",
    mutualFriends: 8,
    bio: "Travel blogger",
  },
]

export default function SuggestedUsers() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">People you may know</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {suggestedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.image || "/placeholder.svg"} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-sm">{user.name}</p>
                <p className="text-xs text-gray-500">{user.mutualFriends} mutual friends</p>
              </div>
            </div>
            <Button size="sm" variant="outline">
              <UserPlus className="h-3 w-3 mr-1" />
              Add
            </Button>
          </div>
        ))}
        <Button variant="link" className="w-full text-sm">
          See all suggestions
        </Button>
      </CardContent>
    </Card>
  )
}
