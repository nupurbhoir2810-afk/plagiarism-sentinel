"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BookOpen, RefreshCw, Copy, Download, Sparkles } from "lucide-react"
import { toast } from "sonner"
import AnimatedBackground from "@/components/animated-background"

export default function StoryGenerator() {
  const [prompt, setPrompt] = useState("")
  const [genre, setGenre] = useState("fantasy")
  const [tone, setTone] = useState("adventurous")
  const [length, setLength] = useState("medium")
  const [characters, setCharacters] = useState("")
  const [setting, setSetting] = useState("")
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState("")
  const [story, setStory] = useState("")

  const genres = [
    { value: "fantasy", label: "Fantasy" },
    { value: "science-fiction", label: "Science Fiction" },
    { value: "mystery", label: "Mystery" },
    { value: "romance", label: "Romance" },
    { value: "horror", label: "Horror" },
    { value: "adventure", label: "Adventure" },
    { value: "historical", label: "Historical" },
    { value: "fairy-tale", label: "Fairy Tale" },
  ]

  const tones = [
    { value: "adventurous", label: "Adventurous" },
    { value: "humorous", label: "Humorous" },
    { value: "dark", label: "Dark" },
    { value: "inspirational", label: "Inspirational" },
    { value: "mysterious", label: "Mysterious" },
    { value: "romantic", label: "Romantic" },
    { value: "suspenseful", label: "Suspenseful" },
    { value: "whimsical", label: "Whimsical" },
  ]

  const lengths = [
    { value: "short", label: "Short (500 words)" },
    { value: "medium", label: "Medium (1000 words)" },
    { value: "long", label: "Long (1500 words)" },
  ]

  const generateStory = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a story prompt")
      return
    }

    setLoading(true)
    setProgress(0)

    try {
      // Simulate story generation with multiple stages
      const stages = [
        { name: "Analyzing prompt...", duration: 1000 },
        { name: "Developing characters...", duration: 1200 },
        { name: "Creating setting...", duration: 1100 },
        { name: "Building plot structure...", duration: 1300 },
        { name: "Crafting narrative...", duration: 1500 },
        { name: "Adding descriptive elements...", duration: 1200 },
        { name: "Refining dialogue...", duration: 1100 },
        { name: "Polishing story...", duration: 1000 },
      ]

      for (let i = 0; i < stages.length; i++) {
        setCurrentStage(stages[i].name)
        setProgress(((i + 1) / stages.length) * 100)
        await new Promise((resolve) => setTimeout(resolve, stages[i].duration))
      }

      // Generate mock story based on inputs
      const generatedStory = generateMockStory(prompt, genre, tone, characters, setting, length)
      setStory(generatedStory)

      toast.success("Story generated successfully!")
    } catch (error) {
      toast.error("Failed to generate story")
    } finally {
      setLoading(false)
    }
  }

  const generateMockStory = (
    prompt: string,
    genre: string,
    tone: string,
    characters: string,
    setting: string,
    length: string,
  ): string => {
    // Story intro based on genre
    const storyIntro = {
      fantasy: `In a realm where ${setting || "magic flows like water"}, ${characters || "our hero"} discovered a power that would change everything.`,
      "science-fiction": `Amidst the gleaming spires of ${setting || "a distant future"}, ${characters || "our protagonist"} uncovered a technology that defied imagination.`,
      mystery: `The quiet town of ${setting || "Shadowvale"} held its secrets close, until ${characters || "our detective"} began to unravel the threads of deception.`,
      romance: `Under the ${setting || "starlit sky"}, ${characters || "two souls"} found themselves drawn together by fate's invisible hand.`,
      horror: `Deep within ${setting || "the ancient mansion"}, ${characters || "our survivor"} first sensed the malevolent presence that would haunt their nightmares.`,
      adventure: `The call to adventure echoed through ${setting || "the distant lands"}, as ${characters || "our adventurer"} prepared for the journey of a lifetime.`,
      historical: `In the tumultuous era of ${setting || "ancient civilizations"}, ${characters || "our protagonist"} witnessed the turning point that would reshape history.`,
      "fairy-tale": `Once upon a time in ${setting || "a magical kingdom"}, ${characters || "a young hero"} embarked on a quest that would become legend.`,
    }

    // Tone modifiers
    const toneModifiers = {
      adventurous: "filled with daring exploits and bold decisions",
      humorous: "with an unexpected twist of humor",
      dark: "shrouded in shadows and uncertainty",
      inspirational: "filled with hope and determination",
      mysterious: "veiled in enigmatic circumstances",
      romantic: "touched by the gentle hand of love",
      suspenseful: "taut with tension and anticipation",
      whimsical: "dancing with whimsy and wonder",
    }

    const intro = storyIntro[genre as keyof typeof storyIntro] || storyIntro.fantasy
    const toneMod = toneModifiers[tone as keyof typeof toneModifiers] || ""

    // Generate story with appropriate length
    let story = `# ${prompt}\n\n${intro}\n\n`
    story += `The tale begins ${toneMod}, as ${prompt}\n\n`

    // Add character development
    story += `${characters ? `Our story follows ${characters}, ` : "The protagonist, "} whose journey would test not only their resolve but their very understanding of ${genre === "fantasy" ? "magic" : genre === "science-fiction" ? "reality" : "truth"} itself.\n\n`

    // Add setting description
    story += `In ${setting || "this wondrous place"}, every shadow held a secret, every whisper carried weight. The air itself seemed charged with possibility, as though the very fabric of existence anticipated the events about to unfold.\n\n`

    // Add middle section based on length
    if (length === "medium" || length === "long") {
      story += `As days turned to weeks, our hero's path grew more treacherous. Each step forward revealed new challenges, new allies, and new enemies. The journey was no longer just about reaching a destination, but about the transformation that occurs along the way.\n\n`

      story += `"We must continue," ${characters?.split(" ")[0] || "they"} said, voice steady despite the fear that threatened to overwhelm. "There is too much at stake to turn back now."\n\n`

      story += `The companions exchanged glances, each weighing the cost of proceeding against the price of retreat. In the end, there was only one choice that honor would allow.\n\n`
    }

    if (length === "long") {
      story += `The conflict came to a head beneath a sky torn by lightning. Ancient powers awakened, responding to the call that had echoed across the ages. This was the moment that legends would speak of for generations to come.\n\n`

      story += `"I never thought it would end like this," whispered one of the companions, eyes wide with wonder and terror.\n\n`

      story += `"This is not an ending," came the reply. "It is merely a new beginning."\n\n`

      story += `The world held its breath as choices were made that could never be unmade, as paths were chosen that could never be unchosen. In that suspended moment, destiny itself hung in the balance.\n\n`
    }

    // Add philosophical reflection
    story += `As our tale unfolds, we discover that sometimes the greatest adventures aren't about the destination, but about the transformations that occur along the way. Through trials and triumphs, through moments of doubt and flashes of brilliance, our story weaves a tapestry of experience that will forever change those who dare to dream.\n\n`

    // Add conclusion
    story += `The challenges that lay ahead would test not only strength and courage but also wisdom and compassion. For in this world, as in all others, the true measure of a hero lies not in their powers or abilities, but in the choices they make when faced with adversity.\n\n`

    story += `And so, with hearts full of determination and minds open to the possibilities that await, we begin our journey into a tale that will echo through the ages...`

    return story
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(story)
      toast.success("Story copied to clipboard!")
    } catch (error) {
      toast.error("Failed to copy story")
    }
  }

  const downloadStory = () => {
    try {
      const blob = new Blob([story], { type: "text/plain" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `story-${new Date().toISOString().slice(0, 10)}.txt`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Story downloaded!")
    } catch (error) {
      toast.error("Failed to download story")
    }
  }

  return (
    <>
      <AnimatedBackground variant="particles" intensity="light" color="#eab308" />
      <div className="container py-8">
        <div className="max-w-5xl mx-auto space-y-8">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Real-time Story Generator</h1>
            <p className="text-muted-foreground">Create engaging original narratives with AI-powered storytelling</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Story Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="prompt">Story Prompt</Label>
                <Textarea
                  id="prompt"
                  placeholder="Enter a brief description of your story idea..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  className="min-h-[100px]"
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="genre">Genre</Label>
                  <Select value={genre} onValueChange={setGenre}>
                    <SelectTrigger id="genre">
                      <SelectValue placeholder="Select genre" />
                    </SelectTrigger>
                    <SelectContent>
                      {genres.map((g) => (
                        <SelectItem key={g.value} value={g.value}>
                          {g.label}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="characters">Main Characters (Optional)</Label>
                <Input
                  id="characters"
                  placeholder="Describe the main characters..."
                  value={characters}
                  onChange={(e) => setCharacters(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="setting">Setting (Optional)</Label>
                <Input
                  id="setting"
                  placeholder="Describe the story setting..."
                  value={setting}
                  onChange={(e) => setSetting(e.target.value)}
                />
              </div>

              <Button onClick={generateStory} disabled={loading || !prompt.trim()} className="w-full">
                {loading ? (
                  <>
                    <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                    Generating Story...
                  </>
                ) : (
                  <>
                    <BookOpen className="mr-2 h-4 w-4" />
                    Generate Story
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {loading && (
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Sparkles className="h-8 w-8 text-primary animate-pulse" />
                    <div>
                      <h3 className="font-medium">Story Generation in Progress</h3>
                      <p className="text-sm text-muted-foreground">Please wait while we craft your story</p>
                    </div>
                  </div>

                  <Progress value={progress} />

                  <div className="flex justify-between text-sm">
                    <span>{currentStage}</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {story && !loading && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Your Generated Story</CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={copyToClipboard}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button variant="outline" size="sm" onClick={downloadStory}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">{story}</div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
