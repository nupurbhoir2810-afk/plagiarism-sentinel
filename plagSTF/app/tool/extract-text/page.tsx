"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  FileUp,
  Copy,
  Download,
  FileText,
  ImageIcon,
  Languages,
  CheckCircle,
  Scan,
  Layers,
  RefreshCw,
  Highlighter,
  Maximize,
  RotateCw,
  Wand2,
} from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import AnimatedBackground from "@/components/animated-background"

interface ImageAnalysis {
  objects: string[]
  colors: { color: string; percentage: number }[]
  faces: number
  text: string[]
  quality: {
    brightness: number
    contrast: number
    sharpness: number
    resolution: number
  }
  metadata: {
    format: string
    dimensions: string
    size: string
    creationDate?: string
    lastModified?: string
    camera?: string
    location?: string
  }
  languages?: string[]
  confidence?: number
  orientation?: number
  textRegions?: {
    x: number
    y: number
    width: number
    height: number
    text: string
    confidence: number
  }[]
  documentType?: string
  documentStructure?: {
    title?: string
    headings: number
    paragraphs: number
    lists: number
    tables: number
    images: number
    signatures?: number
  }
}

interface ExtractedTextInfo {
  content: string
  metadata: {
    language: string
    confidence: number
    wordCount: number
    characterCount: number
    sentences: number
    paragraphs: number
    formatting: {
      alignment: string
      fontFamilies: string[]
      fontSize: string
      styles: string[]
    }
    keywords: string[]
    sentiment: {
      score: number
      label: string
    }
    readability: {
      score: number
      level: string
      fleschKincaid: number
    }
    entities?: {
      people: string[]
      organizations: string[]
      locations: string[]
      dates: string[]
    }
  }
  structure: {
    headings: number
    lists: number
    tables: number
    images: number
    equations?: number
    codeBlocks?: number
    citations?: number
  }
  summary?: string
  topics?: string[]
  fingerprint?: string
}

export default function ExtractText() {
  const [loading, setLoading] = useState(false)
  const [extractedText, setExtractedText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [analysis, setAnalysis] = useState<ImageAnalysis | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("auto") // Default to auto-detect
  const [textInfo, setTextInfo] = useState<ExtractedTextInfo | null>(null)
  const [processingStage, setProcessingStage] = useState<string>("")
  const [processingProgress, setProcessingProgress] = useState(0)
  const [preserveFormatting, setPreserveFormatting] = useState(true)
  const [enhanceQuality, setEnhanceQuality] = useState(true)
  const [confidenceThreshold, setConfidenceThreshold] = useState(70)
  const [showTextRegions, setShowTextRegions] = useState(false)
  const [imageRotation, setImageRotation] = useState(0)
  const [showOriginalImage, setShowOriginalImage] = useState(false)
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [enhancedImage, setEnhancedImage] = useState<string | null>(null)
  const [showEnhancedPreview, setShowEnhancedPreview] = useState(false)
  const [selectedTextRegion, setSelectedTextRegion] = useState<number | null>(null)
  const [showFullScreenImage, setShowFullScreenImage] = useState(false)
  const [documentType, setDocumentType] = useState<string>("auto")
  const [processingStartTime, setProcessingStartTime] = useState<number>(0)
  const [ocrEngine, setOcrEngine] = useState<string>("advanced")
  const [showSummary, setShowSummary] = useState(false)
  const [showTopics, setShowTopics] = useState(false)
  const [showEntities, setShowEntities] = useState(false)
  const [showKeywords, setShowKeywords] = useState(true)
  const [showReadability, setShowReadability] = useState(true)
  const [showSentiment, setShowSentiment] = useState(true)
  const [showStructure, setShowStructure] = useState(true)
  const [showFormatting, setShowFormatting] = useState(true)
  const [showLanguage, setShowLanguage] = useState(true)
  const [showConfidence, setShowConfidence] = useState(true)
  const [showWordCount, setShowWordCount] = useState(true)
  const [showCharacterCount, setShowCharacterCount] = useState(true)
  const [showSentences, setShowSentences] = useState(true)
  const [showParagraphs, setShowParagraphs] = useState(true)
  const [showFingerprint, setShowFingerprint] = useState(false)
  const [showMetadata, setShowMetadata] = useState(true)
  const [showQuality, setShowQuality] = useState(true)
  const [showObjects, setShowObjects] = useState(true)
  const [showColors, setShowColors] = useState(true)
  const [showFaces, setShowFaces] = useState(true)
  const [showLanguages, setShowLanguages] = useState(true)
  const [showOrientation, setShowOrientation] = useState(true)
  const [showDocumentType, setShowDocumentType] = useState(true)
  const [showDocumentStructure, setShowDocumentStructure] = useState(true)
  const [showTextRegionsInfo, setShowTextRegionsInfo] = useState(true)
  const [showTextRegionsOnImage, setShowTextRegionsOnImage] = useState(true)
  const [showTextRegionsConfidence, setShowTextRegionsConfidence] = useState(true)
  const [showTextRegionsText, setShowTextRegionsText] = useState(true)

  const analyzeImage = async (url: string): Promise<ImageAnalysis> => {
    // Enhanced image analysis simulation
    try {
      await new Promise((resolve) => setTimeout(resolve, 1500))

      return {
        objects: ["document", "text", "paper", "writing"],
        colors: [
          { color: "white", percentage: 85 },
          { color: "black", percentage: 12 },
          { color: "gray", percentage: 3 },
        ],
        faces: 0,
        text: ["Sample", "Extracted", "Text", "Content"],
        quality: {
          brightness: 92,
          contrast: 88,
          sharpness: 95,
          resolution: 300,
        },
        metadata: {
          format: "JPEG",
          dimensions: "800x600",
          size: "2.1 MB",
          creationDate: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          camera: "Unknown",
          location: "Unknown",
        },
        languages: ["English", "Spanish"],
        confidence: 95.5,
        orientation: 0,
        textRegions: [
          {
            x: 50,
            y: 100,
            width: 400,
            height: 50,
            text: "Sample Header Text",
            confidence: 98.2,
          },
          {
            x: 50,
            y: 200,
            width: 700,
            height: 300,
            text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
            confidence: 96.5,
          },
        ],
        documentType: "Article",
        documentStructure: {
          title: "Sample Document",
          headings: 2,
          paragraphs: 5,
          lists: 1,
          tables: 0,
          images: 0,
          signatures: 0,
        },
      }
    } catch (error) {
      throw new Error("Failed to analyze image")
    }
  }

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const img = e.target as HTMLImageElement
    img.src = "/placeholder.svg"
    setImageUrl("")
    setAnalysis(null)
    toast.error("Failed to load image. Please try again.")
  }

  const processText = async (text: string): Promise<ExtractedTextInfo> => {
    // Simulate text processing with multiple stages
    const stages = [
      { name: "Analyzing text structure...", duration: 800 },
      { name: "Detecting language...", duration: 600 },
      { name: "Extracting metadata...", duration: 700 },
      { name: "Analyzing sentiment...", duration: 500 },
      { name: "Calculating readability...", duration: 600 },
      { name: "Identifying entities...", duration: 700 },
      { name: "Extracting keywords...", duration: 500 },
      { name: "Generating summary...", duration: 800 },
      { name: "Creating document fingerprint...", duration: 400 },
      { name: "Finalizing report...", duration: 500 },
    ]

    for (let i = 0; i < stages.length; i++) {
      setProcessingStage(stages[i].name)
      setProcessingProgress(((i + 1) / stages.length) * 100)
      await new Promise((resolve) => setTimeout(resolve, stages[i].duration))
    }

    // Generate document fingerprint
    const fingerprint = `fp-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`

    // Simulate processed text info with enhanced details
    return {
      content: text,
      metadata: {
        language: "English",
        confidence: 98.5,
        wordCount: text.split(/\s+/).length,
        characterCount: text.length,
        sentences: text.split(/[.!?]+/).length,
        paragraphs: text.split(/\n\s*\n/).length,
        formatting: {
          alignment: "left",
          fontFamilies: ["Arial", "Times New Roman"],
          fontSize: "12pt",
          styles: ["normal", "bold", "italic"],
        },
        keywords: ["important", "key", "terms", "document", "analysis"],
        sentiment: {
          score: 0.8,
          label: "Positive",
        },
        readability: {
          score: 75,
          level: "College",
          fleschKincaid: 12.5,
        },
        entities: {
          people: ["John Smith", "Jane Doe"],
          organizations: ["Acme Corp", "Global Industries"],
          locations: ["New York", "London"],
          dates: ["2023-05-15", "January 2024"],
        },
      },
      structure: {
        headings: 3,
        lists: 2,
        tables: 1,
        images: 2,
        equations: 0,
        codeBlocks: 0,
        citations: 4,
      },
      summary:
        "This document discusses key concepts related to document analysis and text extraction technologies. It covers important terms and methodologies used in the field.",
      topics: ["Document Analysis", "Text Extraction", "OCR Technology", "Information Retrieval"],
      fingerprint: fingerprint,
    }
  }

  const enhanceImage = async (url: string): Promise<string> => {
    // Simulate image enhancement
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // In a real implementation, this would apply image processing techniques
    // For now, we'll just return the original URL
    return url
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const file = e.target.files?.[0]
      if (!file) {
        throw new Error("No file selected")
      }

      if (!file.type.startsWith("image/")) {
        throw new Error("Please upload an image file")
      }

      if (file.size > 10 * 1024 * 1024) {
        throw new Error("File size must be less than 10MB")
      }

      setLoading(true)
      setProcessingStartTime(Date.now())
      const previewUrl = URL.createObjectURL(file)
      setImageUrl(previewUrl)
      setOriginalImage(previewUrl)

      // Enhanced processing steps
      const steps = [
        { message: "Analyzing image structure...", duration: 800 },
        { message: "Enhancing image quality...", duration: 1200 },
        { message: "Detecting text regions...", duration: 1000 },
        { message: "Processing content...", duration: 800 },
        { message: "Performing OCR...", duration: 1200 },
        { message: "Detecting languages...", duration: 800 },
        { message: "Analyzing document structure...", duration: 900 },
        { message: "Preserving formatting...", duration: 700 },
        { message: "Extracting text...", duration: 1000 },
        { message: "Finalizing results...", duration: 600 },
      ]

      for (const step of steps) {
        setProcessingStage(step.message)
        setProcessingProgress((steps.indexOf(step) / steps.length) * 100)
        toast.info(step.message)
        await new Promise((resolve) => setTimeout(resolve, step.duration))
      }

      // Enhance image if option is enabled
      if (enhanceQuality) {
        const enhancedImageUrl = await enhanceImage(previewUrl)
        setEnhancedImage(enhancedImageUrl)
      }

      const imageAnalysis = await analyzeImage(previewUrl)
      setAnalysis(imageAnalysis)

      // Enhanced extracted content with formatting
      const extractedContent = `📄 DOCUMENT ANALYSIS REPORT
═══════════════════════

📅 Date: ${new Date().toLocaleDateString()}
🕒 Time: ${new Date().toLocaleTimeString()}

📝 EXTRACTED CONTENT
──────────────────
${imageAnalysis.textRegions?.map((region) => region.text).join("\n\n") || "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."}

🔍 ANALYSIS DETAILS
──────────────────
• Document Type: ${imageAnalysis.documentType || "Unknown"}
• Language: Multi-language detection
  - Primary: ${imageAnalysis.languages?.[0] || "Unknown"}
  - Secondary: ${imageAnalysis.languages?.[1] || "None"}
• Confidence Score: ${imageAnalysis.confidence}%
• Character Count: ${imageAnalysis.textRegions?.reduce((acc, region) => acc + region.text.length, 0) || 234}
• Word Count: ${imageAnalysis.textRegions?.reduce((acc, region) => acc + region.text.split(/\s+/).filter(Boolean).length, 0) || 42}

📊 QUALITY METRICS
──────────────────
• Image Quality: ${imageAnalysis.quality.sharpness}%
• Text Clarity: ${imageAnalysis.quality.contrast}%
• Resolution: ${imageAnalysis.quality.resolution} DPI
• Format: ${imageAnalysis.metadata.format}

📌 DOCUMENT STRUCTURE
──────────────────
• Title: ${imageAnalysis.documentStructure?.title || "Unknown"}
• Headings: ${imageAnalysis.documentStructure?.headings || 0}
• Paragraphs: ${imageAnalysis.documentStructure?.paragraphs || 0}
• Lists: ${imageAnalysis.documentStructure?.lists || 0}
• Tables: ${imageAnalysis.documentStructure?.tables || 0}
• Images: ${imageAnalysis.documentStructure?.images || 0}

🔎 TEXT REGIONS
──────────────────
${
  imageAnalysis.textRegions
    ?.map(
      (region, index) =>
        `Region ${index + 1}:
  - Position: (${region.x}, ${region.y})
  - Size: ${region.width}x${region.height}
  - Confidence: ${region.confidence}%
  - Text: "${region.text.substring(0, 50)}${region.text.length > 50 ? "..." : ""}"`,
    )
    .join("\n\n") || "No text regions detected"
}`

      setExtractedText(extractedContent)

      const textInfoResult = await processText(extractedContent)
      setTextInfo(textInfoResult)

      const processingTime = ((Date.now() - processingStartTime) / 1000).toFixed(2)
      toast.success(`Text extracted successfully in ${processingTime} seconds!`)
    } catch (error) {
      const message = error instanceof Error ? error.message : "Failed to process image"
      toast.error(message)
    } finally {
      setLoading(false)
      setProcessingProgress(100)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(extractedText)
      toast.success("Text copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy text")
    }
  }

  const downloadText = () => {
    try {
      const blob = new Blob([extractedText], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `extracted-text-${new Date().toISOString().slice(0, 10)}.txt`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Text downloaded!")
    } catch (error) {
      toast.error("Failed to download text")
    }
  }

  const rotateImage = () => {
    setImageRotation((prev) => (prev + 90) % 360)
  }

  const resetImage = () => {
    setImageRotation(0)
    setShowOriginalImage(false)
    setShowEnhancedPreview(false)
  }

  const toggleTextRegions = () => {
    setShowTextRegions(!showTextRegions)
  }

  const handleTextRegionClick = (index: number) => {
    setSelectedTextRegion(index)
  }

  return (
    <div className="container py-8">
      <AnimatedBackground variant="grid" intensity="light" color="#06b6d4" />
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">Advanced Text Extraction</h1>
          <p className="text-muted-foreground">Extract and analyze text from images with AI-powered OCR technology</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Image</CardTitle>
            <CardDescription>Upload an image containing text to extract and analyze its content</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-4">
                <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                  <FileUp className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="preserveFormatting"
                    checked={preserveFormatting}
                    onCheckedChange={setPreserveFormatting}
                  />
                  <Label htmlFor="preserveFormatting">Preserve Formatting</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Switch id="enhanceQuality" checked={enhanceQuality} onCheckedChange={setEnhanceQuality} />
                  <Label htmlFor="enhanceQuality">Enhance Image Quality</Label>
                </div>

                <Select value={ocrEngine} onValueChange={setOcrEngine}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select OCR Engine" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="standard">Standard OCR</SelectItem>
                    <SelectItem value="advanced">Advanced OCR</SelectItem>
                    <SelectItem value="premium">Premium OCR</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={documentType} onValueChange={setDocumentType}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Document Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="auto">Auto-detect</SelectItem>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="book">Book</SelectItem>
                    <SelectItem value="form">Form</SelectItem>
                    <SelectItem value="receipt">Receipt</SelectItem>
                    <SelectItem value="id">ID Card</SelectItem>
                    <SelectItem value="invoice">Invoice</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confidenceThreshold">Confidence Threshold: {confidenceThreshold}%</Label>
                <Slider
                  id="confidenceThreshold"
                  min={0}
                  max={100}
                  step={5}
                  value={[confidenceThreshold]}
                  onValueChange={(value) => setConfidenceThreshold(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>More Text (Lower Accuracy)</span>
                  <span>Higher Accuracy (Less Text)</span>
                </div>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />

              {imageUrl && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={rotateImage}>
                        <RotateCw className="h-4 w-4 mr-2" />
                        Rotate
                      </Button>
                      <Button variant="outline" size="sm" onClick={resetImage}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                      <Button variant="outline" size="sm" onClick={toggleTextRegions}>
                        <Highlighter className="h-4 w-4 mr-2" />
                        {showTextRegions ? "Hide" : "Show"} Text Regions
                      </Button>
                    </div>
                    <div className="flex gap-2">
                      {enhancedImage && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowEnhancedPreview(!showEnhancedPreview)}
                        >
                          <Wand2 className="h-4 w-4 mr-2" />
                          {showEnhancedPreview ? "Original" : "Enhanced"}
                        </Button>
                      )}
                      <Button variant="outline" size="sm" onClick={() => setShowFullScreenImage(true)}>
                        <Maximize className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="relative group border rounded-lg overflow-hidden">
                    <img
                      src={showEnhancedPreview ? enhancedImage || imageUrl : imageUrl}
                      alt="Preview"
                      className="w-full object-contain max-h-[500px]"
                      style={{ transform: `rotate(${imageRotation}deg)` }}
                      onError={handleImageError}
                    />

                    {/* Text region overlays */}
                    {showTextRegions && analysis?.textRegions && (
                      <>
                        {analysis.textRegions.map((region, index) => (
                          <div
                            key={index}
                            className={`absolute border-2 ${
                              selectedTextRegion === index ? "border-primary" : "border-blue-500"
                            } bg-blue-500/10 cursor-pointer transition-colors hover:bg-blue-500/20`}
                            style={{
                              left: `${(region.x / 800) * 100}%`,
                              top: `${(region.y / 600) * 100}%`,
                              width: `${(region.width / 800) * 100}%`,
                              height: `${(region.height / 600) * 100}%`,
                              transform: `rotate(${imageRotation}deg)`,
                            }}
                            onClick={() => handleTextRegionClick(index)}
                          >
                            <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1">
                              {region.confidence.toFixed(0)}%
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              )}

              {loading && (
                <div className="space-y-4">
                  <Progress value={processingProgress} />
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">{processingStage}</p>
                    <p className="text-sm text-muted-foreground">{processingProgress.toFixed(0)}%</p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          {analysis && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Scan className="h-5 w-5 text-primary" />
                  Image Analysis
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium mb-2">Document Information</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Type:</span>
                          <span className="text-sm font-medium">{analysis.documentType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Format:</span>
                          <span className="text-sm font-medium">{analysis.metadata.format}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Dimensions:</span>
                          <span className="text-sm font-medium">{analysis.metadata.dimensions}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Size:</span>
                          <span className="text-sm font-medium">{analysis.metadata.size}</span>
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Languages Detected</h3>
                      <div className="flex flex-wrap gap-2">
                        {analysis.languages?.map((lang, i) => (
                          <Badge key={i} variant="outline" className="flex items-center gap-1">
                            <Languages className="h-3 w-3" />
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Quality Analysis</h3>
                      <div className="space-y-2">
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Text Clarity</span>
                            <span>{analysis.quality.contrast}%</span>
                          </div>
                          <Progress value={analysis.quality.contrast} className="mt-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Image Quality</span>
                            <span>{analysis.quality.sharpness}%</span>
                          </div>
                          <Progress value={analysis.quality.sharpness} className="mt-1" />
                        </div>
                        <div>
                          <div className="flex justify-between text-sm">
                            <span>Resolution</span>
                            <span>{analysis.quality.resolution} DPI</span>
                          </div>
                          <Progress value={analysis.quality.resolution / 10} className="mt-1" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium mb-2">Document Structure</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Title:</span>
                          <span className="text-sm font-medium">{analysis.documentStructure?.title || "Unknown"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Headings:</span>
                          <span className="text-sm font-medium">{analysis.documentStructure?.headings || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Paragraphs:</span>
                          <span className="text-sm font-medium">{analysis.documentStructure?.paragraphs || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Lists:</span>
                          <span className="text-sm font-medium">{analysis.documentStructure?.lists || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Tables:</span>
                          <span className="text-sm font-medium">{analysis.documentStructure?.tables || 0}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-muted-foreground">Images:</span>
                          <span className="text-sm font-medium">{analysis.documentStructure?.images || 0}</span>
                        </div>
                      </div>
                    </div>

                    {analysis.textRegions && analysis.textRegions.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium mb-2">Text Regions</h3>
                        <div className="space-y-3">
                          {analysis.textRegions.map((region, index) => (
                            <div
                              key={index}
                              className={`p-3 rounded-md border ${
                                selectedTextRegion === index ? "border-primary bg-primary/5" : ""
                              }`}
                              onClick={() => handleTextRegionClick(index)}
                            >
                              <div className="flex justify-between mb-1">
                                <span className="text-sm font-medium">Region {index + 1}</span>
                                <Badge variant="outline">{region.confidence.toFixed(1)}%</Badge>
                              </div>
                              <p className="text-xs text-muted-foreground mb-1">
                                Position: ({region.x}, {region.y}) | Size: {region.width}x{region.height}
                              </p>
                              <p className="text-sm line-clamp-2">{region.text}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}

          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Extracted Text
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1">
                      <CheckCircle className="h-3 w-3 text-green-500" />
                      {textInfo?.metadata.confidence.toFixed(1)}% Confidence
                    </Badge>
                    {textInfo?.metadata.language && (
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Languages className="h-3 w-3" />
                        {textInfo.metadata.language}
                      </Badge>
                    )}
                  </div>
                  {extractedText && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadText}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>

                {loading ? (
                  <div className="space-y-4">
                    <Progress value={processingProgress} />
                    <div className="space-y-2">
                      <p className="text-sm text-center font-medium">{processingStage}</p>
                      <p className="text-xs text-center text-muted-foreground">Analyzing and extracting text content</p>
                    </div>
                  </div>
                ) : extractedText ? (
                  <div className="space-y-4">
                    <Textarea value={extractedText} className="min-h-[400px] font-mono text-sm" readOnly />
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm text-muted-foreground">
                        Text extracted with {analysis?.confidence?.toFixed(1)}% confidence
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-8">
                    <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Upload an image to extract text</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {textInfo && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="h-5 w-5 text-primary" />
                Document Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h3 className="font-semibold mb-4">Content Analysis</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium">Language & Confidence</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge>{textInfo.metadata.language}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {textInfo.metadata.confidence.toFixed(1)}% confidence
                        </span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Document Statistics</h4>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Words:</span> {textInfo.metadata.wordCount}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Characters:</span> {textInfo.metadata.characterCount}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Sentences:</span> {textInfo.metadata.sentences}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Paragraphs:</span> {textInfo.metadata.paragraphs}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Formatting</h4>
                      <div className="space-y-1 mt-1">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Alignment:</span>{" "}
                          {textInfo.metadata.formatting.alignment}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Font:</span>{" "}
                          {textInfo.metadata.formatting.fontFamilies.join(", ")}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Size:</span> {textInfo.metadata.formatting.fontSize}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Styles:</span>{" "}
                          {textInfo.metadata.formatting.styles.join(", ")}
                        </div>
                      </div>
                    </div>

                    {textInfo.metadata.entities && (
                      <div>
                        <h4 className="text-sm font-medium">Entities</h4>
                        <div className="space-y-2 mt-1">
                          {textInfo.metadata.entities.people.length > 0 && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">People:</span>{" "}
                              {textInfo.metadata.entities.people.join(", ")}
                            </div>
                          )}
                          {textInfo.metadata.entities.organizations.length > 0 && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Organizations:</span>{" "}
                              {textInfo.metadata.entities.organizations.join(", ")}
                            </div>
                          )}
                          {textInfo.metadata.entities.locations.length > 0 && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Locations:</span>{" "}
                              {textInfo.metadata.entities.locations.join(", ")}
                            </div>
                          )}
                          {textInfo.metadata.entities.dates.length > 0 && (
                            <div className="text-sm">
                              <span className="text-muted-foreground">Dates:</span>{" "}
                              {textInfo.metadata.entities.dates.join(", ")}
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {textInfo.fingerprint && (
                      <div>
                        <h4 className="text-sm font-medium">Document Fingerprint</h4>
                        <div className="mt-1 p-2 bg-muted rounded-md">
                          <code className="text-xs font-mono">{textInfo.fingerprint}</code>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-4">Content Analysis</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium">Sentiment Analysis</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Progress value={textInfo.metadata.sentiment.score * 100} className="w-full" />
                        <span className="text-sm whitespace-nowrap">{textInfo.metadata.sentiment.label}</span>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Readability</h4>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Progress value={textInfo.metadata.readability.score} className="w-full" />
                          <span className="text-sm whitespace-nowrap">{textInfo.metadata.readability.level}</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Flesch-Kincaid Grade Level:</span>{" "}
                          {textInfo.metadata.readability.fleschKincaid}
                        </div>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Document Structure</h4>
                      <div className="grid grid-cols-2 gap-2 mt-1">
                        <div className="text-sm">
                          <span className="text-muted-foreground">Headings:</span> {textInfo.structure.headings}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Lists:</span> {textInfo.structure.lists}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Tables:</span> {textInfo.structure.tables}
                        </div>
                        <div className="text-sm">
                          <span className="text-muted-foreground">Images:</span> {textInfo.structure.images}
                        </div>
                        {textInfo.structure.citations && (
                          <div className="text-sm">
                            <span className="text-muted-foreground">Citations:</span> {textInfo.structure.citations}
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm font-medium">Keywords</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {textInfo.metadata.keywords.map((keyword, index) => (
                          <Badge key={index} variant="secondary">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {textInfo.topics && (
                      <div>
                        <h4 className="text-sm font-medium">Topics</h4>
                        <div className="flex flex-wrap gap-2 mt-1">
                          {textInfo.topics.map((topic, index) => (
                            <Badge key={index} variant="outline">
                              {topic}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {textInfo.summary && (
                      <div>
                        <h4 className="text-sm font-medium">Summary</h4>
                        <p className="text-sm mt-1">{textInfo.summary}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Full Screen Image Dialog */}
        <Dialog open={showFullScreenImage} onOpenChange={setShowFullScreenImage}>
          <DialogContent className="max-w-5xl" aria-describedby="fullscreen-image-description">
            <DialogHeader>
              <DialogTitle>Image Preview</DialogTitle>
              <DialogDescription id="fullscreen-image-description">
                Full resolution view of the uploaded image
              </DialogDescription>
            </DialogHeader>
            <div className="relative">
              <img
                src={showEnhancedPreview ? enhancedImage || imageUrl : imageUrl}
                alt="Full Screen Preview"
                className="w-full object-contain"
                style={{ transform: `rotate(${imageRotation}deg)` }}
              />

              {/* Text region overlays */}
              {showTextRegions && analysis?.textRegions && (
                <>
                  {analysis.textRegions.map((region, index) => (
                    <div
                      key={index}
                      className={`absolute border-2 ${
                        selectedTextRegion === index ? "border-primary" : "border-blue-500"
                      } bg-blue-500/10 cursor-pointer transition-colors hover:bg-blue-500/20`}
                      style={{
                        left: `${(region.x / 800) * 100}%`,
                        top: `${(region.y / 600) * 100}%`,
                        width: `${(region.width / 800) * 100}%`,
                        height: `${(region.height / 600) * 100}%`,
                        transform: `rotate(${imageRotation}deg)`,
                      }}
                      onClick={() => handleTextRegionClick(index)}
                    >
                      <div className="absolute top-0 right-0 bg-blue-500 text-white text-xs px-1">
                        {region.confidence.toFixed(0)}%
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={rotateImage}>
                  <RotateCw className="h-4 w-4 mr-2" />
                  Rotate
                </Button>
                <Button variant="outline" size="sm" onClick={toggleTextRegions}>
                  <Highlighter className="h-4 w-4 mr-2" />
                  {showTextRegions ? "Hide" : "Show"} Text Regions
                </Button>
              </div>
              {enhancedImage && (
                <Button variant="outline" size="sm" onClick={() => setShowEnhancedPreview(!showEnhancedPreview)}>
                  <Wand2 className="h-4 w-4 mr-2" />
                  {showEnhancedPreview ? "Original" : "Enhanced"}
                </Button>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
