"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BookOpen, CheckCircle, Info, Lightbulb, RefreshCw, Sparkles } from "lucide-react"

interface GrammarStyleAnalysisProps {
  text: string
}

export function GrammarStyleAnalysis({ text }: GrammarStyleAnalysisProps) {
  const [analyzing, setAnalyzing] = useState(false)
  const [results, setResults] = useState<any>(null)

  // Analyze the text for grammar and style issues
  const analyzeText = async () => {
    if (!text || analyzing) return

    setAnalyzing(true)

    try {
      // Simulate analysis
      await new Promise((resolve) => setTimeout(resolve, 2500))

      // Generate mock results
      const grammarScore = Math.floor(Math.random() * 30) + 70 // 70-100
      const readabilityScore = Math.floor(Math.random() * 30) + 70 // 70-100
      const styleScore = Math.floor(Math.random() * 30) + 70 // 70-100

      // Generate mock issues
      const issues = [
        {
          type: "grammar",
          severity: "high",
          text: "There is a subject-verb agreement error",
          suggestion: "Correct the verb to match the subject",
          context: "The team of researchers are working on the project",
          fix: "The team of researchers is working on the project",
        },
        {
          type: "spelling",
          severity: "medium",
          text: "This word is misspelled",
          suggestion: "Replace with the correct spelling",
          context: "The experiment yeilded interesting results",
          fix: "The experiment yielded interesting results",
        },
        {
          type: "punctuation",
          severity: "low",
          text: "Missing comma in a compound sentence",
          suggestion: "Add a comma before the coordinating conjunction",
          context: "The results were promising but more research is needed",
          fix: "The results were promising, but more research is needed",
        },
        {
          type: "style",
          severity: "medium",
          text: "Passive voice used",
          suggestion: "Consider using active voice for clarity",
          context: "The experiment was conducted by the researchers",
          fix: "The researchers conducted the experiment",
        },
        {
          type: "wordiness",
          severity: "low",
          text: "Wordy phrase",
          suggestion: "Use a more concise alternative",
          context: "In spite of the fact that",
          fix: "Although",
        },
      ]

      // Generate readability metrics
      const readabilityMetrics = {
        fleschKincaid: {
          score: Math.floor(Math.random() * 30) + 50, // 50-80
          grade: Math.floor(Math.random() * 6) + 8, // 8-14
          interpretation: "College level",
        },
        sentenceLength: {
          average: Math.floor(Math.random() * 10) + 15, // 15-25
          longest: Math.floor(Math.random() * 20) + 30, // 30-50
          recommendation: Math.floor(Math.random() * 10) + 15, // 15-25
        },
        wordChoice: {
          uniqueWords: Math.floor(Math.random() * 100) + 200, // 200-300
          complexWords: Math.floor(Math.random() * 30) + 20, // 20-50
          academicWords: Math.floor(Math.random() * 30) + 10, // 10-40
        },
      }

      // Generate style suggestions
      const styleSuggestions = [
        "Consider breaking up longer sentences for better readability",
        "Use more transition words to improve flow between paragraphs",
        "Vary sentence structure to make your writing more engaging",
        "Replace generic verbs with more specific ones",
        "Reduce adverb usage and opt for stronger verbs instead",
      ]

      setResults({
        grammarScore,
        readabilityScore,
        styleScore,
        issues: issues.sort((a, b) => {
          const severityOrder = { high: 0, medium: 1, low: 2 }
          return (
            severityOrder[a.severity as keyof typeof severityOrder] -
            severityOrder[b.severity as keyof typeof severityOrder]
          )
        }),
        readabilityMetrics,
        styleSuggestions,
        wordCount: text.split(/\s+/).filter(Boolean).length,
        sentenceCount: text.split(/[.!?]+/).filter(Boolean).length,
        paragraphCount: text.split(/\n\s*\n/).filter(Boolean).length,
      })
    } catch (error) {
      console.error("Error analyzing text:", error)
    } finally {
      setAnalyzing(false)
    }
  }

  // Analyze on component mount
  useEffect(() => {
    if (text) {
      analyzeText()
    }
  }, [text])

  if (!text) {
    return null
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-500 bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
      case "medium":
        return "text-amber-500 bg-amber-50 dark:bg-amber-950 border-amber-200 dark:border-amber-800"
      case "low":
        return "text-blue-500 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800"
      default:
        return "text-gray-500 bg-gray-50 dark:bg-gray-950 border-gray-200 dark:border-gray-800"
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-500"
    if (score >= 80) return "text-emerald-500"
    if (score >= 70) return "text-amber-500"
    return "text-red-500"
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-emerald-500" />
          Grammar & Style Analysis
        </CardTitle>
      </CardHeader>
      <CardContent>
        {analyzing ? (
          <div className="space-y-4 py-4">
            <div className="flex items-center gap-3">
              <RefreshCw className="h-5 w-5 text-emerald-500 animate-spin" />
              <div>
                <p className="font-medium">Analyzing writing</p>
                <p className="text-sm text-muted-foreground">Checking grammar, style, and readability</p>
              </div>
            </div>
            <Progress value={65} className="h-2" />
          </div>
        ) : results ? (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Grammar</span>
                  <span className={`text-sm font-medium ${getScoreColor(results.grammarScore)}`}>
                    {results.grammarScore}/100
                  </span>
                </div>
                <Progress value={results.grammarScore} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Readability</span>
                  <span className={`text-sm font-medium ${getScoreColor(results.readabilityScore)}`}>
                    {results.readabilityScore}/100
                  </span>
                </div>
                <Progress value={results.readabilityScore} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm">Style</span>
                  <span className={`text-sm font-medium ${getScoreColor(results.styleScore)}`}>
                    {results.styleScore}/100
                  </span>
                </div>
                <Progress value={results.styleScore} className="h-2" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center py-2 bg-muted/50 rounded-md">
              <div>
                <p className="text-2xl font-bold">{results.wordCount}</p>
                <p className="text-xs text-muted-foreground">Words</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{results.sentenceCount}</p>
                <p className="text-xs text-muted-foreground">Sentences</p>
              </div>
              <div>
                <p className="text-2xl font-bold">{results.paragraphCount}</p>
                <p className="text-xs text-muted-foreground">Paragraphs</p>
              </div>
            </div>

            <Tabs defaultValue="issues">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="issues" className="text-xs">
                  Issues
                </TabsTrigger>
                <TabsTrigger value="readability" className="text-xs">
                  Readability
                </TabsTrigger>
                <TabsTrigger value="suggestions" className="text-xs">
                  Suggestions
                </TabsTrigger>
              </TabsList>

              <TabsContent value="issues" className="mt-4">
                <ScrollArea className="h-[300px] pr-4">
                  <div className="space-y-3">
                    {results.issues.length > 0 ? (
                      results.issues.map((issue: any, index: number) => (
                        <div key={index} className={`p-3 rounded-md border ${getSeverityColor(issue.severity)}`}>
                          <div className="flex justify-between mb-1">
                            <span className="font-medium capitalize">{issue.type}</span>
                            <Badge variant="outline" className="capitalize">
                              {issue.severity}
                            </Badge>
                          </div>
                          <p className="text-sm mb-2">{issue.text}</p>
                          <div className="bg-background/80 p-2 rounded text-sm mb-2">
                            <p className="line-through">{issue.context}</p>
                            <p className="text-green-600 dark:text-green-400 mt-1">{issue.fix}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{issue.suggestion}</p>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center py-8">
                        <CheckCircle className="h-8 w-8 text-green-500 mb-2" />
                        <p className="text-muted-foreground">No issues found</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="readability" className="mt-4">
                <div className="space-y-4">
                  <div className="p-4 bg-muted rounded-md">
                    <div className="flex justify-between mb-2">
                      <h3 className="font-medium">Flesch-Kincaid Score</h3>
                      <Badge variant="outline">{results.readabilityMetrics.fleschKincaid.score}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Grade Level: {results.readabilityMetrics.fleschKincaid.grade}
                    </p>
                    <p className="text-sm">
                      Your text is written at a{" "}
                      <span className="font-medium">{results.readabilityMetrics.fleschKincaid.interpretation}</span>{" "}
                      reading level.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-md">
                      <h3 className="font-medium mb-2">Sentence Length</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Average</span>
                          <span>{results.readabilityMetrics.sentenceLength.average} words</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Longest</span>
                          <span>{results.readabilityMetrics.sentenceLength.longest} words</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Recommended</span>
                          <span>{results.readabilityMetrics.sentenceLength.recommendation} words</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-md">
                      <h3 className="font-medium mb-2">Word Choice</h3>
                      <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                          <span>Unique Words</span>
                          <span>{results.readabilityMetrics.wordChoice.uniqueWords}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Complex Words</span>
                          <span>{results.readabilityMetrics.wordChoice.complexWords}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Academic Words</span>
                          <span>{results.readabilityMetrics.wordChoice.academicWords}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-md border border-blue-200 dark:border-blue-800">
                    <div className="flex gap-2">
                      <Info className="h-5 w-5 text-blue-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm text-blue-700 dark:text-blue-400">
                          Readability scores help you understand how easy your text is to read. A lower grade level
                          means your text is more accessible to a wider audience.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="suggestions" className="mt-4">
                <div className="space-y-4">
                  <div className="space-y-3">
                    {results.styleSuggestions.map((suggestion: string, index: number) => (
                      <div key={index} className="p-3 bg-muted rounded-md flex gap-2">
                        <Lightbulb className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-sm">{suggestion}</p>
                      </div>
                    ))}
                  </div>

                  <div className="p-4 bg-green-50 dark:bg-green-950 rounded-md border border-green-200 dark:border-green-800">
                    <div className="flex gap-2">
                      <Sparkles className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-green-800 dark:text-green-300">Writing Strengths</p>
                        <ul className="text-sm text-green-700 dark:text-green-400 mt-1 space-y-1 list-disc list-inside">
                          <li>Good use of paragraph structure</li>
                          <li>Consistent tone throughout the document</li>
                          <li>Effective use of technical terminology</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
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
