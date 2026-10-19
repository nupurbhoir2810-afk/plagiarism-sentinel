"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Link2, ExternalLink, Info, Copy, Download, Fingerprint, BookOpen } from "lucide-react"

interface AdvancedComparisonProps {
  originalText: string
  matchedText: string
  similarity: number
  source: {
    title: string
    author: string
    url: string
    publishDate: string
    credibility: number
  }
  matchDetails: {
    type: "direct" | "paraphrased" | "semantic"
    confidence: number
    context: string
    startIndex: number
    endIndex: number
  }[]
}

export default function AdvancedComparison({
  originalText,
  matchedText,
  similarity,
  source,
  matchDetails,
}: AdvancedComparisonProps) {
  const [selectedMatch, setSelectedMatch] = useState<number | null>(null)
  const [highlightedOriginal, setHighlightedOriginal] = useState(originalText)
  const [highlightedMatched, setHighlightedMatched] = useState(matchedText)

  useEffect(() => {
    // Highlight the matched text in both original and matched content
    if (selectedMatch !== null && matchDetails[selectedMatch]) {
      const match = matchDetails[selectedMatch]

      // Highlight in original text
      const beforeMatch = originalText.substring(0, match.startIndex)
      const matchedPortion = originalText.substring(match.startIndex, match.endIndex)
      const afterMatch = originalText.substring(match.endIndex)

      setHighlightedOriginal(
        `${beforeMatch}<span class="bg-yellow-200 dark:bg-yellow-900">${matchedPortion}</span>${afterMatch}`,
      )

      // Find and highlight similar portion in matched text
      // This is a simplified approach - in a real implementation, you would use more sophisticated matching
      const matchIndex = matchedText.indexOf(match.context)
      if (matchIndex >= 0) {
        const beforeMatchedPortion = matchedText.substring(0, matchIndex)
        const matchedContextPortion = matchedText.substring(matchIndex, matchIndex + match.context.length)
        const afterMatchedPortion = matchedText.substring(matchIndex + match.context.length)

        setHighlightedMatched(
          `${beforeMatchedPortion}<span class="bg-yellow-200 dark:bg-yellow-900">${matchedContextPortion}</span>${afterMatchedPortion}`,
        )
      }
    } else {
      setHighlightedOriginal(originalText)
      setHighlightedMatched(matchedText)
    }
  }, [selectedMatch, originalText, matchedText, matchDetails])

  const getMatchTypeLabel = (type: string) => {
    switch (type) {
      case "direct":
        return <Badge variant="destructive">Direct Copy</Badge>
      case "paraphrased":
        return <Badge variant="warning">Paraphrased</Badge>
      case "semantic":
        return <Badge variant="secondary">Semantic Match</Badge>
      default:
        return <Badge>Unknown</Badge>
    }
  }

  const getSimilarityColor = (value: number) => {
    if (value >= 75) return "text-red-500"
    if (value >= 50) return "text-yellow-500"
    return "text-green-500"
  }

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Detailed Comparison</span>
          <Badge variant={similarity > 50 ? "destructive" : "outline"}>{similarity}% Similar</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="side-by-side" className="space-y-4">
          <TabsList>
            <TabsTrigger value="side-by-side">Side by Side</TabsTrigger>
            <TabsTrigger value="matches">Match Details</TabsTrigger>
            <TabsTrigger value="source">Source Info</TabsTrigger>
          </TabsList>

          <TabsContent value="side-by-side" className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Your Document</h3>
                  <Button variant="ghost" size="sm">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
                <div className="border rounded-md p-4 h-[400px] overflow-auto">
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: highlightedOriginal }}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-medium">Matched Source</h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{source.title}</Badge>
                    <Button variant="ghost" size="sm">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <div className="border rounded-md p-4 h-[400px] overflow-auto">
                  <div
                    className="prose dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: highlightedMatched }}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Download Comparison
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="matches" className="space-y-4">
            <ScrollArea className="h-[400px]">
              <div className="space-y-4">
                {matchDetails.map((match, index) => (
                  <Card
                    key={index}
                    className={`cursor-pointer ${selectedMatch === index ? "border-primary" : ""}`}
                    onClick={() => setSelectedMatch(index)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {getMatchTypeLabel(match.type)}
                          <span className={`text-sm font-medium ${getSimilarityColor(match.confidence)}`}>
                            {match.confidence}% Confidence
                          </span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => setSelectedMatch(index)}>
                          <Info className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="space-y-2">
                        <div>
                          <p className="text-sm font-medium">Context:</p>
                          <p className="text-sm bg-muted p-2 rounded-md">{match.context}</p>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Link2 className="h-4 w-4" />
                          <span>Found in {source.title}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="source" className="space-y-4">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <BookOpen className="h-12 w-12 text-primary" />
                <div>
                  <h3 className="text-xl font-bold">{source.title}</h3>
                  <p className="text-sm text-muted-foreground">by {source.author}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Publication Date:</span>
                    <span className="text-sm font-medium">{source.publishDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">URL:</span>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                    >
                      Visit Source <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Source Credibility:</span>
                      <span className="text-sm font-medium">{source.credibility}%</span>
                    </div>
                    <Progress value={source.credibility} className="h-2 mt-1" />
                  </div>

                  <div className="flex items-center gap-2 mt-4">
                    <Fingerprint className="h-4 w-4 text-primary" />
                    <span className="text-sm">Verified Academic Source</span>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4 mt-4">
                <h4 className="text-sm font-medium mb-2">Citation Formats:</h4>
                <div className="space-y-2">
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">APA:</p>
                    <p className="text-sm">
                      {source.author} ({new Date(source.publishDate).getFullYear()}). {source.title}. Retrieved from{" "}
                      {source.url}
                    </p>
                  </div>
                  <div className="p-2 bg-muted rounded-md">
                    <p className="text-sm font-medium">MLA:</p>
                    <p className="text-sm">
                      {source.author}. "{source.title}." Web. {new Date(source.publishDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
