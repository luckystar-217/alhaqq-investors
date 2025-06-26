"use client"

import type React from "react"
import { useState, useRef, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Upload, X } from "lucide-react"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange?: (value: string) => void
  onUpload?: (value: string) => void
  onCancel?: () => void
  disabled?: boolean
  className?: string
  aspectRatio?: number
  maxSizeMB?: number
  maxFiles?: number
  children?: ReactNode
}

export default function ImageUpload({
  value,
  onChange,
  onUpload,
  onCancel,
  disabled = false,
  className,
  aspectRatio = 1,
  maxSizeMB = 5,
  maxFiles = 1,
  children,
}: ImageUploadProps) {
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const validateFile = (file: File): boolean => {
    // Check file type
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return false
    }

    // Check file size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`)
      return false
    }

    setError(null)
    return true
  }

  const processFile = async (file: File) => {
    if (!validateFile(file)) return

    setIsUploading(true)
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        if (onChange) onChange(result)
        if (onUpload) onUpload(result)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error("Error processing file:", error)
      setError("Failed to process image")
    } finally {
      setIsUploading(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const handleButtonClick = () => {
    inputRef.current?.click()
  }

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onChange) onChange("")
  }

  if (children) {
    return (
      <div className={className}>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />
        <div onClick={handleButtonClick} className="cursor-pointer">
          {children}
        </div>
        {error && <p className="text-sm text-destructive mt-2">{error}</p>}
      </div>
    )
  }

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      <div
        className={cn(
          "relative border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
          dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25",
          value ? "h-auto" : "h-40",
          disabled && "opacity-50 cursor-not-allowed",
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleButtonClick}
      >
        {value ? (
          <div className="relative w-full" style={{ aspectRatio }}>
            <Image src={value || "/placeholder.svg"} alt="Uploaded image" fill className="object-cover rounded-md" />
            <Button variant="destructive" size="icon" className="absolute top-2 right-2 h-6 w-6" onClick={handleRemove}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <>
            {isUploading ? (
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            ) : (
              <Upload className="h-10 w-10 text-muted-foreground" />
            )}
            <p className="text-sm text-muted-foreground text-center">
              {isUploading ? "Uploading..." : "Drag & drop an image here, or click to select"}
            </p>
            <p className="text-xs text-muted-foreground">Max file size: {maxSizeMB}MB</p>
          </>
        )}
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      {onCancel && (
        <div className="flex justify-end">
          <Button variant="outline" size="sm" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      )}
    </div>
  )
}

export { ImageUpload }
