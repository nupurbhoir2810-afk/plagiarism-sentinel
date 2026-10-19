"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RefreshCcw, Wand2, Copy, Download } from "lucide-react"
import { toast } from "sonner"
import AnimatedBackground from "@/components/animated-background"

const styles = {
  academic: "Academic and formal",
  creative: "Creative and engaging",
  simple: "Simple and clear",
  professional: "Professional and business",
}

export default function ParaphrasingTool() {
  const [text, setText] = useState("")
  const [style, setStyle] = useState("academic")
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState<string[]>([])

  const handleParaphrase = async () => {
    if (!text.trim()) {
      toast.error("Please enter some text to paraphrase")
      return
    }

    setLoading(true)
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate different paraphrasing styles
      const paraphrased = generateParaphrased(text, style)
      setResults(paraphrased)
      toast.success("Text paraphrased successfully!")
    } catch (error) {
      toast.error("Failed to paraphrase text")
    } finally {
      setLoading(false)
    }
  }

  const generateParaphrased = (text: string, style: string): string[] => {
    // Enhanced paraphrasing logic
    const variations = []

    const academicWords = {
      show: "demonstrate",
      use: "utilize",
      think: "hypothesize",
      but: "however",
      also: "furthermore",
      first: "initially",
      find: "discover",
      many: "numerous",
      start: "commence",
      end: "conclude",
    }

    const creativeWords = {
      walk: "stroll",
      said: "exclaimed",
      happy: "overjoyed",
      sad: "melancholic",
      angry: "furious",
      big: "enormous",
      small: "tiny",
      good: "excellent",
      bad: "terrible",
    }

    const simpleWords = {
      utilize: "use",
      demonstrate: "show",
      hypothesize: "think",
      commence: "start",
      conclude: "end",
      numerous: "many",
      obtain: "get",
      purchase: "buy",
    }

    const professionalWords = {
      get: "acquire",
      make: "develop",
      help: "facilitate",
      fix: "resolve",
      start: "initiate",
      end: "finalize",
      use: "implement",
      look: "examine",
    }

    let wordMap: Record<string, string> = {}

    switch (style) {
      case "academic":
        wordMap = academicWords
        variations.push(
          text
            .split(" ")
            .map((word) => {
              const lowerWord = word.toLowerCase()
              return wordMap[lowerWord] || word
            })
            .join(" "),
        )
        variations.push(
          `Upon analysis, ${text.toLowerCase()}`
            .replace(/we can see/g, "it is evident that")
            .replace(/i think/g, "it can be hypothesized")
            .replace(/shows/g, "demonstrates"),
        )
        break

      case "creative":
        wordMap = creativeWords
        variations.push(
          text
            .split(" ")
            .map((word) => {
              const lowerWord = word.toLowerCase()
              return wordMap[lowerWord] || word
            })
            .join(" "),
        )
        variations.push(
          `Imagine this: ${text.toLowerCase()}`
            .replace(/very/g, "incredibly")
            .replace(/saw/g, "witnessed")
            .replace(/went/g, "ventured"),
        )
        break

      case "simple":
        wordMap = simpleWords
        variations.push(
          text
            .split(" ")
            .map((word) => {
              const lowerWord = word.toLowerCase()
              return wordMap[lowerWord] || word
            })
            .join(" "),
        )
        break

      case "professional":
        wordMap = professionalWords
        variations.push(
          text
            .split(" ")
            .map((word) => {
              const lowerWord = word.toLowerCase()
              return wordMap[lowerWord] || word
            })
            .join(" "),
        )
        variations.push(
          `In consideration of ${text.toLowerCase()}`
            .replace(/get/g, "acquire")
            .replace(/use/g, "implement")
            .replace(/make/g, "develop"),
        )
        break
    }

    return variations
  }

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast.success("Copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy text")
    }
  }

  const downloadText = (text: string) => {
    const blob = new Blob([text], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "paraphrased.txt"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <AnimatedBackground variant="gradient" intensity="light" color="#6366f1" />
      <div className="container py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">AI Paraphrasing Tool</h1>
            <p className="text-muted-foreground">Transform your text while maintaining its original meaning</p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Select value={style} onValueChange={setStyle}>
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select style" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(styles).map(([key, value]) => (
                        <SelectItem key={key} value={key}>
                          {value}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleParaphrase} disabled={loading || !text.trim()} className="ml-auto">
                    {loading ? (
                      <>
                        <RefreshCcw className="mr-2 h-4 w-4 animate-spin" />
                        Paraphrasing...
                      </>
                    ) : (
                      <>
                        <Wand2 className="mr-2 h-4 w-4" />
                        Paraphrase
                      </>
                    )}
                  </Button>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Original Text</label>
                    <Textarea
                      placeholder="Enter your text here..."
                      className="min-h-[300px] resize-none"
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                    />
                    <div className="text-sm text-muted-foreground">
                      {text.trim().split(/\s+/).filter(Boolean).length} words
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Paraphrased Text</label>
                    {loading ? (
                      <div className="border rounded-md p-4 min-h-[300px] flex items-center justify-center">
                        <div className="space-y-4 w-full max-w-xs">
                          <Progress value={45} />
                          <p className="text-sm text-center text-muted-foreground">
                            Analyzing and paraphrasing your text...
                          </p>
                        </div>
                      </div>
                    ) : results.length > 0 ? (
                      <Tabs defaultValue="0" className="min-h-[300px]">
                        <TabsList>
                          {results.map((_, i) => (
                            <TabsTrigger key={i} value={i.toString()}>
                              Version {i + 1}
                            </TabsTrigger>
                          ))}
                        </TabsList>
                        {results.map((result, i) => (
                          <TabsContent key={i} value={i.toString()}>
                            <div className="relative border rounded-md p-4 min-h-[300px]">
                              <div className="absolute top-2 right-2 flex gap-2">
                                <Button variant="ghost" size="icon" onClick={() => copyToClipboard(result)}>
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" onClick={() => downloadText(result)}>
                                  <Download className="h-4 w-4" />
                                </Button>
                              </div>
                              {result}
                            </div>
                          </TabsContent>
                        ))}
                      </Tabs>
                    ) : (
                      <div className="border rounded-md p-4 min-h-[300px] flex items-center justify-center text-muted-foreground">
                        Paraphrased text will appear here
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
