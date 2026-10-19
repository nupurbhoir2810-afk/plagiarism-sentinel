"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, BarChart2, FileText, Fingerprint, SplitSquareVertical } from "lucide-react"
import { cn } from "@/lib/utils"

interface SimilarityAnalyzerProps {
  sourceText?: string
  suspectText?: string
  onAnalysisComplete?: (results: SimilarityAnalysisResult) => void
}

export interface SimilarityAnalysisResult {
  overallSimilarity: number
  sentenceSimilarity: {
    suspectSentence: string
    sourceSentence: string
    similarityScore: number
  }[]
  metrics: {
    lexicalSimilarity: number
    semanticSimilarity: number
    structuralSimilarity: number
    stylometricSimilarity: number
  }
  visualData: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
    }[]
  }
}

export function SimilarityAnalyzer({ sourceText = "", suspectText = "", onAnalysisComplete }: SimilarityAnalyzerProps) {
  const [source, setSource] = useState(sourceText)
  const [suspect, setSuspect] = useState(suspectText)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [results, setResults] = useState<SimilarityAnalysisResult | null>(null)

  // Mock analysis function - in a real implementation, this would call an API
  const analyzeSimilarity = async (
    sourceContent: string,
    suspectContent: string,
  ): Promise<SimilarityAnalysisResult> => {
    setIsAnalyzing(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // This is a simplified mock implementation
    // In a real app, this would call a similarity analysis API

    // Split texts into sentences
    const sourceSentences = sourceContent.split(/[.!?]+/).filter((s) => s.trim().length > 0)
    const suspectSentences = suspectContent.split(/[.!?]+/).filter((s) => s.trim().length > 0)

    // Calculate sentence-level similarity
    const sentenceSimilarity = suspectSentences.map((suspectSentence) => {
      // Find the most similar source sentence
      let bestMatch = { sourceSentence: "", similarityScore: 0 }

      sourceSentences.forEach((sourceSentence) => {
        // Simple word overlap similarity for demo purposes
        const sourceWords = new Set(sourceSentence.toLowerCase().split(/\s+/))
        const suspectWords = suspectSentence.toLowerCase().split(/\s+/)
        const commonWords = suspectWords.filter((word) => sourceWords.has(word)).length
        const similarityScore = commonWords / Math.max(suspectWords.length, 1)

        if (similarityScore > bestMatch.similarityScore) {
          bestMatch = {
            sourceSentence,
            similarityScore: Math.min(similarityScore, 0.95), // Cap at 0.95 for realism
          }
        }
      })

      return {
        suspectSentence,
        sourceSentence: bestMatch.sourceSentence,
        similarityScore: bestMatch.similarityScore,
      }
    })

    // Calculate different similarity metrics
    const lexicalSimilarity =
      Math.min(
        Math.random() * 0.3 + 0.4,
        sentenceSimilarity.reduce((sum, item) => sum + item.similarityScore, 0) /
          Math.max(sentenceSimilarity.length, 1),
      ) * 100

    const semanticSimilarity = Math.min(Math.random() * 0.3 + 0.5, lexicalSimilarity / 100 + Math.random() * 0.2) * 100

    const structuralSimilarity =
      Math.min(Math.random() * 0.4 + 0.3, (lexicalSimilarity + semanticSimilarity) / 200 + Math.random() * 0.1) * 100

    const stylometricSimilarity =
      Math.min(
        Math.random() * 0.5 + 0.2,
        (lexicalSimilarity + semanticSimilarity + structuralSimilarity) / 300 + Math.random() * 0.15,
      ) * 100

    // Calculate overall similarity as weighted average
    const overallSimilarity = Math.round(
      lexicalSimilarity * 0.3 + semanticSimilarity * 0.4 + structuralSimilarity * 0.2 + stylometricSimilarity * 0.1,
    )

    // Generate visual data for charts
    const visualData = {
      labels: ["Lexical", "Semantic", "Structural", "Stylometric"],
      datasets: [
        {
          label: "Similarity Score (%)",
          data: [
            Math.round(lexicalSimilarity),
            Math.round(semanticSimilarity),
            Math.round(structuralSimilarity),
            Math.round(stylometricSimilarity),
          ],
        },
      ],
    }

    const result = {
      overallSimilarity,
      sentenceSimilarity,
      metrics: {
        lexicalSimilarity: Math.round(lexicalSimilarity),
        semanticSimilarity: Math.round(semanticSimilarity),
        structuralSimilarity: Math.round(structuralSimilarity),
        stylometricSimilarity: Math.round(stylometricSimilarity),
      },
      visualData,
    }

    setIsAnalyzing(false)
    return result
  }

  const handleAnalyze = async () => {
    if (!source.trim() || !suspect.trim()) return

    const analysisResults = await analyzeSimilarity(source, suspect)
    setResults(analysisResults)

    if (onAnalysisComplete) {
      onAnalysisComplete(analysisResults)
    }
  }

  useEffect(() => {
    if (sourceText && !results) {
      setSource(sourceText)
    }
    if (suspectText && !results) {
      setSuspect(suspectText)
    }
  }, [sourceText, suspectText, results])

  const getSimilarityColor = (score: number) => {
    if (score < 30) return "text-green-500"
    if (score < 70) return "text-yellow-500"
    return "text-red-500"
  }

  const getSimilarityBg = (score: number) => {
    if (score < 30) return "bg-green-500"
    if (score < 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getSimilarityBadge = (score: number) => {
    if (score < 30) return "bg-green-100 text-green-800 hover:bg-green-100"
    if (score < 70) return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
    return "bg-red-100 text-red-800 hover:bg-red-100"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Fingerprint className="h-5 w-5 text-purple-500" />
          Similarity Analyzer
        </CardTitle>
        <CardDescription>Compare texts to determine similarity and potential plagiarism</CardDescription>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="input" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="input">Input</TabsTrigger>
            <TabsTrigger value="results" disabled={!results}>
              Results
            </TabsTrigger>
            <TabsTrigger value="metrics" disabled={!results}>
              Metrics
            </TabsTrigger>
            <TabsTrigger value="matches" disabled={!results}>
              Matches
            </TabsTrigger>
          </TabsList>

          <TabsContent value="input" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Source Text</label>
                <Textarea
                  placeholder="Paste original source text here..."
                  className="min-h-[200px] font-mono text-sm"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Suspect Text</label>
                <Textarea
                  placeholder="Paste text to check for similarity..."
                  className="min-h-[200px] font-mono text-sm"
                  value={suspect}
                  onChange={(e) => setSuspect(e.target.value)}
                />
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !source.trim() || !suspect.trim()}
              className="w-full"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Similarity"}
            </Button>
          </TabsContent>

          <TabsContent value="results" className="space-y-6">
            {results && (
              <>
                <div className="flex flex-col items-center justify-center p-6 border rounded-lg">
                  <h3 className="text-lg font-medium mb-2">Overall Similarity</h3>
                  <div className={`text-5xl font-bold ${getSimilarityColor(results.overallSimilarity)}`}>
                    {results.overallSimilarity}%
                  </div>
                  <Badge variant="outline" className={`mt-4 ${getSimilarityBadge(results.overallSimilarity)}`}>
                    {results.overallSimilarity < 30
                      ? "Low Similarity"
                      : results.overallSimilarity < 70
                        ? "Moderate Similarity"
                        : "High Similarity"}
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Similarity Score</span>
                    <span className="text-sm font-medium">{results.overallSimilarity}%</span>
                  </div>
                  <Progress
                    value={results.overallSimilarity}
                    className="h-2 bg-gray-200"
                    indicatorClassName={getSimilarityBg(results.overallSimilarity)}
                  />
                </div>

                <div className="rounded-md bg-blue-50 p-4 text-sm text-blue-800">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 mt-0.5" />
                    <div>
                      <p className="font-medium">Interpretation</p>
                      <p className="mt-1">
                        {results.overallSimilarity < 30
                          ? "The texts show low similarity. This suggests original content with minimal overlap."
                          : results.overallSimilarity < 70
                            ? "The texts show moderate similarity. Some passages may be paraphrased or share common elements."
                            : "The texts show high similarity. This suggests potential plagiarism or heavy borrowing."}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            {results && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(results.metrics).map(([key, value]) => {
                    // Format the key for display
                    const formattedKey = key
                      .replace(/([A-Z])/g, " $1")
                      .split(/(?=[A-Z])/)
                      .join(" ")
                      .toLowerCase()
                      .replace(/^\w/, (c) => c.toUpperCase())
                      .replace("Similarity", "")

                    return (
                      <div key={key} className="rounded-md border p-4">
                        <div className="text-sm text-muted-foreground">{formattedKey} Similarity</div>
                        <div className="text-2xl font-bold mt-1">{value}%</div>
                        <Progress
                          value={value}
                          className="h-2 bg-gray-200 mt-2"
                          indicatorClassName={cn(
                            value < 30 ? "bg-green-500" : value < 70 ? "bg-yellow-500" : "bg-red-500",
                          )}
                        />
                      </div>
                    )
                  })}
                </div>

                <div className="rounded-md bg-gray-50 p-4 text-sm">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <BarChart2 className="h-4 w-4" />
                    What these metrics mean:
                  </h4>
                  <ul className="space-y-2">
                    <li>
                      <span className="font-medium">Lexical Similarity:</span> Measures word-level overlap between texts
                    </li>
                    <li>
                      <span className="font-medium">Semantic Similarity:</span> Measures meaning-level similarity, even
                      when different words are used
                    </li>
                    <li>
                      <span className="font-medium">Structural Similarity:</span> Measures similarity in sentence
                      structure and organization
                    </li>
                    <li>
                      <span className="font-medium">Stylometric Similarity:</span> Measures similarity in writing style,
                      including sentence length and complexity
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="matches" className="space-y-4">
            {results && (
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Sentence-Level Matches</h3>

                <div className="space-y-4">
                  {results.sentenceSimilarity
                    .sort((a, b) => b.similarityScore - a.similarityScore)
                    .map((match, index) => (
                      <div key={index} className="rounded-md border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className={getSimilarityBadge(match.similarityScore * 100)}>
                            {Math.round(match.similarityScore * 100)}% Match
                          </Badge>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Suspect Text:</div>
                            <div className="text-sm p-2 bg-gray-50 rounded-md">{match.suspectSentence}</div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground">Source Text:</div>
                            <div className="text-sm p-2 bg-gray-50 rounded-md">{match.sourceSentence}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="flex items-center justify-center p-4">
                  <SplitSquareVertical className="h-5 w-5 text-muted-foreground mr-2" />
                  <span className="text-sm text-muted-foreground">
                    Showing {results.sentenceSimilarity.length} sentence comparisons
                  </span>
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>

      <CardFooter className="text-xs text-muted-foreground">
        <div className="flex items-start gap-2">
          <FileText className="h-4 w-4 text-purple-500 mt-0.5" />
          <p>
            This analysis uses multiple algorithms to detect similarity. Results should be reviewed by a human for final
            determination.
          </p>
        </div>
      </CardFooter>
    </Card>
  )
}
