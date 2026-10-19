"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Play,
  Pause,
  Volume2,
  Music,
  AudioWaveformIcon as Waveform,
  BarChart3,
  Hash,
  AlertTriangle,
  Download,
  Maximize,
} from "lucide-react"

interface AudioAnalyzerProps {
  audioUrl1: string
  audioUrl2: string
  onAnalysisComplete: (results: AudioAnalysisResult) => void
}

interface AudioAnalysisResult {
  overallSimilarity: number
  melodySimilarity: number
  rhythmSimilarity: number
  harmonySimilarity: number
  matchedSegments: {
    startTime1: number
    endTime1: number
    startTime2: number
    endTime2: number
    similarity: number
    type: "melody" | "rhythm" | "harmony"
  }[]
  spectrogram1: number[]
  spectrogram2: number[]
  tempo1: number
  tempo2: number
  key1: string
  key2: string
}

export default function AudioAnalyzer({ audioUrl1, audioUrl2, onAnalysisComplete }: AudioAnalyzerProps) {
  const [isPlaying1, setIsPlaying1] = useState(false)
  const [isPlaying2, setIsPlaying2] = useState(false)
  const [volume1, setVolume1] = useState(0.5)
  const [volume2, setVolume2] = useState(0.5)
  const [currentTime1, setCurrentTime1] = useState(0)
  const [currentTime2, setCurrentTime2] = useState(0)
  const [duration1, setDuration1] = useState(0)
  const [duration2, setDuration2] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStage, setCurrentStage] = useState("")
  const [analysisResult, setAnalysisResult] = useState<AudioAnalysisResult | null>(null)
  const [selectedSegment, setSelectedSegment] = useState<number | null>(null)
  const [showFullscreen, setShowFullscreen] = useState(false)

  const audio1Ref = useRef<HTMLAudioElement>(null)
  const audio2Ref = useRef<HTMLAudioElement>(null)
  const canvas1Ref = useRef<HTMLCanvasElement>(null)
  const canvas2Ref = useRef<HTMLCanvasElement>(null)

  // Initialize audio contexts and analyzers
  const audioContext1Ref = useRef<AudioContext | null>(null)
  const audioContext2Ref = useRef<AudioContext | null>(null)
  const analyzer1Ref = useRef<AnalyserNode | null>(null)
  const analyzer2Ref = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number>()

  useEffect(() => {
    // Initialize audio elements
    if (audio1Ref.current) {
      audio1Ref.current.src = audioUrl1
      audio1Ref.current.onloadedmetadata = () => {
        setDuration1(audio1Ref.current!.duration)
      }
      audio1Ref.current.ontimeupdate = () => {
        setCurrentTime1(audio1Ref.current!.currentTime)
      }
    }

    if (audio2Ref.current) {
      audio2Ref.current.src = audioUrl2
      audio2Ref.current.onloadedmetadata = () => {
        setDuration2(audio2Ref.current!.duration)
      }
      audio2Ref.current.ontimeupdate = () => {
        setCurrentTime2(audio2Ref.current!.currentTime)
      }
    }

    // Setup audio contexts and analyzers
    setupAudioAnalyzers()

    return () => {
      // Cleanup
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      audioContext1Ref.current?.close()
      audioContext2Ref.current?.close()
    }
  }, [audioUrl1, audioUrl2])

  const setupAudioAnalyzers = async () => {
    if (!audio1Ref.current || !audio2Ref.current) return

    try {
      // Create audio contexts
      audioContext1Ref.current = new AudioContext()
      audioContext2Ref.current = new AudioContext()

      // Create media element sources
      const source1 = audioContext1Ref.current.createMediaElementSource(audio1Ref.current)
      const source2 = audioContext2Ref.current.createMediaElementSource(audio2Ref.current)

      // Create analyzers
      analyzer1Ref.current = audioContext1Ref.current.createAnalyser()
      analyzer2Ref.current = audioContext2Ref.current.createAnalyser()

      // Set analyzer properties
      analyzer1Ref.current.fftSize = 2048
      analyzer2Ref.current.fftSize = 2048

      // Connect nodes
      source1.connect(analyzer1Ref.current)
      analyzer1Ref.current.connect(audioContext1Ref.current.destination)

      source2.connect(analyzer2Ref.current)
      analyzer2Ref.current.connect(audioContext2Ref.current.destination)

      // Start visualization
      visualize()
    } catch (error) {
      console.error("Error setting up audio analyzers:", error)
    }
  }

  const visualize = () => {
    if (!canvas1Ref.current || !canvas2Ref.current || !analyzer1Ref.current || !analyzer2Ref.current) return

    const ctx1 = canvas1Ref.current.getContext("2d")
    const ctx2 = canvas2Ref.current.getContext("2d")

    if (!ctx1 || !ctx2) return

    const bufferLength1 = analyzer1Ref.current.frequencyBinCount
    const bufferLength2 = analyzer2Ref.current.frequencyBinCount

    const dataArray1 = new Uint8Array(bufferLength1)
    const dataArray2 = new Uint8Array(bufferLength2)

    const width1 = canvas1Ref.current.width
    const width2 = canvas2Ref.current.width
    const height1 = canvas1Ref.current.height
    const height2 = canvas2Ref.current.height

    const draw = () => {
      animationFrameRef.current = requestAnimationFrame(draw)

      // Clear canvases
      ctx1.clearRect(0, 0, width1, height1)
      ctx2.clearRect(0, 0, width2, height2)

      // Get frequency data
      analyzer1Ref.current!.getByteFrequencyData(dataArray1)
      analyzer2Ref.current!.getByteFrequencyData(dataArray2)

      // Draw waveforms
      ctx1.fillStyle = "rgb(0, 0, 0)"
      ctx1.fillRect(0, 0, width1, height1)
      ctx2.fillStyle = "rgb(0, 0, 0)"
      ctx2.fillRect(0, 0, width2, height2)

      const barWidth1 = (width1 / bufferLength1) * 2.5
      const barWidth2 = (width2 / bufferLength2) * 2.5

      let x1 = 0
      let x2 = 0

      for (let i = 0; i < bufferLength1; i++) {
        const barHeight1 = dataArray1[i] / 2

        ctx1.fillStyle = `rgb(${barHeight1 + 100}, 50, 50)`
        ctx1.fillRect(x1, height1 - barHeight1, barWidth1, barHeight1)

        x1 += barWidth1 + 1
      }

      for (let i = 0; i < bufferLength2; i++) {
        const barHeight2 = dataArray2[i] / 2

        ctx2.fillStyle = `rgb(50, 50, ${barHeight2 + 100})`
        ctx2.fillRect(x2, height2 - barHeight2, barWidth2, barHeight2)

        x2 += barWidth2 + 1
      }
    }

    draw()
  }

  const togglePlayback = async (trackNum: number) => {
    const audioRef = trackNum === 1 ? audio1Ref.current : audio2Ref.current
    const setIsPlaying = trackNum === 1 ? setIsPlaying1 : setIsPlaying2
    const audioContext = trackNum === 1 ? audioContext1Ref.current : audioContext2Ref.current

    if (!audioRef || !audioContext) return

    try {
      if (audioRef.paused) {
        await audioContext.resume()
        await audioRef.play()
        setIsPlaying(true)
      } else {
        audioRef.pause()
        setIsPlaying(false)
      }
    } catch (error) {
      console.error("Playback error:", error)
    }
  }

  const handleVolumeChange = (value: number[], trackNum: number) => {
    const newVolume = value[0]
    if (trackNum === 1) {
      setVolume1(newVolume)
      if (audio1Ref.current) audio1Ref.current.volume = newVolume
    } else {
      setVolume2(newVolume)
      if (audio2Ref.current) audio2Ref.current.volume = newVolume
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const analyzeAudio = async () => {
    setAnalyzing(true)
    setProgress(0)

    try {
      // Simulate analysis stages
      const stages = [
        { name: "Loading audio data...", duration: 1000 },
        { name: "Extracting frequency features...", duration: 1500 },
        { name: "Analyzing melodic patterns...", duration: 2000 },
        { name: "Comparing rhythmic structures...", duration: 1800 },
        { name: "Detecting harmonic similarities...", duration: 1600 },
        { name: "Identifying matching segments...", duration: 2200 },
        { name: "Generating similarity report...", duration: 1200 },
      ]

      for (let i = 0; i < stages.length; i++) {
        setCurrentStage(stages[i].name)
        setProgress(((i + 1) / stages.length) * 100)
        await new Promise((resolve) => setTimeout(resolve, stages[i].duration))
      }

      // Generate mock analysis results
      const mockResults: AudioAnalysisResult = {
        overallSimilarity: 72,
        melodySimilarity: 85,
        rhythmSimilarity: 68,
        harmonySimilarity: 63,
        matchedSegments: [
          {
            startTime1: 15,
            endTime1: 30,
            startTime2: 22,
            endTime2: 37,
            similarity: 92,
            type: "melody",
          },
          {
            startTime1: 45,
            endTime1: 60,
            startTime2: 52,
            endTime2: 67,
            similarity: 78,
            type: "rhythm",
          },
          {
            startTime1: 75,
            endTime1: 90,
            startTime2: 82,
            endTime2: 97,
            similarity: 65,
            type: "harmony",
          },
        ],
        spectrogram1: Array(100)
          .fill(0)
          .map(() => Math.random() * 100),
        spectrogram2: Array(100)
          .fill(0)
          .map(() => Math.random() * 100),
        tempo1: 120,
        tempo2: 124,
        key1: "C Major",
        key2: "C Major",
      }

      setAnalysisResult(mockResults)
      onAnalysisComplete(mockResults)
    } catch (error) {
      console.error("Analysis error:", error)
    } finally {
      setAnalyzing(false)
      setProgress(100)
    }
  }

  const playMatchedSegment = (index: number) => {
    if (!analysisResult || !audio1Ref.current || !audio2Ref.current) return

    const segment = analysisResult.matchedSegments[index]
    setSelectedSegment(index)

    // Set audio positions
    audio1Ref.current.currentTime = segment.startTime1
    audio2Ref.current.currentTime = segment.startTime2

    // Play both tracks
    audio1Ref.current.play()
    audio2Ref.current.play()
    setIsPlaying1(true)
    setIsPlaying2(true)

    // Stop after segment duration
    const duration = Math.min(segment.endTime1 - segment.startTime1, segment.endTime2 - segment.startTime2)

    setTimeout(() => {
      audio1Ref.current?.pause()
      audio2Ref.current?.pause()
      setIsPlaying1(false)
      setIsPlaying2(false)
    }, duration * 1000)
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Track 1</span>
              <Badge variant="outline">Reference</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative h-32 bg-black rounded-md overflow-hidden">
              <canvas ref={canvas1Ref} className="w-full h-full" width={600} height={128}></canvas>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={() => togglePlayback(1)}>
                {isPlaying1 ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <div className="flex-1 mx-4">
                <div className="text-xs text-center mb-1">
                  {formatTime(currentTime1)} / {formatTime(duration1)}
                </div>
                <Progress value={(currentTime1 / duration1) * 100} />
              </div>

              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={[volume1]}
                  max={1}
                  step={0.1}
                  onValueChange={(value) => handleVolumeChange(value, 1)}
                  className="w-24"
                />
              </div>
            </div>

            <audio ref={audio1Ref} className="hidden" crossOrigin="anonymous"></audio>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Track 2</span>
              <Badge variant="outline">Comparison</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative h-32 bg-black rounded-md overflow-hidden">
              <canvas ref={canvas2Ref} className="w-full h-full" width={600} height={128}></canvas>
            </div>

            <div className="flex items-center justify-between">
              <Button variant="outline" size="icon" onClick={() => togglePlayback(2)}>
                {isPlaying2 ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>

              <div className="flex-1 mx-4">
                <div className="text-xs text-center mb-1">
                  {formatTime(currentTime2)} / {formatTime(duration2)}
                </div>
                <Progress value={(currentTime2 / duration2) * 100} />
              </div>

              <div className="flex items-center gap-2">
                <Volume2 className="h-4 w-4" />
                <Slider
                  value={[volume2]}
                  max={1}
                  step={0.1}
                  onValueChange={(value) => handleVolumeChange(value, 2)}
                  className="w-24"
                />
              </div>
            </div>

            <audio ref={audio2Ref} className="hidden" crossOrigin="anonymous"></audio>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-center">
        <Button onClick={analyzeAudio} disabled={analyzing || !audioUrl1 || !audioUrl2} className="w-full max-w-md">
          {analyzing ? (
            <>
              <Waveform className="mr-2 h-4 w-4 animate-pulse" />
              {currentStage}
            </>
          ) : (
            <>
              <Music className="mr-2 h-4 w-4" />
              Analyze Audio Similarity
            </>
          )}
        </Button>
      </div>

      {analyzing && (
        <div className="space-y-2">
          <Progress value={progress} />
          <p className="text-sm text-center text-muted-foreground">{currentStage}</p>
        </div>
      )}

      {analysisResult && (
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Analysis Results</span>
              <Button variant="outline" size="sm" onClick={() => setShowFullscreen(true)}>
                <Maximize className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="matches">Matched Segments</TabsTrigger>
                <TabsTrigger value="spectral">Spectral Analysis</TabsTrigger>
                <TabsTrigger value="report">Detailed Report</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className={`rounded-full p-3 ${
                            analysisResult.overallSimilarity > 75
                              ? "bg-red-100 text-red-700"
                              : analysisResult.overallSimilarity > 50
                                ? "bg-yellow-100 text-yellow-700"
                                : "bg-green-100 text-green-700"
                          }`}
                        >
                          <Music className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold">Overall Similarity</h3>
                        <div className="text-2xl font-bold">{analysisResult.overallSimilarity}%</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="rounded-full p-3 bg-blue-100 text-blue-700">
                          <Waveform className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold">Melodic Match</h3>
                        <div className="text-2xl font-bold">{analysisResult.melodySimilarity}%</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="rounded-full p-3 bg-purple-100 text-purple-700">
                          <BarChart3 className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold">Rhythmic Match</h3>
                        <div className="text-2xl font-bold">{analysisResult.rhythmSimilarity}%</div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <div className="flex flex-col items-center gap-2">
                        <div className="rounded-full p-3 bg-green-100 text-green-700">
                          <Hash className="h-6 w-6" />
                        </div>
                        <h3 className="font-semibold">Harmonic Match</h3>
                        <div className="text-2xl font-bold">{analysisResult.harmonySimilarity}%</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Track Information</h3>
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Tempo (Track 1)</p>
                          <p className="font-medium">{analysisResult.tempo1} BPM</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Tempo (Track 2)</p>
                          <p className="font-medium">{analysisResult.tempo2} BPM</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Key (Track 1)</p>
                          <p className="font-medium">{analysisResult.key1}</p>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Key (Track 2)</p>
                          <p className="font-medium">{analysisResult.key2}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-4">Similarity Assessment</h3>
                    <div className="space-y-2">
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Melody</span>
                          <span
                            className={analysisResult.melodySimilarity > 75 ? "text-red-500" : "text-muted-foreground"}
                          >
                            {analysisResult.melodySimilarity}%
                          </span>
                        </div>
                        <Progress value={analysisResult.melodySimilarity} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Rhythm</span>
                          <span
                            className={analysisResult.rhythmSimilarity > 75 ? "text-red-500" : "text-muted-foreground"}
                          >
                            {analysisResult.rhythmSimilarity}%
                          </span>
                        </div>
                        <Progress value={analysisResult.rhythmSimilarity} />
                      </div>
                      <div>
                        <div className="flex justify-between mb-1">
                          <span>Harmony</span>
                          <span
                            className={analysisResult.harmonySimilarity > 75 ? "text-red-500" : "text-muted-foreground"}
                          >
                            {analysisResult.harmonySimilarity}%
                          </span>
                        </div>
                        <Progress value={analysisResult.harmonySimilarity} />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="matches" className="space-y-4">
                <div className="space-y-4">
                  {analysisResult.matchedSegments.map((segment, index) => (
                    <Card
                      key={index}
                      className={`cursor-pointer ${selectedSegment === index ? "border-primary" : ""}`}
                      onClick={() => playMatchedSegment(index)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant={segment.similarity > 80 ? "destructive" : "secondary"}>
                              {segment.similarity}% Match
                            </Badge>
                            <Badge variant="outline" className="capitalize">
                              {segment.type}
                            </Badge>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => playMatchedSegment(index)}>
                            <Play className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Track 1 Segment</p>
                            <p className="text-sm">
                              {formatTime(segment.startTime1)} - {formatTime(segment.endTime1)}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Track 2 Segment</p>
                            <p className="text-sm">
                              {formatTime(segment.startTime2)} - {formatTime(segment.endTime2)}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="spectral" className="space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-medium mb-2">Track 1 Spectrogram</h3>
                    <div className="h-40 bg-black rounded-md p-2">
                      {/* Render spectrogram visualization here */}
                      <div className="h-full relative">
                        {analysisResult.spectrogram1.map((value, i) => (
                          <div
                            key={i}
                            className="absolute bottom-0 bg-red-500/50 w-1"
                            style={{
                              height: `${value}%`,
                              left: `${(i / analysisResult.spectrogram1.length) * 100}%`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-2">Track 2 Spectrogram</h3>
                    <div className="h-40 bg-black rounded-md p-2">
                      {/* Render spectrogram visualization here */}
                      <div className="h-full relative">
                        {analysisResult.spectrogram2.map((value, i) => (
                          <div
                            key={i}
                            className="absolute bottom-0 bg-blue-500/50 w-1"
                            style={{
                              height: `${value}%`,
                              left: `${(i / analysisResult.spectrogram2.length) * 100}%`,
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="report" className="space-y-4">
                <div className="space-y-6">
                  <div className="p-4 rounded-lg border bg-muted/50">
                    <h3 className="text-lg font-medium mb-2">Analysis Summary</h3>
                    <p className="text-sm">
                      The analysis indicates a {analysisResult.overallSimilarity}% overall similarity between the two
                      tracks.
                      {analysisResult.overallSimilarity > 75 ? (
                        <span className="text-red-500 font-medium">
                          {" "}
                          This high level of similarity suggests potential copyright concerns.
                        </span>
                      ) : analysisResult.overallSimilarity > 50 ? (
                        <span className="text-yellow-500 font-medium">
                          {" "}
                          This moderate level of similarity may warrant further investigation.
                        </span>
                      ) : (
                        <span className="text-green-500 font-medium">
                          {" "}
                          This low level of similarity suggests the tracks are likely distinct works.
                        </span>
                      )}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Key Findings</h3>
                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          className={`h-5 w-5 mt-0.5 ${
                            analysisResult.melodySimilarity > 75 ? "text-red-500" : "text-yellow-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">Melodic Similarity: {analysisResult.melodySimilarity}%</p>
                          <p className="text-sm text-muted-foreground">
                            {analysisResult.melodySimilarity > 75
                              ? "Significant melodic overlap detected, which may indicate derivative work."
                              : "Some melodic similarities present, but likely within acceptable creative bounds."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          className={`h-5 w-5 mt-0.5 ${
                            analysisResult.rhythmSimilarity > 75 ? "text-red-500" : "text-yellow-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">Rhythmic Similarity: {analysisResult.rhythmSimilarity}%</p>
                          <p className="text-sm text-muted-foreground">
                            {analysisResult.rhythmSimilarity > 75
                              ? "Highly similar rhythmic patterns detected across multiple segments."
                              : "Some rhythmic similarities detected, but with significant variations."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <AlertTriangle
                          className={`h-5 w-5 mt-0.5 ${
                            analysisResult.harmonySimilarity > 75 ? "text-red-500" : "text-yellow-500"
                          }`}
                        />
                        <div>
                          <p className="font-medium">Harmonic Similarity: {analysisResult.harmonySimilarity}%</p>
                          <p className="text-sm text-muted-foreground">
                            {analysisResult.harmonySimilarity > 75
                              ? "Chord progressions show substantial overlap between tracks."
                              : "Harmonic structures share common elements but with distinct variations."}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button className="gap-2">
                      <Download className="h-4 w-4" />
                      Download Full Report
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
