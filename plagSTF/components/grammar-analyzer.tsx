"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { CheckCircle, Edit, FileText } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface GrammarAnalyzerProps {
  initialText?: string
  onAnalysisComplete?: (results: GrammarAnalysisResult) => void
}

export interface GrammarIssue {
  type: "spelling" | "grammar" | "style" | "clarity" | "punctuation"
  severity: "low" | "medium" | "high"
  text: string
  suggestion: string
  explanation: string
  startIndex: number
  endIndex: number
}

export interface GrammarAnalysisResult {
  score: number
  issues: GrammarIssue[]
  metrics: {
    readability: number
    clarity: number
    conciseness: number
    engagement: number
    correctness: number
  }
  statistics: {
    wordCount: number
    sentenceCount: number
    averageSentenceLength: number
    longSentences: number
    complexWords: number
    passiveVoice: number
  }
}

export function GrammarAnalyzer({ initialText = "", onAnalysisComplete }: GrammarAnalyzerProps) {
  const [text, setText] = useState(initialText)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<GrammarAnalysisResult | null>(null)

  // Mock analysis function - in a real implementation, this would call an API
  const analyzeGrammar = async (content: string): Promise<GrammarAnalysisResult> => {
    setIsAnalyzing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // This is a simplified mock implementation
    // In a real app, this would call a grammar checking API

    // Calculate basic text statistics
    const words = content.split(/\s+/).filter((word) => word.length > 0)
    const sentences = content.split(/[.!?]+/).filter((sentence) => sentence.trim().length > 0)
    const wordCount = words.length
    const sentenceCount = sentences.length
    const averageSentenceLength = wordCount / (sentenceCount || 1)

    // Generate mock issues
    const issueTypes: GrammarIssue["type"][] = ["spelling", "grammar", "style", "clarity", "punctuation"]
    const severityLevels: GrammarIssue["severity"][] = ["low", "medium", "high"]

    // Find some common words to highlight as issues
    const commonIssueWords = [
      {
        word: "very",
        type: "style",
        suggestion: "extremely",
        explanation: "Consider using a more specific intensifier",
      },
      {
        word: "good",
        type: "style",
        suggestion: "excellent",
        explanation: "Consider using a more descriptive adjective",
      },
      { word: "thing", type: "clarity", suggestion: "aspect", explanation: "Use a more specific noun" },
      { word: "a lot", type: "style", suggestion: "significantly", explanation: "Use a more precise quantifier" },
      {
        word: "nice",
        type: "style",
        suggestion: "appealing",
        explanation: "Consider using a more descriptive adjective",
      },
    ]

    const issues: GrammarIssue[] = []

    // Find actual instances of common issue words in the text
    commonIssueWords.forEach(({ word, type, suggestion, explanation }) => {
      const regex = new RegExp(`\\b${word}\\b`, "gi")
      let match

      while ((match = regex.exec(content)) !== null) {
        issues.push({
          type: type as GrammarIssue["type"],
          severity: severityLevels[Math.floor(Math.random() * severityLevels.length)],
          text: match[0],
          suggestion,
          explanation,
          startIndex: match.index,
          endIndex: match.index + match[0].length,
        })
      }
    })

    // Add some random punctuation and grammar issues
    if (content.includes(",")) {
      const commaIndex = content.indexOf(",")
      issues.push({
        type: "punctuation",
        severity: "low",
        text: content.substring(commaIndex - 5, commaIndex + 5),
        suggestion: "Consider revising this comma usage",
        explanation: "Check if this comma is necessary or if it should be replaced with a semicolon",
        startIndex: commaIndex - 5,
        endIndex: commaIndex + 5,
      })
    }

    // Calculate metrics
    const score = Math.min(100, Math.max(50, 100 - issues.length * 5))

    const metrics = {
      readability: Math.min(
        100,
        Math.max(50, 100 - (averageSentenceLength > 20 ? (averageSentenceLength - 20) * 2 : 0)),
      ),
      clarity: Math.min(100, Math.max(50, 100 - issues.filter((i) => i.type === "clarity").length * 10)),
      conciseness: Math.min(
        100,
        Math.max(50, 100 - (averageSentenceLength > 15 ? (averageSentenceLength - 15) * 3 : 0)),
      ),
      engagement: Math.min(100, Math.max(50, 75 + Math.random() * 20)),
      correctness: Math.min(100, Math.max(50, 100 - issues.length * 3)),
    }

    // Count long sentences and complex words
    const longSentences = sentences.filter((s) => s.split(/\s+/).length > 20).length
    const complexWords = words.filter((w) => w.length > 6).length

    // Estimate passive voice sentences
    const passiveVoiceEstimate = Math.floor(sentenceCount * 0.2)

    const result = {
      score,
      issues,
      metrics,
      statistics: {
        wordCount,
        sentenceCount,
        averageSentenceLength,
        longSentences,
        complexWords,
        passiveVoice: passiveVoiceEstimate,
      },
    }

    setIsAnalyzing(false)
    return result
  }

  const handleAnalyze = async () => {
    if (!text.trim()) return

    const analysisResults = await analyzeGrammar(text)
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

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 70) return "text-yellow-500"
    return "text-red-500"
  }

  const getScoreBg = (score: number) => {
    if (score >= 90) return "bg-green-500"
    if (score >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getSeverityColor = (severity: GrammarIssue["severity"]) => {
    switch (severity) {
      case "high":
        return "bg-red-100 text-red-800 hover:bg-red-100"
      case "medium":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
      case "low":
        return "bg-blue-100 text-blue-800 hover:bg-blue-100"
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Edit className="h-5 w-5 text-blue-500" />
          Grammar Analyzer
        </CardTitle>
        <CardDescription>Analyze text for grammar, style, and readability issues</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="issues" disabled={!results}>
              Issues
            </TabsTrigger>
            <TabsTrigger value="metrics" disabled={!results}>
              Metrics
            </TabsTrigger>
            <TabsTrigger value="statistics" disabled={!results}>
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-4">
            <Textarea
              placeholder="Paste text to analyze for grammar and style issues..."
              className="min-h-[200px] font-mono text-sm"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />

            <Button onClick={handleAnalyze} disabled={isAnalyzing || !text.trim()} className="w-full">
              {isAnalyzing ? "Analyzing..." : "Analyze Grammar"}
            </Button>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            {results && (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">Grammar Score</h3>
                  <div className={`text-2xl font-bold ${getScoreColor(results.score)}`}>{results.score}/100</div>
                </div>

                <Progress
                  value={results.score}
                  className="h-2 bg-gray-200"
                  indicatorClassName={getScoreBg(results.score)}
                />

                <div className="space-y-4 mt-6">
                  <h4 className="font-medium">Detected Issues ({results.issues.length})</h4>

                  {results.issues.length === 0 ? (
                    <div className="flex items-center gap-2 p-4 bg-green-50 rounded-md text-green-800">
                      <CheckCircle className="h-5 w-5" />
                      <span>No grammar or style issues detected!</span>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {results.issues.map((issue, index) => (
                        <div key={index} className="rounded-md border p-3 space-y-2">
                          <div className="flex items-center justify-between">
                            <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                              {issue.type.charAt(0).toUpperCase() + issue.type.slice(1)}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {issue.severity.charAt(0).toUpperCase() + issue.severity.slice(1)} severity
                            </span>
                          </div>

                          <div>
                            <div className="font-mono text-sm bg-gray-50 p-2 rounded-md">"{issue.text}"</div>

                            <div className="mt-2 space-y-1">
                              <div className="text-sm">
                                <span className="font-medium">Suggestion:</span> {issue.suggestion}
                              </div>
                              <div className="text-sm text-muted-foreground">{issue.explanation}</div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            {results && (
              <div className="space-y-4">
                {Object.entries(results.metrics).map(([key, value]) => (
                  <div key={key} className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">{key.charAt(0).toUpperCase() + key.slice(1)}</span>
                      <span className="text-sm font-medium">{value}/100</span>
                    </div>
                    <Progress
                      value={value}
                      className="h-2 bg-gray-200"
                      indicatorClassName={cn(value > 80 ? "bg-green-500" : value > 60 ? "bg-yellow-500" : "bg-red-500")}
                    />
                  </div>
                ))}

                <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
                  <h4 className="font-medium mb-2">What these metrics mean:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <span className="font-medium">Readability:</span> How easy the text is to read
                    </li>
                    <li>
                      <span className="font-medium">Clarity:</span> How clear and understandable the text is
                    </li>
                    <li>
                      <span className="font-medium">Conciseness:</span> How efficiently the text conveys information
                    </li>
                    <li>
                      <span className="font-medium">Engagement:</span> How engaging and interesting the text is
                    </li>
                    <li>
                      <span className="font-medium">Correctness:</span> How grammatically correct the text is
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="statistics" className="space-y-4">
            {results && (
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(results.statistics).map(([key, value]) => {
                  // Format the key for display
                  const formattedKey = key
                    .replace(/([A-Z])/g, " $1")
                    .split(/(?=[A-Z])/)
                    .join(" ")
                    .toLowerCase()
                    .replace(/^\w/, (c) => c.toUpperCase())

                  return (
                    <div key={key} className="rounded-md border p-4">
                      <div className="text-sm text-muted-foreground">{formattedKey}</div>
                      <div className="text-2xl font-bold mt-1">
                        {typeof value === "number" && key.includes("average") ? value.toFixed(1) : value}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-blue-500 mt-0.5" />
          <p>
            This analysis is based on common grammar and style rules. For professional editing, consider consulting a
            human editor.
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
