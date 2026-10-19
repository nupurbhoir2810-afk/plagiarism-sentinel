"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { AlertCircle, Info, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface AIContentDetectorProps {
  initialText?: string
  onAnalysisComplete?: (results: AIAnalysisResult) => void
}

export interface AIAnalysisResult {
  aiPercentage: number
  humanPercentage: number
  confidenceScore: number
  highlightedText: {
    text: string
    isAI: boolean
    confidence: number
  }[]
  patterns: {
    name: string
    description: string
    frequency: number
  }[]
}

export function AIContentDetector({ initialText = "", onAnalysisComplete }: AIContentDetectorProps) {
  const [text, setText] = useState(initialText)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<AIAnalysisResult | null>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Mock analysis function - in a real implementation, this would call an API
  const analyzeText = async (content: string): Promise<AIAnalysisResult> => {
    setIsAnalyzing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // This is a simplified mock implementation
    // In a real app, this would call a backend service with NLP capabilities

    // Split text into sentences for granular analysis
    const sentences = content.split(/(?<=[.!?])\s+/)

    // Patterns that might indicate AI-generated text
    const patterns = [
      {
        name: "Repetitive phrasing",
        description: "Repeated sentence structures or transition phrases",
        frequency: Math.random() * 0.8,
      },
      {
        name: "Unnatural fluency",
        description: "Text flows too perfectly without natural human inconsistencies",
        frequency: Math.random() * 0.9,
      },
      {
        name: "Lack of personal tone",
        description: "Missing personal anecdotes or unique voice",
        frequency: Math.random() * 0.7,
      },
      {
        name: "Generic examples",
        description: "Examples that lack specificity or real-world details",
        frequency: Math.random() * 0.6,
      },
      {
        name: "Overly formal language",
        description: "Consistently formal tone without casual elements",
        frequency: Math.random() * 0.5,
      },
    ].sort((a, b) => b.frequency - a.frequency)

    // For demo purposes, we'll randomly assign AI probability to each sentence
    // In a real implementation, this would use sophisticated NLP models
    const highlightedText = sentences.map((sentence) => {
      const isLongSentence = sentence.length > 100
      const hasComplexStructure = sentence.includes(",") && sentence.length > 80
      const aiConfidence = Math.random() * (isLongSentence || hasComplexStructure ? 0.9 : 0.6)

      return {
        text: sentence,
        isAI: aiConfidence > 0.5,
        confidence: aiConfidence,
      }
    })

    // Calculate overall percentages
    const aiSentences = highlightedText.filter((item) => item.isAI)
    const aiPercentage = Math.round((aiSentences.length / highlightedText.length) * 100)
    const humanPercentage = 100 - aiPercentage

    // Overall confidence score
    const confidenceScore = Math.round(
      (highlightedText.reduce((sum, item) => sum + item.confidence, 0) / highlightedText.length) * 100,
    )

    const result = {
      aiPercentage,
      humanPercentage,
      confidenceScore,
      highlightedText,
      patterns,
    }

    setIsAnalyzing(false)
    return result
  }

  const handleAnalyze = async () => {
    if (!text.trim()) return

    const analysisResults = await analyzeText(text)
    setResults(analysisResults)

    if (onAnalysisComplete) {
      onAnalysisComplete(analysisResults)
    }
  }

  useEffect(() => {
    if (initialText && !results) {
      setText(initialText)
    }
  }, [initialText, results])

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="h-5 w-5 text-yellow-500" />
          AI Content Detector
        </CardTitle>
        <CardDescription>Analyze text to determine if it was written by AI or a human</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="analysis" disabled={!results}>
              Analysis
            </TabsTrigger>
            <TabsTrigger value="highlighted" disabled={!results}>
              Highlighted Text
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-4">
            <Textarea
              ref={textareaRef}
              placeholder="Paste text to analyze for AI content detection..."
              className="min-h-[200px] font-mono text-sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <Button onClick={handleAnalyze} disabled={isAnalyzing || !text.trim()} className="w-full">
              {isAnalyzing ? "Analyzing..." : "Analyze Text"}
            </Button>
          </TabsContent>

          <TabsContent value="analysis" className="space-y-6">
            {results && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">AI-Generated</span>
                      <span className="text-sm font-medium">{results.aiPercentage}%</span>
                    </div>
                    <Progress
                      value={results.aiPercentage}
                      className="h-2 bg-gray-200"
                      indicatorClassName="bg-yellow-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Human-Written</span>
                      <span className="text-sm font-medium">{results.humanPercentage}%</span>
                    </div>
                    <Progress
                      value={results.humanPercentage}
                      className="h-2 bg-gray-200"
                      indicatorClassName="bg-green-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Confidence Score</span>
                    <span className="text-sm font-medium">{results.confidenceScore}%</span>
                  </div>
                  <Progress
                    value={results.confidenceScore}
                    className="h-2 bg-gray-200"
                    indicatorClassName={cn(
                      results.confidenceScore > 80
                        ? "bg-green-500"
                        : results.confidenceScore > 50
                          ? "bg-yellow-500"
                          : "bg-red-500",
                    )}
                  />
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-medium">AI Indicators Detected</h4>
                  <div className="space-y-2">
                    {results.patterns.map((pattern, index) => (
                      <div key={index} className="flex items-start gap-2 rounded-md border p-3">
                        <Info className="h-5 w-5 text-blue-500 mt-0.5" />
                        <div>
                          <h5 className="font-medium">{pattern.name}</h5>
                          <p className="text-sm text-muted-foreground">{pattern.description}</p>
                          <div className="mt-1">
                            <Progress
                              value={pattern.frequency * 100}
                              className="h-1.5 bg-gray-200"
                              indicatorClassName="bg-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="highlighted" className="space-y-4">
            {results && (
              <div className="rounded-md border p-4 space-y-2">
                <div className="flex items-center gap-2 mb-4">
                  <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
                    AI-Generated
                  </Badge>
                  <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
                    Human-Written
                  </Badge>
                </div>

                <div className="space-y-1 text-sm">
                  {results.highlightedText.map((item, index) => (
                    <span key={index} className={cn("inline", item.isAI ? "bg-yellow-100 text-yellow-900" : "")}>
                      {item.text}{" "}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        <div className="flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
          <p>
            This analysis is for educational purposes only. AI detection is not 100% accurate and should not be used as
            the sole basis for academic or professional decisions.
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
