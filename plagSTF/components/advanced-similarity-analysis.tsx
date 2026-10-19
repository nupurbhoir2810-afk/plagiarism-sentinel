"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cosineSimilarity, jaccardSimilarity, tfIdfSimilarity } from "@/lib/similarity-algorithms"
import { SimilarityMatrix } from "@/components/audio-visualization"
import { Fingerprint, Percent, BarChart3, GitCompare, FileText, AlertTriangle } from "lucide-react"

interface AdvancedSimilarityAnalysisProps {
  text: string
  sourceTexts: Array<{
    id: number
    text: string
    source: string
    url: string
    credibility: number
    publicationDate: string
    author: string
    publisher: string
  }>
}

export function AdvancedSimilarityAnalysis({ text, sourceTexts }: AdvancedSimilarityAnalysisProps) {
  const [similarities, setSimilarities] = useState<
    Array<{
      sourceId: number
      source: string
      cosine: number
      jaccard: number
      tfidf: number
      overall: number
    }>
  >([])
  const [similarityMatrix, setSimilarityMatrix] = useState<number[][]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!text || !sourceTexts || sourceTexts.length === 0) return

    setLoading(true)

    // Simulate analysis delay
    const timer = setTimeout(() => {
      // Calculate similarities using different algorithms
      const results = sourceTexts.map((source) => {
        const cosine = cosineSimilarity(text, source.text)
        const jaccard = jaccardSimilarity(text, source.text)
        const tfidf = tfIdfSimilarity(
          text,
          source.text,
          sourceTexts.map((s) => s.text),
        )

        // Calculate overall similarity as weighted average
        const overall = cosine * 0.5 + jaccard * 0.3 + tfidf * 0.2

        return {
          sourceId: source.id,
          source: source.source,
          cosine,
          jaccard,
          tfidf,
          overall,
        }
      })

      // Sort by overall similarity (descending)
      results.sort((a, b) => b.overall - a.overall)

      setSimilarities(results)

      // Generate similarity matrix for visualization
      // In this case, we'll create a matrix of similarities between the input text and each source
      const matrix: number[][] = []

      // First row is similarities of input text to each source
      const firstRow = [1, ...results.map((r) => r.overall)]
      matrix.push(firstRow)

      // Add a row for each source text
      for (let i = 0; i < sourceTexts.length; i++) {
        const row = [results[i].overall]

        // Calculate similarities between this source and all other sources
        for (let j = 0; j < sourceTexts.length; j++) {
          if (i === j) {
            row.push(1) // Self-similarity is 1
          } else {
            const sim = cosineSimilarity(sourceTexts[i].text, sourceTexts[j].text)
            row.push(sim)
          }
        }

        matrix.push(row)
      }

      setSimilarityMatrix(matrix)
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [text, sourceTexts])

  const getSimilarityColor = (value: number) => {
    if (value >= 0.7) return "text-red-500"
    if (value >= 0.5) return "text-yellow-500"
    return "text-green-500"
  }

  const getSimilarityBadgeVariant = (value: number) => {
    if (value >= 0.7) return "destructive"
    if (value >= 0.5) return "warning"
    return "default"
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5" />
            Calculating Similarities...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <Fingerprint className="h-8 w-8 text-primary mb-4 animate-pulse" />
            <p className="text-center text-muted-foreground mb-4">
              Analyzing text using multiple similarity algorithms
            </p>
            <Progress value={65} className="w-full max-w-xs" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GitCompare className="h-5 w-5" />
          Advanced Similarity Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="overview">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="algorithms">Algorithms</TabsTrigger>
            <TabsTrigger value="matrix">Similarity Matrix</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={`rounded-full p-3 ${
                        similarities[0]?.overall >= 0.7
                          ? "bg-red-100 text-red-700"
                          : similarities[0]?.overall >= 0.5
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                      }`}
                    >
                      <Percent className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">Top Match</h3>
                    <div className="text-2xl font-bold">
                      {similarities[0] ? `${Math.round(similarities[0].overall * 100)}%` : "N/A"}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full p-3 bg-blue-100 text-blue-700">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">Sources Analyzed</h3>
                    <div className="text-2xl font-bold">{sourceTexts.length}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full p-3 bg-purple-100 text-purple-700">
                      <BarChart3 className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">Algorithms Used</h3>
                    <div className="text-2xl font-bold">3</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center gap-2">
                    <div className="rounded-full p-3 bg-amber-100 text-amber-700">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                    <h3 className="font-semibold">High Matches</h3>
                    <div className="text-2xl font-bold">{similarities.filter((s) => s.overall >= 0.7).length}</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {similarities.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-sm font-medium flex-1">{item.source}</p>
                    <Badge variant={getSimilarityBadgeVariant(item.overall)} className="shrink-0">
                      {Math.round(item.overall * 100)}%
                    </Badge>
                  </div>
                  <Progress value={item.overall * 100} />
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="algorithms" className="space-y-4 pt-4">
            <div className="space-y-6">
              {similarities.slice(0, 3).map((item, index) => (
                <div key={index} className="space-y-3">
                  <h3 className="font-medium">{item.source}</h3>

                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Cosine Similarity</span>
                      <span className={getSimilarityColor(item.cosine)}>{Math.round(item.cosine * 100)}%</span>
                    </div>
                    <Progress value={item.cosine * 100} />
                    <p className="text-xs text-muted-foreground mt-1">
                      Measures the cosine of the angle between text vectors in multi-dimensional space
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>Jaccard Similarity</span>
                      <span className={getSimilarityColor(item.jaccard)}>{Math.round(item.jaccard * 100)}%</span>
                    </div>
                    <Progress value={item.jaccard * 100} />
                    <p className="text-xs text-muted-foreground mt-1">
                      Measures similarity based on the intersection divided by the union of words
                    </p>
                  </div>

                  <div>
                    <div className="flex justify-between mb-1 text-sm">
                      <span>TF-IDF Similarity</span>
                      <span className={getSimilarityColor(item.tfidf)}>{Math.round(item.tfidf * 100)}%</span>
                    </div>
                    <Progress value={item.tfidf * 100} />
                    <p className="text-xs text-muted-foreground mt-1">
                      Considers term frequency and inverse document frequency for more accurate comparison
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="matrix" className="pt-4">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-full max-w-md aspect-square">
                <SimilarityMatrix matrix={similarityMatrix} colorMap="viridis" />
              </div>
              <div className="text-sm text-center text-muted-foreground">
                <p>Similarity matrix showing relationships between your text (top row) and source documents</p>
                <p className="text-xs mt-1">Brighter colors indicate higher similarity</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
