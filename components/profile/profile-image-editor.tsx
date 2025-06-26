"use client"

import { useState, useRef, useCallback } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { ZoomIn, Crop, Palette, Download, Undo } from "lucide-react"

interface ProfileImageEditorProps {
  imageUrl: string
  aspectRatio: number
  onSave: (editedImageUrl: string) => void
  onCancel: () => void
}

interface ImageFilters {
  brightness: number
  contrast: number
  saturation: number
  blur: number
  sepia: number
}

export function ProfileImageEditor({ imageUrl, aspectRatio, onSave, onCancel }: ProfileImageEditorProps) {
  const [rotation, setRotation] = useState(0)
  const [zoom, setZoom] = useState(100)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [filters, setFilters] = useState<ImageFilters>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0,
    sepia: 0,
  })
  const [history, setHistory] = useState<any[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [isProcessing, setIsProcessing] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)

  const applyFilters = useCallback(() => {
    const filterString = [
      `brightness(${filters.brightness}%)`,
      `contrast(${filters.contrast}%)`,
      `saturate(${filters.saturation}%)`,
      `blur(${filters.blur}px)`,
      `sepia(${filters.sepia}%)`,
    ].join(" ")

    return filterString
  }, [filters])

  const handleFilterChange = (filterName: keyof ImageFilters, value: number) => {
    setFilters((prev) => ({
      ...prev,
      [filterName]: value,
    }))
  }

  const resetFilters = () => {
    setFilters({
      brightness: 100,
      contrast: 100,
      saturation: 100,
      blur: 0,
      sepia: 0,
    })
  }

  const resetTransform = () => {
    setRotation(0)
    setZoom(100)
    setPosition({ x: 0, y: 0 })
  }

  const processImage = async () => {
    setIsProcessing(true)
    try {
      if (!canvasRef.current || !imageRef.current) return

      const canvas = canvasRef.current
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Set canvas dimensions based on aspect ratio
      const width = 800
      const height = width / aspectRatio

      canvas.width = width
      canvas.height = height

      // Clear canvas
      ctx.clearRect(0, 0, width, height)

      // Apply transformations
      ctx.save()
      ctx.translate(width / 2, height / 2)
      ctx.rotate((rotation * Math.PI) / 180)
      ctx.scale(zoom / 100, zoom / 100)
      ctx.translate(position.x, position.y)

      // Apply filters
      ctx.filter = applyFilters()

      // Draw image
      const img = imageRef.current
      ctx.drawImage(img, -img.width / 2, -img.height / 2, img.width, img.height)
      ctx.restore()

      // Convert to data URL
      const dataUrl = canvas.toDataURL("image/jpeg", 0.9)
      onSave(dataUrl)
    } catch (error) {
      console.error("Error processing image:", error)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <Dialog open={true} onOpenChange={onCancel}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Profile Image</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Image Preview */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-4">
                <div
                  className="relative overflow-hidden rounded-lg bg-muted/30 flex items-center justify-center"
                  style={{ aspectRatio }}
                >
                  <img
                    ref={imageRef}
                    src={imageUrl || "/placeholder.svg"}
                    alt="Profile image preview"
                    className="max-w-full max-h-full object-contain transition-all duration-200"
                    style={{
                      transform: `rotate(${rotation}deg) scale(${zoom / 100}) translate(${position.x}px, ${position.y}px)`,
                      filter: applyFilters(),
                    }}
                    crossOrigin="anonymous"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={resetTransform}>
                <Undo className="h-4 w-4 mr-2" />
                Reset Transform
              </Button>
              <Button variant="outline" size="sm" onClick={resetFilters}>
                <Palette className="h-4 w-4 mr-2" />
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Editing Controls */}
          <div className="space-y-4">
            <Tabs defaultValue="transform">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="transform">
                  <Crop className="h-4 w-4 mr-2" />
                  Transform
                </TabsTrigger>
                <TabsTrigger value="filters">
                  <Palette className="h-4 w-4 mr-2" />
                  Filters
                </TabsTrigger>
                <TabsTrigger value="adjust">
                  <ZoomIn className="h-4 w-4 mr-2" />
                  Adjust
                </TabsTrigger>
              </TabsList>

              <TabsContent value="transform" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Rotation: {rotation}°</Label>
                      <Button variant="outline" size="sm" onClick={() => setRotation(0)}>
                        Reset
                      </Button>
                    </div>
                    <Slider
                      value={[rotation]}
                      min={-180}
                      max={180}
                      step={1}
                      onValueChange={(value) => setRotation(value[0])}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Zoom: {zoom}%</Label>
                      <Button variant="outline" size="sm" onClick={() => setZoom(100)}>
                        Reset
                      </Button>
                    </div>
                    <Slider value={[zoom]} min={50} max={200} step={1} onValueChange={(value) => setZoom(value[0])} />
                  </div>

                  <div>
                    <Label className="mb-2 block">Position</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">X: {position.x}px</Label>
                        <Slider
                          value={[position.x]}
                          min={-100}
                          max={100}
                          step={1}
                          onValueChange={(value) => setPosition((prev) => ({ ...prev, x: value[0] }))}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Y: {position.y}px</Label>
                        <Slider
                          value={[position.y]}
                          min={-100}
                          max={100}
                          step={1}
                          onValueChange={(value) => setPosition((prev) => ({ ...prev, y: value[0] }))}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="filters" className="space-y-4">
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Brightness: {filters.brightness}%</Label>
                    </div>
                    <Slider
                      value={[filters.brightness]}
                      min={0}
                      max={200}
                      step={1}
                      onValueChange={(value) => handleFilterChange("brightness", value[0])}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Contrast: {filters.contrast}%</Label>
                    </div>
                    <Slider
                      value={[filters.contrast]}
                      min={0}
                      max={200}
                      step={1}
                      onValueChange={(value) => handleFilterChange("contrast", value[0])}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Saturation: {filters.saturation}%</Label>
                    </div>
                    <Slider
                      value={[filters.saturation]}
                      min={0}
                      max={200}
                      step={1}
                      onValueChange={(value) => handleFilterChange("saturation", value[0])}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Blur: {filters.blur}px</Label>
                    </div>
                    <Slider
                      value={[filters.blur]}
                      min={0}
                      max={10}
                      step={0.1}
                      onValueChange={(value) => handleFilterChange("blur", value[0])}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-2">
                      <Label>Sepia: {filters.sepia}%</Label>
                    </div>
                    <Slider
                      value={[filters.sepia]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleFilterChange("sepia", value[0])}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="adjust" className="space-y-4">
                <div className="text-center space-y-4">
                  <p className="text-sm text-muted-foreground">Additional adjustment tools coming soon</p>

                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" disabled>
                      Auto Enhance
                    </Button>
                    <Button variant="outline" size="sm" disabled>
                      Remove Background
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Hidden canvas for processing */}
        <canvas ref={canvasRef} className="hidden" />

        <DialogFooter>
          <Button variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button onClick={processImage} disabled={isProcessing}>
            {isProcessing ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent mr-2" />
                Processing...
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
