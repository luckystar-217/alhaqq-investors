"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp } from "lucide-react"

const trendingTopics = [
  { tag: "#Technology", posts: 1234 },
  { tag: "#Photography", posts: 856 },
  { tag: "#Travel", posts: 642 },
  { tag: "#Food", posts: 523 },
  { tag: "#Fitness", posts: 412 },
]

export default function TrendingTopics() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center">
          <TrendingUp className="h-5 w-5 mr-2" />
          Trending Topics
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {trendingTopics.map((topic, index) => (
          <div key={topic.tag} className="flex items-center justify-between">
            <div>
              <p className="font-medium text-sm text-blue-600 hover:text-blue-700 cursor-pointer">{topic.tag}</p>
              <p className="text-xs text-gray-500">{topic.posts.toLocaleString()} posts</p>
            </div>
            <Badge variant="secondary" className="text-xs">
              #{index + 1}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
