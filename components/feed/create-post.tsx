"use client"

import { useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ImageIcon, Video, MapPin, Smile, X, Loader2 } from "lucide-react"
import ImageUpload from "@/components/ui/image-upload"
import { useToast } from "@/hooks/use-toast"

interface CreatePostProps {
  onCreatePost: (content: string, images: string[]) => Promise<void>
}

export default function CreatePost({ onCreatePost }: CreatePostProps) {
  const { data: session } = useSession()
  const [content, setContent] = useState("")
  const [images, setImages] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showImageUpload, setShowImageUpload] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()

  const handleSubmit = async () => {
    if (!content.trim() && images.length === 0) {
      toast({
        variant: "destructive",
        title: "Empty post",
        description: "Please add some content or images to your post.",
      })
      return
    }

    setIsLoading(true)
    try {
      await onCreatePost(content.trim(), images)
      setContent("")
      setImages([])
      setShowImageUpload(false)
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = (imageUrl: string) => {
    setImages((prev) => [...prev, imageUrl])
    setShowImageUpload(false)
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current
    if (textarea) {
      textarea.style.height = "auto"
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex space-x-4">
          <Avatar className="h-10 w-10">
            <AvatarImage src={session?.user?.image || ""} alt={session?.user?.name || "User"} />
            <AvatarFallback>{session?.user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-4">
            <Textarea
              ref={textareaRef}
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => {
                setContent(e.target.value)
                adjustTextareaHeight()
              }}
              className="min-h-[80px] resize-none border-0 p-0 focus-visible:ring-0 text-lg placeholder:text-gray-500"
              maxLength={2000}
              aria-label="Post content"
            />

            {/* Character count */}
            <div className="flex justify-end">
              <span className={`text-xs ${content.length > 1800 ? "text-red-500" : "text-gray-500"}`}>
                {content.length}/2000
              </span>
            </div>

            {/* Image Preview */}
            {images.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mt-4">
                {images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={image || "/placeholder.svg"}
                      alt={`Upload ${index + 1}`}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <Button
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeImage(index)}
                      aria-label={`Remove image ${index + 1}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}

            {/* Image Upload Component */}
            {showImageUpload && (
              <div className="mt-4">
                <ImageUpload
                  onUpload={handleImageUpload}
                  onCancel={() => setShowImageUpload(false)}
                  maxFiles={4 - images.length}
                />
              </div>
            )}
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between pt-0">
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowImageUpload(!showImageUpload)}
            disabled={images.length >= 4}
            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Photo
            {images.length >= 4 && (
              <Badge variant="secondary" className="ml-2">
                Max
              </Badge>
            )}
          </Button>

          <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700 hover:bg-green-50" disabled>
            <Video className="h-4 w-4 mr-2" />
            Video
          </Button>

          <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700 hover:bg-red-50" disabled>
            <MapPin className="h-4 w-4 mr-2" />
            Location
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
            disabled
          >
            <Smile className="h-4 w-4 mr-2" />
            Feeling
          </Button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={isLoading || (!content.trim() && images.length === 0)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Posting...
            </>
          ) : (
            "Post"
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
