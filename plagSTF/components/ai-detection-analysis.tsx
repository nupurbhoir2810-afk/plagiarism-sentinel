"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { BotIcon as Robot, Brain, Info } from "lucide-react"

interface AIDetectionProps {
  text: string
}

export function AIDetectionAnalysis({ text }: AIDetectionProps) {
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)

  // Analyze the text for AI-generated content
  const analyzeText = async () => {
    if (!text || analyzing) return

    setAnalyzing(true)

    try {
      // Simulate analysis
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Generate mock results
      const aiScore = Math.floor(Math.random() * 100)
      const humanScore = 100 - aiScore

      const aiClassification =
        aiScore > 75 ? "AI-Generated" : aiScore > 40 ? "Potentially AI-Generated" : "Likely Human-Written"

      const patterns = [
        {
          name: "Repetitive Phrases",
          confidence: Math.floor(Math.random() * 100),
          examples: ["advanced technology", "cutting-edge solutions"],
        },
        {
          name: "Formulaic Structure",
          confidence: Math.floor(Math.random() * 100),
          examples: ["firstly... secondly... finally", "in conclusion"],
        },
        {
          name: "Unnatural Fluency",
          confidence: Math.floor(Math.random() * 100),
          examples: ["seamlessly integrates", "effortlessly combines"],
        },
        {
          name: "Generic Examples",
          confidence: Math.floor(Math.random() * 100),
          examples: ["for instance", "consider the following"],
        },
      ]

      setResults({
        aiScore,
        humanScore,
        aiClassification,
        patterns: patterns.sort((a, b) => b.confidence - a.confidence),
      })
    } catch (error) {
      console.error("Error analyzing text:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  // Analyze on component mount
  useState(() => {
    if (text) {
      analyzeText()
    }
  })

  if (!text) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Robot className="h-5 w-5 text-purple-500" />
          AI Content Detection
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analyzing ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <Brain className="h-5 w-5 text-purple-500 animate-pulse" />
              <div>
                <p className="font-medium">Analyzing content</p>
                <p className="text-sm text-muted-foreground">Detecting AI patterns and signatures</p>
              </div>
            </div>
            <Progress value={45} className="h-2" />
          </div>
        ) : results ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium text-lg">Classification</h3>
                <p className="text-sm text-muted-foreground">Based on linguistic patterns and structure</p>
              </div>
              <Badge
                variant={results.aiScore > 75 ? "destructive" : results.aiScore > 40 ? "warning" : "default"}
                className="text-sm py-1"
              >
                {results.aiClassification}
              </Badge>
            </div>

            <div>
              <h3 className="font-medium mb-3">Content Analysis</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>AI Probability</span>
                    <span
                      className={
                        results.aiScore > 75
                          ? "text-red-500"
                          : results.aiScore > 40
                            ? "text-yellow-500"
                            : "text-green-500"
                      }
                    >
                      {results.aiScore}%
                    </span>
                  </div>
                  <Progress value={results.aiScore} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Human Probability</span>
                    <span
                      className={
                        results.humanScore > 75
                          ? "text-green-500"
                          : results.humanScore > 40
                            ? "text-yellow-500"
                            : "text-red-500"
                      }
                    >
                      {results.humanScore}%
                    </span>
                  </div>
                  <Progress value={results.humanScore} className="h-2" />
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium mb-3">Detected Patterns</h3>
              <div className="space-y-3">
                {results.patterns.map((pattern: any, index: number) => (
                  <div key={index} className="p-3 bg-muted rounded-md">
                    <div className="flex justify-between mb-1">
                      <span className="font-medium">{pattern.name}</span>
                      <Badge variant="outline">{pattern.confidence}% Confidence</Badge>
                    </div>
                    {pattern.examples.length > 0 && (
                      <div className="text-sm text-muted-foreground">Examples: {pattern.examples.join(", ")}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
              <div className="flex gap-2">
                <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-300">About AI Detection</p>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    AI detection is not perfect and may produce false positives or negatives. This analysis should be
                    used as a guide, not a definitive assessment.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-center py-8">
            <p className="text-muted-foreground">No analysis available</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
