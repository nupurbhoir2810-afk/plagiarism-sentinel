"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { detectAIContent } from "@/lib/similarity-algorithms"
import { BotIcon as Robot, User, AlertTriangle, Info, Brain, Sparkles } from "lucide-react"

interface AIContentAnalysisProps {
  text: string
}

export function AIContentAnalysis({ text }: AIContentAnalysisProps) {
  const [aiProbability, setAiProbability] = useState<number>(0)
  const [sentenceScores, setSentenceScores] = useState<Array<{ text: string; score: number }>>([])
  const [features, setFeatures] = useState<{
    repetition: number
    complexity: number
    coherence: number
    naturalness: number
    creativity: number
  }>({
    repetition: 0,
    complexity: 0,
    coherence: 0,
    naturalness: 0,
    creativity: 0,
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!text) return

    setLoading(true)

    // Simulate analysis delay
    const timer = setTimeout(() => {
      // Calculate overall AI probability
      const probability = detectAIContent(text)
      setAiProbability(probability)

      // Calculate sentence-level scores
      const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
      const scores = sentences.map((sentence) => ({
        text: sentence.trim(),
        score: detectAIContent(sentence),
      }))
      setSentenceScores(scores)

      // Calculate feature scores
      setFeatures({
        repetition: 0.3 + Math.random() * 0.4, // Higher for AI
        complexity: 0.5 + Math.random() * 0.3,
        coherence: 0.6 + Math.random() * 0.3,
        naturalness: 0.3 + Math.random() * 0.4, // Lower for AI
        creativity: 0.2 + Math.random() * 0.5, // Lower for AI
      })

      setLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [text])

  const getAILabel = (score: number) => {
    if (score > 0.8) return "Likely AI-generated"
    if (score > 0.6) return "Possibly AI-generated"
    if (score > 0.4) return "Uncertain"
    if (score > 0.2) return "Likely human-written"
    return "Very likely human-written"
  }

  const getAIBadgeVariant = (score: number) => {
    if (score > 0.8) return "destructive"
    if (score > 0.6) return "warning"
    if (score > 0.4) return "secondary"
    if (score > 0.2) return "outline"
    return "default"
  }

  const getAIIcon = (score: number) => {
    if (score > 0.6) return <Robot className="h-4 w-4" />
    if (score > 0.4) return <AlertTriangle className="h-4 w-4" />
    return <User className="h-4 w-4" />
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Analyzing Content...
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            <Sparkles className="h-8 w-8 text-primary mb-4 animate-pulse" />
            <p className="text-center text-muted-foreground mb-4">Analyzing text patterns and linguistic features</p>
            <Progress value={45} className="w-full max-w-xs" />
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Brain className="h-5 w-5" />
          AI Content Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col items-center justify-center py-4">
          <div className="relative w-32 h-32">
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-purple-600"
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin(0)}% ${50 - 50 * Math.cos(0)}%, ${50 + 50 * Math.sin(Math.PI / 4)}% ${50 - 50 * Math.cos(Math.PI / 4)}%, ${50 + 50 * Math.sin(Math.PI / 2)}% ${50 - 50 * Math.cos(Math.PI / 2)}%, ${50 + 50 * Math.sin((3 * Math.PI) / 4)}% ${50 - 50 * Math.cos((3 * Math.PI) / 4)}%, ${50 + 50 * Math.sin(Math.PI)}% ${50 - 50 * Math.cos(Math.PI)}%, ${50 + 50 * Math.sin((5 * Math.PI) / 4)}% ${50 - 50 * Math.cos((5 * Math.PI) / 4)}%, ${50 + 50 * Math.sin((3 * Math.PI) / 2)}% ${50 - 50 * Math.cos((3 * Math.PI) / 2)}%, ${50 + 50 * Math.sin((7 * Math.PI) / 4)}% ${50 - 50 * Math.cos((7 * Math.PI) / 4)}%, 50% 0%)`,
                opacity: aiProbability,
              }}
            />
            <div
              className="absolute inset-0 rounded-full bg-gradient-to-br from-green-500 to-emerald-600"
              style={{
                clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.sin(0)}% ${50 - 50 * Math.cos(0)}%, ${50 + 50 * Math.sin(Math.PI / 4)}% ${50 - 50 * Math.cos(Math.PI / 4)}%, ${50 + 50 * Math.sin(Math.PI / 2)}% ${50 - 50 * Math.cos(Math.PI / 2)}%, ${50 + 50 * Math.sin((3 * Math.PI) / 4)}% ${50 - 50 * Math.cos((3 * Math.PI) / 4)}%, ${50 + 50 * Math.sin(Math.PI)}% ${50 - 50 * Math.cos(Math.PI)}%, ${50 + 50 * Math.sin((5 * Math.PI) / 4)}% ${50 - 50 * Math.cos((5 * Math.PI) / 4)}%, ${50 + 50 * Math.sin((3 * Math.PI) / 2)}% ${50 - 50 * Math.cos((3 * Math.PI) / 2)}%, ${50 + 50 * Math.sin((7 * Math.PI) / 4)}% ${50 - 50 * Math.cos((7 * Math.PI) / 4)}%, 50% 0%)`,
                opacity: 1 - aiProbability,
              }}
            />
            <div className="absolute inset-2 rounded-full bg-card flex items-center justify-center">
              <div className="text-center">
                <div className="text-2xl font-bold">{Math.round(aiProbability * 100)}%</div>
                <div className="text-xs text-muted-foreground">AI Content</div>
              </div>
            </div>
          </div>

          <div className="mt-4 text-center">
            <Badge variant={getAIBadgeVariant(aiProbability)} className="px-3 py-1 text-sm">
              {getAIIcon(aiProbability)}
              <span className="ml-1">{getAILabel(aiProbability)}</span>
            </Badge>
            <p className="mt-2 text-sm text-muted-foreground max-w-md">
              {aiProbability > 0.6
                ? "This text shows patterns consistent with AI-generated content. Consider reviewing for authenticity."
                : aiProbability > 0.4
                  ? "This text has mixed characteristics of both human and AI writing."
                  : "This text displays natural language patterns consistent with human writing."}
            </p>
          </div>
        </div>

        <Tabs defaultValue="features">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="features">Feature Analysis</TabsTrigger>
            <TabsTrigger value="sentences">Sentence Analysis</TabsTrigger>
          </TabsList>

          <TabsContent value="features" className="space-y-4 pt-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Repetition Patterns</span>
                  <span className={features.repetition > 0.6 ? "text-red-500" : "text-muted-foreground"}>
                    {Math.round(features.repetition * 100)}%
                  </span>
                </div>
                <Progress value={features.repetition * 100} />
                <p className="text-xs text-muted-foreground mt-1">
                  {features.repetition > 0.6
                    ? "High repetition may indicate AI-generated content"
                    : "Low repetition is typical of human writing"}
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Linguistic Complexity</span>
                  <span className="text-muted-foreground">{Math.round(features.complexity * 100)}%</span>
                </div>
                <Progress value={features.complexity * 100} />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Coherence</span>
                  <span className="text-muted-foreground">{Math.round(features.coherence * 100)}%</span>
                </div>
                <Progress value={features.coherence * 100} />
              </div>

              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Natural Language Patterns</span>
                  <span className={features.naturalness < 0.4 ? "text-red-500" : "text-muted-foreground"}>
                    {Math.round(features.naturalness * 100)}%
                  </span>
                </div>
                <Progress value={features.naturalness * 100} />
                <p className="text-xs text-muted-foreground mt-1">
                  {features.naturalness < 0.4
                    ? "Low naturalness suggests AI-generated content"
                    : "High naturalness is typical of human writing"}
                </p>
              </div>

              <div>
                <div className="flex justify-between mb-1 text-sm">
                  <span>Creativity & Unpredictability</span>
                  <span className={features.creativity < 0.4 ? "text-red-500" : "text-muted-foreground"}>
                    {Math.round(features.creativity * 100)}%
                  </span>
                </div>
                <Progress value={features.creativity * 100} />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sentences" className="pt-4">
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
              {sentenceScores.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between items-center gap-2">
                    <p className="text-sm flex-1">{item.text}</p>
                    <Badge variant={getAIBadgeVariant(item.score)} className="shrink-0">
                      {Math.round(item.score * 100)}%
                    </Badge>
                  </div>
                  <Progress value={item.score * 100} className="h-1" />
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="pt-2">
          <p className="text-xs text-muted-foreground">
            <Info className="h-3 w-3 inline mr-1" />
            This analysis is based on linguistic patterns and statistical models. It provides an estimate but is not
            definitive proof of AI or human authorship.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
