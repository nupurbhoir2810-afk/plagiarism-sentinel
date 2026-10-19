"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  PenTool,
  BookOpen,
  FileText,
  RefreshCw,
  Copy,
  Download,
  Sparkles,
  BookMarked,
  ListChecks,
  Lightbulb,
  Search,
  Clock,
  CheckCircle,
} from "lucide-react"
import { toast } from "sonner"

interface EssayGeneratorProps {
  onEssayGenerated?: (essay: string) => void
}

interface EssayOptions {
  topic: string
  type: string
  tone: string
  length: string
  includeReferences: boolean
  includeCitations: boolean
  includeOutline: boolean
  includeThesis: boolean
  includeCounterArguments: boolean
  includeConclusion: boolean
  academicLevel: string
  citationStyle: string
  keywords: string[]
}

interface EssayStructure {
  title: string
  thesis: string
  outline: {
    introduction: string[]
    mainPoints: {
      heading: string
      subpoints: string[]
    }[]
    conclusion: string[]
  }
  references: {
    title: string
    author: string
    year: number
    source: string
    url?: string
  }[]
}

export default function EssayGenerator({ onEssayGenerated }: EssayGeneratorProps) {
  const [options, setOptions] = useState<EssayOptions>({
    topic: "",
    type: "argumentative",
    tone: "academic",
    length: "medium",
    includeReferences: true,
    includeCitations: true,
    includeOutline: true,
    includeThesis: true,
    includeCounterArguments: true,
    includeConclusion: true,
    academicLevel: "undergraduate",
    citationStyle: "apa",
    keywords: [],
  })

  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState("")
  const [essay, setEssay] = useState("")
  const [essayStructure, setEssayStructure] = useState<EssayStructure | null>(null)
  const [keyword, setKeyword] = useState("")
  const [researchResults, setResearchResults] = useState<string[]>([])
  const [isResearching, setIsResearching] = useState(false)

  const essayTypes = [
    { value: "argumentative", label: "Argumentative" },
    { value: "expository", label: "Expository" },
    { value: "narrative", label: "Narrative" },
    { value: "descriptive", label: "Descriptive" },
    { value: "compare-contrast", label: "Compare & Contrast" },
    { value: "cause-effect", label: "Cause & Effect" },
    { value: "research", label: "Research Paper" },
    { value: "analytical", label: "Analytical" },
  ]

  const tones = [
    { value: "academic", label: "Academic" },
    { value: "persuasive", label: "Persuasive" },
    { value: "informative", label: "Informative" },
    { value: "critical", label: "Critical" },
    { value: "reflective", label: "Reflective" },
    { value: "conversational", label: "Conversational" },
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

  const addKeyword = () => {
    if (keyword.trim() && !options.keywords.includes(keyword.trim())) {
      setOptions({
        ...options,
        keywords: [...options.keywords, keyword.trim()],
      })
      setKeyword("")
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    setOptions({
      ...options,
      keywords: options.keywords.filter((k) => k !== keywordToRemove),
    })
  }

  const handleOptionChange = (key: keyof EssayOptions, value: any) => {
    setOptions({
      ...options,
      [key]: value,
    })
  }

  const researchTopic = async () => {
    if (!options.topic.trim()) {
      toast.error("Please enter a topic to research")
      return
    }

    setIsResearching(true)

    try {
      // Simulate API call for research
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Mock research results
      const mockResults = [
        `"${options.topic}" is a complex subject with multiple perspectives.`,
        `Recent studies have shown significant developments in the field of ${options.topic}.`,
        `According to Smith et al. (2022), ${options.topic} has implications for various sectors.`,
        `The historical context of ${options.topic} dates back to the early 20th century.`,
        `Critics argue that ${options.topic} presents challenges in implementation.`,
      ]

      setResearchResults(mockResults)
      toast.success("Research completed!")
    } catch (error) {
      toast.error("Failed to research topic")
    } finally {
      setIsResearching(false)
    }
  }

  const generateEssay = async () => {
    if (!options.topic.trim()) {
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

      // Generate mock essay structure
      const mockStructure: EssayStructure = {
        title: `The Impact of ${options.topic} on Modern Society`,
        thesis: `This essay argues that ${options.topic} has significantly transformed various aspects of society, leading to both positive advancements and challenging ethical considerations that must be addressed.`,
        outline: {
          introduction: [
            "Background information on the topic",
            "Context and relevance in today's world",
            "Thesis statement",
          ],
          mainPoints: [
            {
              heading: `Historical Development of ${options.topic}`,
              subpoints: [
                "Early origins and development",
                "Key milestones and breakthroughs",
                "Evolution to current state",
              ],
            },
            {
              heading: `Positive Impacts of ${options.topic}`,
              subpoints: [
                "Economic benefits and opportunities",
                "Social and cultural transformations",
                "Technological advancements",
              ],
            },
            {
              heading: `Challenges and Ethical Considerations`,
              subpoints: ["Potential risks and concerns", "Ethical dilemmas", "Regulatory frameworks"],
            },
            {
              heading: `Future Directions and Implications`,
              subpoints: ["Emerging trends", "Potential developments", "Long-term societal impact"],
            },
          ],
          conclusion: ["Summary of key arguments", "Restatement of thesis", "Final thoughts and broader implications"],
        },
        references: [
          {
            title: `Understanding ${options.topic}: A Comprehensive Analysis`,
            author: "Smith, J. & Johnson, A.",
            year: 2022,
            source: "Journal of Contemporary Studies",
            url: "https://example.com/journal",
          },
          {
            title: `The Evolution of ${options.topic} in the 21st Century`,
            author: "Williams, R.",
            year: 2021,
            source: "Oxford University Press",
            url: "https://example.com/book",
          },
          {
            title: `Ethical Implications of ${options.topic}`,
            author: "Garcia, M. et al.",
            year: 2023,
            source: "Ethics in Modern Society",
            url: "https://example.com/ethics",
          },
        ],
      }

      setEssayStructure(mockStructure)

      // Generate mock essay content based on structure and options
      const mockEssay = generateMockEssay(mockStructure, options)
      setEssay(mockEssay)

      if (onEssayGenerated) {
        onEssayGenerated(mockEssay)
      }

      toast.success("Essay generated successfully!")
    } catch (error) {
      toast.error("Failed to generate essay")
    } finally {
      setLoading(false)
    }
  }

  const generateMockEssay = (structure: EssayStructure, options: EssayOptions): string => {
    // This is a simplified mock essay generator
    // In a real implementation, this would use AI to generate coherent content

    const wordCount =
      options.length === "short" ? 500 : options.length === "medium" ? 1000 : options.length === "long" ? 1500 : 2000

    let essay = `# ${structure.title}\n\n`

    // Introduction
    essay += "## Introduction\n\n"
    essay += `${options.topic} has become increasingly relevant in today's rapidly evolving world. As societies continue to adapt to technological advancements and shifting paradigms, understanding the implications of ${options.topic} becomes crucial for navigating the complexities of modern life.\n\n`

    if (options.includeThesis) {
      essay += `**Thesis Statement:** ${structure.thesis}\n\n`
    }

    // Main body
    structure.outline.mainPoints.forEach((point) => {
      essay += `## ${point.heading}\n\n`

      // Generate paragraphs for each subpoint
      point.subpoints.forEach((subpoint) => {
        const paragraph = `${subpoint} presents a significant aspect of ${options.topic}. `

        // Add more sentences to flesh out the paragraph
        essay +=
          paragraph +
          `This dimension requires careful consideration as it influences various stakeholders and systems. `

        if (options.includeCitations) {
          const randomRef = structure.references[Math.floor(Math.random() * structure.references.length)]
          essay += `According to ${randomRef.author} (${randomRef.year}), this aspect has far-reaching implications for future developments. `
        }

        essay += `Further analysis reveals complex interactions between different factors that shape outcomes and experiences.\n\n`
      })

      if (options.includeCounterArguments && point.heading.includes("Challenges")) {
        essay += `### Counter Arguments\n\n`
        essay += `Critics argue that ${options.topic} may not be as impactful as proponents suggest. Some skeptics point to limitations in current methodologies and potential biases in existing research. However, these criticisms often fail to account for the broader context and cumulative evidence supporting the significance of ${options.topic}.\n\n`
      }
    })

    // Conclusion
    if (options.includeConclusion) {
      essay += "## Conclusion\n\n"
      essay += `In conclusion, ${options.topic} represents a critical area of study with profound implications for various aspects of society. This essay has explored the historical development, positive impacts, challenges, and future directions related to ${options.topic}. As demonstrated throughout this analysis, the complex nature of this subject requires nuanced understanding and continued research to fully grasp its significance and potential.\n\n`
    }

    // References
    if (options.includeReferences) {
      essay += "## References\n\n"

      structure.references.forEach((ref) => {
        if (options.citationStyle === "apa") {
          essay += `${ref.author} (${ref.year}). *${ref.title}*. ${ref.source}. ${ref.url ? ref.url : ""}\n\n`
        } else if (options.citationStyle === "mla") {
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
      a.download = `${options.topic.replace(/\s+/g, "-").toLowerCase()}-essay.txt`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Essay downloaded!")
    } catch (error) {
      toast.error("Failed to download essay")
    }
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="options" className="space-y-4">
        <TabsList>
          <TabsTrigger value="options">Essay Options</TabsTrigger>
          <TabsTrigger value="research">Research</TabsTrigger>
          <TabsTrigger value="structure">Structure</TabsTrigger>
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
                  value={options.topic}
                  onChange={(e) => handleOptionChange("topic", e.target.value)}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="type">Essay Type</Label>
                  <Select value={options.type} onValueChange={(value) => handleOptionChange("type", value)}>
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
                  <Select value={options.tone} onValueChange={(value) => handleOptionChange("tone", value)}>
                    <SelectTrigger id="tone">
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map((tone) => (
                        <SelectItem key={tone.value} value={tone.value}>
                          {tone.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="length">Length</Label>
                  <Select value={options.length} onValueChange={(value) => handleOptionChange("length", value)}>
                    <SelectTrigger id="length">
                      <SelectValue placeholder="Select length" />
                    </SelectTrigger>
                    <SelectContent>
                      {lengths.map((length) => (
                        <SelectItem key={length.value} value={length.value}>
                          {length.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="academicLevel">Academic Level</Label>
                  <Select
                    value={options.academicLevel}
                    onValueChange={(value) => handleOptionChange("academicLevel", value)}
                  >
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
                <Label htmlFor="keywords">Keywords (Optional)</Label>
                <div className="flex gap-2">
                  <Input
                    id="keywords"
                    placeholder="Add keywords"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault()
                        addKeyword()
                      }
                    }}
                  />
                  <Button type="button" onClick={addKeyword}>
                    Add
                  </Button>
                </div>
                {options.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {options.keywords.map((kw) => (
                      <Badge key={kw} variant="secondary" className="flex items-center gap-1">
                        {kw}
                        <button className="ml-1 rounded-full hover:bg-muted p-1" onClick={() => removeKeyword(kw)}>
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="citationStyle">Citation Style</Label>
                <Select
                  value={options.citationStyle}
                  onValueChange={(value) => handleOptionChange("citationStyle", value)}
                >
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
                    <Switch
                      id="includeThesis"
                      checked={options.includeThesis}
                      onCheckedChange={(checked) => handleOptionChange("includeThesis", checked)}
                    />
                    <Label htmlFor="includeThesis">Thesis Statement</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="includeOutline"
                      checked={options.includeOutline}
                      onCheckedChange={(checked) => handleOptionChange("includeOutline", checked)}
                    />
                    <Label htmlFor="includeOutline">Outline</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="includeCounterArguments"
                      checked={options.includeCounterArguments}
                      onCheckedChange={(checked) => handleOptionChange("includeCounterArguments", checked)}
                    />
                    <Label htmlFor="includeCounterArguments">Counter Arguments</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="includeConclusion"
                      checked={options.includeConclusion}
                      onCheckedChange={(checked) => handleOptionChange("includeConclusion", checked)}
                    />
                    <Label htmlFor="includeConclusion">Conclusion</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="includeReferences"
                      checked={options.includeReferences}
                      onCheckedChange={(checked) => handleOptionChange("includeReferences", checked)}
                    />
                    <Label htmlFor="includeReferences">References</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="includeCitations"
                      checked={options.includeCitations}
                      onCheckedChange={(checked) => handleOptionChange("includeCitations", checked)}
                    />
                    <Label htmlFor="includeCitations">In-text Citations</Label>
                  </div>
                </div>
              </div>

              <Button onClick={generateEssay} disabled={loading || !options.topic.trim()} className="w-full">
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

        <TabsContent value="research" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Research Assistant</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2">
                <Input
                  placeholder="Enter topic to research"
                  value={options.topic}
                  onChange={(e) => handleOptionChange("topic", e.target.value)}
                />
                <Button onClick={researchTopic} disabled={isResearching || !options.topic.trim()}>
                  {isResearching ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Researching...
                    </>
                  ) : (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Research
                    </>
                  )}
                </Button>
              </div>

              {isResearching ? (
                <div className="space-y-4 py-8 text-center">
                  <RefreshCw className="h-8 w-8 mx-auto animate-spin text-primary" />
                  <p className="text-muted-foreground">Researching topic...</p>
                </div>
              ) : researchResults.length > 0 ? (
                <div className="space-y-4">
                  <h3 className="text-sm font-medium">Research Findings</h3>
                  <ScrollArea className="h-[300px] rounded-md border p-4">
                    <div className="space-y-4">
                      {researchResults.map((result, index) => (
                        <div key={index} className="p-3 rounded-md bg-muted/50">
                          <p>{result}</p>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>

                  <div className="flex items-center justify-between">
                    <p className="text-sm text-muted-foreground">
                      <Clock className="inline-block mr-1 h-4 w-4" />
                      Last updated: {new Date().toLocaleTimeString()}
                    </p>
                    <Button variant="outline" size="sm">
                      <BookMarked className="mr-2 h-4 w-4" />
                      Save Research
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="py-8 text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Enter a topic and click Research to get started</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="structure" className="space-y-4">
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
              ) : essayStructure ? (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium">{essayStructure.title}</h3>
                    <div className="p-3 rounded-md bg-muted/50">
                      <p className="font-medium">Thesis Statement:</p>
                      <p>{essayStructure.thesis}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">Outline</h3>
                    <div className="space-y-4">
                      <div>
                        <p className="font-medium">Introduction</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {essayStructure.outline.introduction.map((point, index) => (
                            <li key={index} className="text-sm">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {essayStructure.outline.mainPoints.map((section, index) => (
                        <div key={index}>
                          <p className="font-medium">{section.heading}</p>
                          <ul className="list-disc pl-5 space-y-1">
                            {section.subpoints.map((point, idx) => (
                              <li key={idx} className="text-sm">
                                {point}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}

                      <div>
                        <p className="font-medium">Conclusion</p>
                        <ul className="list-disc pl-5 space-y-1">
                          {essayStructure.outline.conclusion.map((point, index) => (
                            <li key={index} className="text-sm">
                              {point}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-sm font-medium">References</h3>
                    <div className="space-y-2">
                      {essayStructure.references.map((ref, index) => (
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
                  <ListChecks className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
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
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">Generate an essay to preview it here</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                <div>
                  <h3 className="font-medium">AI Essay Generation in Progress</h3>
                  <p className="text-sm text-muted-foreground">Please wait while we craft your essay</p>
                </div>
              </div>

              <Progress value={progress} />

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{currentStage}</span>
                  <span>{Math.round(progress)}%</span>
                </div>

                <div className="flex items-start gap-2">
                  <Lightbulb className="h-4 w-4 mt-0.5 text-yellow-500" />
                  <p className="text-xs text-muted-foreground">
                    Our AI is analyzing your topic, researching relevant information, and crafting a well-structured
                    essay based on your specifications.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {essay && !loading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <p className="font-medium">Essay Generated Successfully</p>
              </div>
              <Badge variant="outline">
                {options.length === "short"
                  ? "~500"
                  : options.length === "medium"
                    ? "~1000"
                    : options.length === "long"
                      ? "~1500"
                      : "~2000+"}{" "}
                words
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
