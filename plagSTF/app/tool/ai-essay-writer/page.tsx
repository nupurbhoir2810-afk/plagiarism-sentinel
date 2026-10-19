"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { PenTool, RefreshCw, Copy, Download, BookOpen } from "lucide-react"
import { toast } from "sonner"
import AnimatedBackground from "@/components/animated-background"

export default function AIEssayWriter() {
  const [topic, setTopic] = useState("")
  const [essayType, setEssayType] = useState("argumentative")
  const [tone, setTone] = useState("academic")
  const [length, setLength] = useState("medium")
  const [includeReferences, setIncludeReferences] = useState(true)
  const [includeCitations, setIncludeCitations] = useState(true)
  const [includeOutline, setIncludeOutline] = useState(true)
  const [academicLevel, setAcademicLevel] = useState("undergraduate")
  const [citationStyle, setCitationStyle] = useState("apa")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState("")
  const [essay, setEssay] = useState("")
  const [outline, setOutline] = useState<any>(null)

  const essayTypes = [
    { value: "argumentative", label: "Argumentative" },
    { value: "expository", label: "Expository" },
    { value: "narrative", label: "Narrative" },
    { value: "descriptive", label: "Descriptive" },
    { value: "compare-contrast", label: "Compare & Contrast" },
    { value: "cause-effect", label: "Cause & Effect" },
    { value: "research", label: "Research Paper" },
  ]

  const tones = [
    { value: "academic", label: "Academic" },
    { value: "persuasive", label: "Persuasive" },
    { value: "informative", label: "Informative" },
    { value: "critical", label: "Critical" },
    { value: "reflective", label: "Reflective" },
  ]

  const lengths = [
    { value: "short", label: "Short (500 words)" },
    { value: "medium", label: "Medium (1000 words)" },
    { value: "long", label: "Long (1500 words)" },
    { value: "extended", label: "Extended (2000+ words)" },
  ]

  const academicLevels = [
    { value: "high-school", label: "High School" },
    { value: "undergraduate", label: "Undergraduate" },
    { value: "graduate", label: "Graduate" },
    { value: "doctoral", label: "Doctoral" },
  ]

  const citationStyles = [
    { value: "apa", label: "APA" },
    { value: "mla", label: "MLA" },
    { value: "chicago", label: "Chicago" },
    { value: "harvard", label: "Harvard" },
  ]

  const generateEssay = async () => {
    if (!topic.trim()) {
      toast.error("Please enter an essay topic")
      return
    }

    setLoading(true)
    setProgress(0)

    try {
      // Simulate essay generation with multiple stages
      const stages = [
        { name: "Researching topic...", duration: 1500 },
        { name: "Analyzing key concepts...", duration: 1200 },
        { name: "Developing thesis statement...", duration: 1000 },
        { name: "Creating outline...", duration: 1300 },
        { name: "Drafting introduction...", duration: 1100 },
        { name: "Developing main arguments...", duration: 2000 },
        { name: "Incorporating evidence...", duration: 1400 },
        { name: "Addressing counter-arguments...", duration: 1200 },
        { name: "Crafting conclusion...", duration: 1000 },
        { name: "Adding citations...", duration: 800 },
        { name: "Finalizing essay...", duration: 1000 },
      ]

      for (let i = 0; i < stages.length; i++) {
        setCurrentStage(stages[i].name)
        setProgress(((i + 1) / stages.length) * 100)
        await new Promise((resolve) => setTimeout(resolve, stages[i].duration))
      }

      // Generate mock outline
      const mockOutline = {
        title: `The Impact of ${topic} on Modern Society`,
        thesis: `This essay argues that ${topic} has significantly transformed various aspects of society, leading to both positive advancements and challenging ethical considerations that must be addressed.`,
        sections: [
          {
            heading: "Introduction",
            points: [
              "Background information on the topic",
              "Context and relevance in today's world",
              "Thesis statement",
            ],
          },
          {
            heading: `Historical Development of ${topic}`,
            points: ["Early origins and development", "Key milestones and breakthroughs", "Evolution to current state"],
          },
          {
            heading: `Positive Impacts of ${topic}`,
            points: [
              "Economic benefits and opportunities",
              "Social and cultural transformations",
              "Technological advancements",
            ],
          },
          {
            heading: `Challenges and Ethical Considerations`,
            points: ["Potential risks and concerns", "Ethical dilemmas", "Regulatory frameworks"],
          },
          {
            heading: `Future Directions and Implications`,
            points: ["Emerging trends", "Potential developments", "Long-term societal impact"],
          },
          {
            heading: "Conclusion",
            points: ["Summary of key arguments", "Restatement of thesis", "Final thoughts and broader implications"],
          },
        ],
        references: [
          {
            author: "Smith, J. & Johnson, A.",
            year: 2022,
            title: `Understanding ${topic}: A Comprehensive Analysis`,
            source: "Journal of Contemporary Studies",
            url: "https://example.com/journal",
          },
          {
            author: "Williams, R.",
            year: 2021,
            title: `The Evolution of ${topic} in the 21st Century`,
            source: "Oxford University Press",
            url: "https://example.com/book",
          },
          {
            author: "Garcia, M. et al.",
            year: 2023,
            title: `Ethical Implications of ${topic}`,
            source: "Ethics in Modern Society",
            url: "https://example.com/ethics",
          },
        ],
      }

      setOutline(mockOutline)

      // Generate mock essay content
      const mockEssay = generateMockEssay(mockOutline, {
        type: essayType,
        tone,
        length,
        includeReferences,
        includeCitations,
        citationStyle,
      })

      setEssay(mockEssay)
      toast.success("Essay generated successfully!")
    } catch (error) {
      toast.error("Failed to generate essay")
    } finally {
      setLoading(false)
    }
  }

  const generateMockEssay = (outline: any, options: any): string => {
    // This is a simplified mock essay generator

    let essay = `# ${outline.title}\n\n`

    // Introduction
    essay += "## Introduction\n\n"
    essay += `${topic} has become increasingly relevant in today's rapidly evolving world. As societies continue to adapt to technological advancements and shifting paradigms, understanding the implications of ${topic} becomes crucial for navigating the complexities of modern life.\n\n`

    essay += `**Thesis Statement:** ${outline.thesis}\n\n`

    // Main body
    outline.sections.slice(1, -1).forEach((section: any) => {
      essay += `## ${section.heading}\n\n`

      // Generate paragraphs for each point
      section.points.forEach((point: string) => {
        const paragraph = `${point} presents a significant aspect of ${topic}. `

        // Add more sentences to flesh out the paragraph
        essay +=
          paragraph +
          `This dimension requires careful consideration as it influences various stakeholders and systems. `

        if (includeCitations) {
          const randomRef = outline.references[Math.floor(Math.random() * outline.references.length)]
          essay += `According to ${randomRef.author} (${randomRef.year}), this aspect has far-reaching implications for future developments. `
        }

        essay += `Further analysis reveals complex interactions between different factors that shape outcomes and experiences.\n\n`
      })
    })

    // Conclusion
    essay += "## Conclusion\n\n"
    essay += `In conclusion, ${topic} represents a critical area of study with profound implications for various aspects of society. This essay has explored the historical development, positive impacts, challenges, and future directions related to ${topic}. As demonstrated throughout this analysis, the complex nature of this subject requires nuanced understanding and continued research to fully grasp its significance and potential.\n\n`

    // References
    if (includeReferences) {
      essay += "## References\n\n"

      outline.references.forEach((ref: any) => {
        if (citationStyle === "apa") {
          essay += `${ref.author} (${ref.year}). *${ref.title}*. ${ref.source}. ${ref.url ? ref.url : ""}\n\n`
        } else if (citationStyle === "mla") {
          essay += `${ref.author}. "${ref.title}." *${ref.source}*, ${ref.year}. ${ref.url ? ref.url : ""}\n\n`
        } else {
          essay += `${ref.author}. (${ref.year}). ${ref.title}. *${ref.source}*. ${ref.url ? ref.url : ""}\n\n`
        }
      })
    }

    return essay
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(essay)
      toast.success("Essay copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy essay")
    }
  }

  const downloadEssay = () => {
    try {
      const blob = new Blob([essay], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${topic.replace(/\s+/g, "-").toLowerCase()}-essay.txt`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Essay downloaded!")
    } catch (error) {
      toast.error("Failed to download essay")
    }
  }

  return (
    <>
      <AnimatedBackground variant="grid" intensity="light" color="#ec4899" />
      <div className="container py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">AI Essay Writer</h1>
            <p className="text-muted-foreground">
              Generate well-structured essays on any topic with comprehensive information and evidence
            </p>
          </div>

          <Tabs defaultValue="options" className="space-y-4">
            <TabsList>
              <TabsTrigger value="options">Essay Options</TabsTrigger>
              <TabsTrigger value="outline">Outline</TabsTrigger>
              <TabsTrigger value="preview">Preview</TabsTrigger>
            </TabsList>

            <TabsContent value="options" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Essay Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="topic">Essay Topic</Label>
                    <Input
                      id="topic"
                      placeholder="Enter your essay topic"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="type">Essay Type</Label>
                      <Select value={essayType} onValueChange={setEssayType}>
                        <SelectTrigger id="type">
                          <SelectValue placeholder="Select essay type" />
                        </SelectTrigger>
                        <SelectContent>
                          {essayTypes.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tone">Tone</Label>
                      <Select value={tone} onValueChange={setTone}>
                        <SelectTrigger id="tone">
                          <SelectValue placeholder="Select tone" />
                        </SelectTrigger>
                        <SelectContent>
                          {tones.map((t) => (
                            <SelectItem key={t.value} value={t.value}>
                              {t.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="length">Length</Label>
                      <Select value={length} onValueChange={setLength}>
                        <SelectTrigger id="length">
                          <SelectValue placeholder="Select length" />
                        </SelectTrigger>
                        <SelectContent>
                          {lengths.map((l) => (
                            <SelectItem key={l.value} value={l.value}>
                              {l.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="academicLevel">Academic Level</Label>
                      <Select value={academicLevel} onValueChange={setAcademicLevel}>
                        <SelectTrigger id="academicLevel">
                          <SelectValue placeholder="Select academic level" />
                        </SelectTrigger>
                        <SelectContent>
                          {academicLevels.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="citationStyle">Citation Style</Label>
                    <Select value={citationStyle} onValueChange={setCitationStyle}>
                      <SelectTrigger id="citationStyle">
                        <SelectValue placeholder="Select citation style" />
                      </SelectTrigger>
                      <SelectContent>
                        {citationStyles.map((style) => (
                          <SelectItem key={style.value} value={style.value}>
                            {style.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-4 pt-2">
                    <h3 className="text-sm font-medium">Include Elements</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="includeOutline" checked={includeOutline} onCheckedChange={setIncludeOutline} />
                        <Label htmlFor="includeOutline">Outline</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="includeReferences"
                          checked={includeReferences}
                          onCheckedChange={setIncludeReferences}
                        />
                        <Label htmlFor="includeReferences">References</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="includeCitations"
                          checked={includeCitations}
                          onCheckedChange={setIncludeCitations}
                        />
                        <Label htmlFor="includeCitations">In-text Citations</Label>
                      </div>
                    </div>
                  </div>

                  <Button onClick={generateEssay} disabled={loading || !topic.trim()} className="w-full">
                    {loading ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Generating Essay...
                      </>
                    ) : (
                      <>
                        <PenTool className="mr-2 h-4 w-4" />
                        Generate Essay
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="outline" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Essay Structure</CardTitle>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      <Progress value={progress} />
                      <p className="text-center text-sm text-muted-foreground">{currentStage}</p>
                    </div>
                  ) : outline ? (
                    <div className="space-y-6">
                      <div className="space-y-2">
                        <h3 className="text-lg font-medium">{outline.title}</h3>
                        <div className="p-3 rounded-md bg-muted/50">
                          <p className="font-medium">Thesis Statement:</p>
                          <p>{outline.thesis}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Outline</h3>
                        <div className="space-y-4">
                          {outline.sections.map((section: any, index: number) => (
                            <div key={index}>
                              <p className="font-medium">{section.heading}</p>
                              <ul className="list-disc pl-5 space-y-1">
                                {section.points.map((point: string, idx: number) => (
                                  <li key={idx} className="text-sm">
                                    {point}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">References</h3>
                        <div className="space-y-2">
                          {outline.references.map((ref: any, index: number) => (
                            <div key={index} className="text-sm">
                              <p>
                                {ref.author} ({ref.year}). <em>{ref.title}</em>. {ref.source}.
                                {ref.url && (
                                  <a
                                    href={ref.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="ml-1 text-blue-500 hover:underline"
                                  >
                                    {ref.url}
                                  </a>
                                )}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Generate an essay to see its structure</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preview" className="space-y-4">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Essay Preview</CardTitle>
                    {essay && (
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={copyToClipboard}>
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button variant="outline" size="sm" onClick={downloadEssay}>
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {loading ? (
                    <div className="space-y-4">
                      <Progress value={progress} />
                      <div className="space-y-2">
                        <p className="text-center text-sm font-medium">{currentStage}</p>
                        <p className="text-center text-xs text-muted-foreground">{Math.round(progress)}% complete</p>
                      </div>
                    </div>
                  ) : essay ? (
                    <div className="prose dark:prose-invert max-w-none">
                      <div className="whitespace-pre-wrap">{essay}</div>
                    </div>
                  ) : (
                    <div className="py-8 text-center">
                      <PenTool className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                      <p className="text-muted-foreground">Generate an essay to preview it here</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
