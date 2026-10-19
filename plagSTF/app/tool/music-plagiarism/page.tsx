"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import {
  Play,
  Pause,
  FileAudio,
  AudioWaveformIcon as Waveform,
  Music,
  PieChart,
  Zap,
  Music2,
  Mic,
  Piano,
  InfoIcon,
  Clock,
  Layers,
  BarChart3,
  Fingerprint,
  Sparkles,
  ArrowRight,
  Check,
  AlertTriangle,
  X,
} from "lucide-react"
import { toast } from "sonner"
import AnimatedBackground from "@/components/animated-background"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

export default function MusicPlagiarismDetector() {
  const [file1, setFile1] = useState<File | null>(null)
  const [audio1Url, setAudio1Url] = useState("")
  const [isPlaying1, setIsPlaying1] = useState(false)
  const [volume1, setVolume1] = useState(0.5)
  const [currentTime1, setCurrentTime1] = useState(0)
  const [duration1, setDuration1] = useState(0)
  const [analyzing, setAnalyzing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("overview")

  const [copyrightStatus, setCopyrightStatus] = useState<"unknown" | "detected" | "not_detected" | "inconclusive">(
    "unknown",
  )
  const [copyrightDetails, setCopyrightDetails] = useState<any>(null)
  const [isDeepScanning, setIsDeepScanning] = useState(false)
  const [scanProgress, setScanProgress] = useState(0)
  const [scanStage, setScanStage] = useState("")
  const [matchedTracks, setMatchedTracks] = useState<any[]>([])
  const [confidenceScore, setConfidenceScore] = useState(0)
  const [commercialUseStatus, setCommercialUseStatus] = useState<"allowed" | "restricted" | "unknown">("unknown")
  const [licenseRecommendations, setLicenseRecommendations] = useState<string[]>([])

  // Feature extraction data
  const [spectrogramData, setSpectrogramData] = useState<number[][]>([])
  const [chromaData, setChromaData] = useState<number[][]>([])
  const [melodicPatterns, setMelodicPatterns] = useState<
    Array<{
      pattern: string
      similarity: number
      source: string
    }>
  >([])
  const [rhythmicPatterns, setRhythmicPatterns] = useState<
    Array<{
      pattern: string
      similarity: number
      source: string
    }>
  >([])
  const [harmonicAnalysis, setHarmonicAnalysis] = useState<
    Array<{
      chord: string
      duration: number
      similarity: number
    }>
  >([])
  const [similarityMatrix, setSimilarityMatrix] = useState<number[][]>([])
  const [audioFeatures, setAudioFeatures] = useState<{
    tempo: number
    key: string
    energy: number
    danceability: number
    acousticness: number
    instrumentalness: number
  } | null>(null)

  // New state for detection process
  const [currentDetectionStep, setCurrentDetectionStep] = useState(0)
  const [featureExtractionComplete, setFeatureExtractionComplete] = useState(false)
  const [preprocessingComplete, setPreprocessingComplete] = useState(false)
  const [similarityAnalysisComplete, setSimilarityAnalysisComplete] = useState(false)
  const [decisionMakingComplete, setDecisionMakingComplete] = useState(false)
  const [extractedFeatures, setExtractedFeatures] = useState<{
    melody: boolean
    harmony: boolean
    rhythm: boolean
    timbre: boolean
    lyrics: boolean
  }>({
    melody: false,
    harmony: false,
    rhythm: false,
    timbre: false,
    lyrics: false,
  })
  const [similarityScores, setSimilarityScores] = useState<{
    cosine: number | null
    dtw: number | null
    deepLearning: number | null
    overall: number | null
  }>({
    cosine: null,
    dtw: null,
    deepLearning: null,
    overall: null,
  })
  const [thresholdValue, setThresholdValue] = useState(75)
  const [detectionLog, setDetectionLog] = useState<string[]>([])

  const audio1Ref = useRef<HTMLAudioElement>(null)
  const fileInput1Ref = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaElementAudioSourceNode | null>(null);
  const analyzerRef = useRef<AnalyserNode>(null);

  // Canvas animation for waveform
  useEffect(() => {
    if (!canvasRef.current || !audio1Url) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationId: number

    const setupAudioContext = (audioElement: HTMLAudioElement) => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }

      if (!analyzerRef.current) {
        analyzerRef.current = audioContextRef.current.createAnalyser();
        analyzerRef.current.fftSize = 256;
      }
      
      // Check if we already have a source node
      if (!sourceNodeRef.current) {
        sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioElement);
        // Connect to analyzer and destination only the first time
        sourceNodeRef.current.connect(analyzerRef.current);
        sourceNodeRef.current.connect(audioContextRef.current.destination);
      }
      
      // Rest of the setup code...
    };

    const bufferLength = analyzerRef.current ? analyzerRef.current.frequencyBinCount : 0;
    const dataArray = new Uint8Array(bufferLength)

    if (audio1Ref.current) {
      setupAudioContext(audio1Ref.current);
    }

    const draw = () => {
      animationId = requestAnimationFrame(draw)

      if (analyzerRef.current) {
        analyzerRef.current.getByteFrequencyData(dataArray)
      }

      ctx.fillStyle = "rgb(20, 20, 30)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      const barWidth = (canvas.width / bufferLength) * 2.5
      let x = 0

      for (let i = 0; i < bufferLength; i++) {
        const barHeight = dataArray[i] / 2

        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height)
        gradient.addColorStop(0, "rgba(139, 92, 246, 1)")
        gradient.addColorStop(1, "rgba(139, 92, 246, 0.2)")

        ctx.fillStyle = gradient
        ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight)

        x += barWidth + 1
      }
    }

    draw()

    return () => {
      cancelAnimationFrame(animationId)
      // audioContext.close()
    }
  }, [audio1Url, isPlaying1])

  useEffect(() => {
    return () => {
      // Clean up audio context and nodes when component unmounts
      if (audioContextRef.current) {
        sourceNodeRef.current = null;
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
    };
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("audio/")) {
      toast.error("Please upload an audio file")
      return
    }

    const url = URL.createObjectURL(file)
    setFile1(file)
    setAudio1Url(url)

    if (audio1Ref.current) {
      audio1Ref.current.onloadedmetadata = () => {
        setDuration1(audio1Ref.current!.duration)
      }
    }

    // Reset all analysis states when a new file is uploaded
    resetAnalysisStates()
  }

  const resetAnalysisStates = () => {
    setCopyrightStatus("unknown")
    setMatchedTracks([])
    setCommercialUseStatus("unknown")
    setLicenseRecommendations([])
    setSpectrogramData([])
    setChromaData([])
    setMelodicPatterns([])
    setRhythmicPatterns([])
    setHarmonicAnalysis([])
    setSimilarityMatrix([])
    setAudioFeatures(null)
    setCurrentDetectionStep(0)
    setFeatureExtractionComplete(false)
    setPreprocessingComplete(false)
    setSimilarityAnalysisComplete(false)
    setDecisionMakingComplete(false)
    setExtractedFeatures({
      melody: false,
      harmony: false,
      rhythm: false,
      timbre: false,
      lyrics: false,
    })
    setSimilarityScores({
      cosine: null,
      dtw: null,
      deepLearning: null,
      overall: null,
    })
    setDetectionLog([])
  }

  const togglePlayback = () => {
    const audioRef = audio1Ref.current
    if (!audioRef) return

    if (audioRef.paused) {
      audioRef.play()
      setIsPlaying1(true)
    } else {
      audioRef.pause()
      setIsPlaying1(false)
    }
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume1(newVolume)
    if (audio1Ref.current) audio1Ref.current.volume = newVolume
  }

  const handleTimeUpdate = () => {
    const audioRef = audio1Ref.current
    if (audioRef) {
      setCurrentTime1(audioRef.currentTime)
    }
  }

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const checkCopyright = async () => {
    if (!file1) {
      toast.error("Please upload an audio file")
      return
    }

    setIsDeepScanning(true)
    setScanProgress(0)
    setCopyrightStatus("unknown")
    setMatchedTracks([])
    setCommercialUseStatus("unknown")
    setLicenseRecommendations([])
    setCurrentDetectionStep(1)
    setActiveTab("process")

    // Reset all analysis states
    setFeatureExtractionComplete(false)
    setPreprocessingComplete(false)
    setSimilarityAnalysisComplete(false)
    setDecisionMakingComplete(false)
    setExtractedFeatures({
      melody: false,
      harmony: false,
      rhythm: false,
      timbre: false,
      lyrics: false,
    })
    setSimilarityScores({
      cosine: null,
      dtw: null,
      deepLearning: null,
      overall: null,
    })
    setDetectionLog([])

    try {
      // Step 1: Feature Extraction
      setDetectionLog((prev) => [...prev, "Starting feature extraction..."])
      await simulateFeatureExtraction()
      setFeatureExtractionComplete(true)
      setCurrentDetectionStep(2)

      // Step 2: Preprocessing
      setDetectionLog((prev) => [...prev, "Starting preprocessing of audio data..."])
      await simulatePreprocessing()
      setPreprocessingComplete(true)
      setCurrentDetectionStep(3)

      // Step 3: Similarity Analysis
      setDetectionLog((prev) => [...prev, "Starting similarity analysis..."])
      await simulateSimilarityAnalysis()
      setSimilarityAnalysisComplete(true)
      setCurrentDetectionStep(4)

      // Step 4: Decision Making
      setDetectionLog((prev) => [...prev, "Making final decision based on similarity scores..."])
      await simulateDecisionMaking()
      setDecisionMakingComplete(true)

      toast.success("Copyright scan complete!")
    } catch (error) {
      toast.error("Failed to complete copyright scan")
      setCopyrightStatus("unknown")
    } finally {
      setIsDeepScanning(false)
      setScanProgress(100)
    }
  }

  const simulateFeatureExtraction = async () => {
    // Simulate extracting different features one by one
    const features = ["melody", "harmony", "rhythm", "timbre", "lyrics"] as const
    const featureMessages = {
      melody: "Extracting melodic patterns and note sequences...",
      harmony: "Analyzing chord progressions and harmonic structure...",
      rhythm: "Identifying rhythmic patterns and tempo...",
      timbre: "Analyzing spectral characteristics and instrumentation...",
      lyrics: "Processing vocal content for lyrical analysis...",
    }

    for (const feature of features) {
      setDetectionLog((prev) => [...prev, featureMessages[feature]])
      setScanStage(featureMessages[feature])
      setScanProgress((prev) => prev + 10)

      // Wait for 1 second to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update the extracted features state
      setExtractedFeatures((prev) => ({
        ...prev,
        [feature]: true,
      }))
    }

    // Generate mock audio features
    const mockFeatures = {
      tempo: 80 + Math.floor(Math.random() * 60), // 80-140 BPM
      key: ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"][Math.floor(Math.random() * 12)],
      energy: Math.round(Math.random() * 100),
      danceability: Math.round(Math.random() * 100),
      acousticness: Math.round(Math.random() * 100),
      instrumentalness: Math.round(Math.random() * 100),
    }
    setAudioFeatures(mockFeatures)

    // Generate mock spectrogram data
    const mockSpectrogram = Array(50)
      .fill(0)
      .map(() =>
        Array(128)
          .fill(0)
          .map(() => Math.random()),
      )
    setSpectrogramData(mockSpectrogram)

    // Generate mock chroma data
    const mockChroma = Array(50)
      .fill(0)
      .map(() =>
        Array(12)
          .fill(0)
          .map(() => Math.random()),
      )
    setChromaData(mockChroma)

    // Generate mock melodic patterns
    setMelodicPatterns([
      { pattern: "C-E-G-A-G", similarity: 85, source: "Popular Song 1" },
      { pattern: "G-F-E-D-C", similarity: 72, source: "Classical Piece 2" },
      { pattern: "A-B-C-D-E", similarity: 65, source: "Folk Song 3" },
    ])

    // Generate mock rhythmic patterns
    setRhythmicPatterns([
      { pattern: "♩ ♩ ♩ ♩", similarity: 90, source: "Pop Song A" },
      { pattern: "♩ ♪♪ ♩ ♪♪", similarity: 78, source: "Rock Song B" },
      { pattern: "♪♪♪♪ ♩ ♩", similarity: 62, source: "Dance Track C" },
    ])

    // Generate mock harmonic analysis
    setHarmonicAnalysis([
      { chord: "C Major", duration: 2, similarity: 95 },
      { chord: "G Major", duration: 1, similarity: 88 },
      { chord: "A Minor", duration: 1, similarity: 75 },
      { chord: "F Major", duration: 2, similarity: 82 },
    ])

    setDetectionLog((prev) => [...prev, "Feature extraction complete."])
  }

  const simulatePreprocessing = async () => {
    // Simulate preprocessing steps
    const preprocessingSteps = [
      "Converting audio to numerical representations...",
      "Normalizing audio features...",
      "Applying signal processing techniques...",
      "Generating spectrograms and chromagrams...",
      "Preparing data for similarity comparison...",
    ]

    for (const step of preprocessingSteps) {
      setDetectionLog((prev) => [...prev, step])
      setScanStage(step)
      setScanProgress((prev) => prev + 5)

      // Wait for 800ms to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 800))
    }

    // Generate mock similarity matrix
    const size = 20
    const mockMatrix = Array(size)
      .fill(0)
      .map(() =>
        Array(size)
          .fill(0)
          .map(() => Math.random()),
      )
    setSimilarityMatrix(mockMatrix)

    setDetectionLog((prev) => [...prev, "Preprocessing complete."])
  }

  const simulateSimilarityAnalysis = async () => {
    // Simulate different similarity algorithms
    const algorithms = [
      { name: "Cosine Similarity", description: "Measuring vector similarity between audio features..." },
      { name: "Dynamic Time Warping (DTW)", description: "Analyzing temporal alignment between sequences..." },
      { name: "Deep Learning Model", description: "Applying neural network for similarity detection..." },
    ]

    for (let i = 0; i < algorithms.length; i++) {
      const algorithm = algorithms[i]
      setDetectionLog((prev) => [...prev, `Running ${algorithm.name}: ${algorithm.description}`])
      setScanStage(algorithm.description)
      setScanProgress((prev) => prev + 5)

      // Wait for 1.2 seconds to simulate processing
      await new Promise((resolve) => setTimeout(resolve, 1200))

      // Generate a similarity score
      const score = Math.floor(Math.random() * 30) + 60 // 60-90

      // Update the similarity scores
      if (i === 0) {
        setSimilarityScores((prev) => ({ ...prev, cosine: score }))
      } else if (i === 1) {
        setSimilarityScores((prev) => ({ ...prev, dtw: score }))
      } else {
        setSimilarityScores((prev) => ({ ...prev, deepLearning: score }))
      }
    }

    // Calculate overall similarity
    const overallScore = Math.floor(Math.random() * 20) + 70 // 70-90
    setSimilarityScores((prev) => ({ ...prev, overall: overallScore }))
    setConfidenceScore(overallScore)

    setDetectionLog((prev) => [...prev, "Similarity analysis complete."])
  }

  const simulateDecisionMaking = async () => {
    setDetectionLog((prev) => [...prev, `Applying threshold of ${thresholdValue}% for copyright detection...`])
    setScanStage("Making final decision...")
    setScanProgress(95)

    // Wait for 1 second to simulate processing
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Make decision based on overall similarity score
    const overallScore = similarityScores.overall || 0

    let status: "detected" | "not_detected" | "inconclusive"

    if (overallScore > thresholdValue + 10) {
      status = "detected"
      setDetectionLog((prev) => [
        ...prev,
        `Copyright DETECTED: Similarity score (${overallScore}%) exceeds threshold (${thresholdValue}%).`,
      ])

      // Generate mock matched tracks
      setMatchedTracks([
        {
          title: "Echoes of Tomorrow",
          artist: "Skyline Harmony",
          album: "Digital Dreams",
          releaseYear: 2021,
          label: "Future Records",
          similarity: overallScore,
          registrationNumber: "SR0000123456",
          owner: "Future Music Group",
        },
        {
          title: "Midnight Reflections",
          artist: "Skyline Harmony",
          album: "Digital Dreams",
          releaseYear: 2021,
          label: "Future Records",
          similarity: overallScore - 5,
          registrationNumber: "SR0000123457",
          owner: "Future Music Group",
        },
      ])
    } else if (overallScore < thresholdValue - 10) {
      status = "not_detected"
      setDetectionLog((prev) => [
        ...prev,
        `Copyright NOT DETECTED: Similarity score (${overallScore}%) below threshold (${thresholdValue}%).`,
      ])
      setMatchedTracks([])
    } else {
      status = "inconclusive"
      setDetectionLog((prev) => [
        ...prev,
        `Result INCONCLUSIVE: Similarity score (${overallScore}%) near threshold (${thresholdValue}%).`,
      ])
      setMatchedTracks([
        {
          title: "Distant Memories",
          artist: "Echo Collective",
          album: "Resonance",
          releaseYear: 2019,
          label: "Indie Sounds",
          similarity: overallScore,
          registrationNumber: "SR0000789012",
          owner: "Independent Artists Coalition",
        },
      ])
    }

    setCopyrightStatus(status)

    setCopyrightDetails({
      scanDate: new Date().toLocaleString(),
      databasesChecked: ["ASCAP", "BMI", "SESAC", "Global Music Rights", "SoundExchange"],
      audioFingerprint: `AFP-${Math.random().toString(36).substring(2, 10)}-${Date.now().toString(36)}`,
      confidenceScore: overallScore,
      status,
    })

    setScanProgress(100)
    setDetectionLog((prev) => [...prev, "Analysis complete. Results ready for review."])
  }

  return (
    <div className="container py-8">
      <AnimatedBackground variant="waves" intensity="light" color="#8b5cf6" />
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Music Copyright Detection</h1>
            <p className="text-muted-foreground">
              Analyze audio files to detect potential copyright infringement using advanced signal processing and
              machine learning
            </p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Upload Audio File</CardTitle>
            <CardDescription>Upload an audio file to analyze for potential copyright matches</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid place-items-center border-2 border-dashed rounded-lg p-8">
              <div className="text-center space-y-4">
                <input
                  ref={fileInput1Ref}
                  type="file"
                  accept="audio/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                <FileAudio className="h-8 w-8 mx-auto text-muted-foreground" />
                <div className="space-y-2">
                  <h3 className="font-medium">{file1?.name || "Select an audio file to check"}</h3>
                  <p className="text-sm text-muted-foreground">Supports MP3, WAV, AIFF, FLAC up to 50MB</p>
                </div>
                <Button variant="outline" onClick={() => fileInput1Ref.current?.click()} className="w-full">
                  Select File
                </Button>
              </div>
            </div>

            {/* Audio Player */}
            {audio1Url && (
              <div className="space-y-4">
                <canvas ref={canvasRef} className="w-full h-24 rounded-md bg-black" width={800} height={100} />

                <div className="flex items-center justify-between">
                  <Button variant="outline" size="icon" onClick={togglePlayback}>
                    {isPlaying1 ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                  </Button>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">{formatTime(currentTime1)}</span>
                    <input
                      type="range"
                      min="0"
                      max={duration1}
                      value={currentTime1}
                      className="w-24 md:w-48"
                      onChange={(e) => {
                        if (audio1Ref.current) {
                          audio1Ref.current.currentTime = Number.parseFloat(e.target.value)
                          setCurrentTime1(Number.parseFloat(e.target.value))
                        }
                      }}
                    />
                    <span className="text-sm">{formatTime(duration1)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume1}
                      className="w-16"
                      onChange={(e) => handleVolumeChange([Number.parseFloat(e.target.value)])}
                    />
                  </div>
                </div>
                <audio
                  ref={audio1Ref}
                  src={audio1Url}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying1(false)}
                />
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={checkCopyright} disabled={isDeepScanning || !file1} className="gap-2">
                <Fingerprint className="h-4 w-4" />
                {isDeepScanning ? "Analyzing..." : "Analyze for Copyright"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Tabs for different views */}
        {(file1 || copyrightStatus !== "unknown") && (
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="process">Detection Process</TabsTrigger>
              <TabsTrigger value="analysis">Detailed Analysis</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Copyright Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {isDeepScanning ? (
                    <div className="space-y-2">
                      <p>Scanning audio for potential copyright issues...</p>
                      <Progress value={scanProgress} />
                      <p className="text-sm text-muted-foreground">{scanStage}</p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {copyrightStatus === "unknown" ? (
                        <p>Upload an audio file and run analysis to check for copyright status.</p>
                      ) : copyrightStatus === "detected" ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <InfoIcon className="h-4 w-4 text-red-500" />
                            <h3 className="font-medium">Copyright Detected</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Potential copyright infringement detected with {confidenceScore}% confidence. Review the
                            matched tracks below for more details.
                          </p>
                        </div>
                      ) : copyrightStatus === "not_detected" ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <InfoIcon className="h-4 w-4 text-green-500" />
                            <h3 className="font-medium">No Copyright Detected</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            No copyright infringement detected with {confidenceScore}% confidence. However, this does
                            not guarantee that the audio is free from copyright restrictions.
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <InfoIcon className="h-4 w-4 text-yellow-500" />
                            <h3 className="font-medium">Inconclusive</h3>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Unable to determine copyright status with certainty. Similarity score of {confidenceScore}%
                            is near the detection threshold. Further analysis may be required.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {matchedTracks.length > 0 && (
                    <div className="space-y-2">
                      <h3 className="font-medium">Matched Tracks</h3>
                      <ul className="list-none space-y-2">
                        {matchedTracks.map((track, index) => (
                          <li key={index} className="p-3 bg-muted rounded-md">
                            <div className="flex justify-between items-center">
                              <div className="font-medium">{track.title}</div>
                              <Badge variant={track.similarity > 80 ? "destructive" : "secondary"}>
                                {track.similarity}% Match
                              </Badge>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              Artist: {track.artist}, Album: {track.album} ({track.releaseYear})
                            </div>
                            <Progress value={track.similarity} className="h-1 mt-2" />
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {copyrightDetails && (
                    <div className="mt-4 space-y-2 border-t pt-4">
                      <h3 className="font-medium">Analysis Details</h3>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-muted-foreground">Scan Date:</div>
                        <div>{copyrightDetails.scanDate}</div>

                        <div className="text-muted-foreground">Confidence Score:</div>
                        <div>{copyrightDetails.confidenceScore}%</div>

                        <div className="text-muted-foreground">Audio Fingerprint:</div>
                        <div className="font-mono text-xs">{copyrightDetails.audioFingerprint}</div>

                        <div className="text-muted-foreground">Databases Checked:</div>
                        <div>{copyrightDetails.databasesChecked.join(", ")}</div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Detection Process Tab */}
            <TabsContent value="process" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Detection Process</CardTitle>
                  <CardDescription>
                    Music plagiarism detection follows a four-step process to analyze and compare audio content
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {/* Step 1: Feature Extraction */}
                    <div className="relative">
                      <div
                        className={`flex items-start gap-4 ${currentDetectionStep >= 1 ? "opacity-100" : "opacity-50"}`}
                      >
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${featureExtractionComplete ? "bg-green-100 text-green-600" : currentDetectionStep === 1 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
                        >
                          {featureExtractionComplete ? <Check className="h-5 w-5" /> : <Layers className="h-5 w-5" />}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">1. Feature Extraction</h3>
                            {currentDetectionStep === 1 && <Badge variant="outline">In Progress</Badge>}
                            {featureExtractionComplete && (
                              <Badge variant="outline" className="bg-green-50 text-green-600">
                                Complete
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Extracting key musical features from the audio file including melody, harmony, rhythm,
                            timbre, and lyrics.
                          </p>

                          {currentDetectionStep >= 1 && (
                            <div className="grid grid-cols-5 gap-2 mt-3">
                              {Object.entries(extractedFeatures).map(([feature, extracted], index) => (
                                <div
                                  key={index}
                                  className={`p-2 rounded-md text-center text-xs ${extracted ? "bg-green-50 text-green-600 border border-green-200" : "bg-gray-50 text-gray-400 border border-gray-200"}`}
                                >
                                  {feature.charAt(0).toUpperCase() + feature.slice(1)}
                                  {extracted && <Check className="h-3 w-3 mx-auto mt-1" />}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {currentDetectionStep >= 2 && (
                        <div className="absolute left-5 top-10 w-0.5 h-10 bg-gray-200"></div>
                      )}
                    </div>

                    {/* Step 2: Preprocessing */}
                    <div className="relative">
                      <div
                        className={`flex items-start gap-4 ${currentDetectionStep >= 2 ? "opacity-100" : "opacity-50"}`}
                      >
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${preprocessingComplete ? "bg-green-100 text-green-600" : currentDetectionStep === 2 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
                        >
                          {preprocessingComplete ? <Check className="h-5 w-5" /> : <BarChart3 className="h-5 w-5" />}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">2. Preprocessing</h3>
                            {currentDetectionStep === 2 && <Badge variant="outline">In Progress</Badge>}
                            {preprocessingComplete && (
                              <Badge variant="outline" className="bg-green-50 text-green-600">
                                Complete
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Converting audio features into numerical representations for comparison, including
                            spectrograms and feature vectors.
                          </p>

                          {preprocessingComplete && (
                            <div className="grid grid-cols-1 gap-2 mt-3">
                              <div className="p-2 rounded-md bg-gray-50 border border-gray-200">
                                <div className="text-xs text-gray-500 mb-1">Numerical Representation</div>
                                <div className="h-8 bg-black rounded overflow-hidden flex">
                                  {Array(20)
                                    .fill(0)
                                    .map((_, i) => (
                                      <div
                                        key={i}
                                        className="h-full flex-1"
                                        style={{
                                          backgroundColor: `hsl(${240 - i * 12}, 100%, ${50}%)`,
                                          opacity: 0.7 + (i / 20) * 0.3,
                                        }}
                                      />
                                    ))}
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>

                      {currentDetectionStep >= 3 && (
                        <div className="absolute left-5 top-10 w-0.5 h-10 bg-gray-200"></div>
                      )}
                    </div>

                    {/* Step 3: Similarity Analysis */}
                    <div className="relative">
                      <div
                        className={`flex items-start gap-4 ${currentDetectionStep >= 3 ? "opacity-100" : "opacity-50"}`}
                      >
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${similarityAnalysisComplete ? "bg-green-100 text-green-600" : currentDetectionStep === 3 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
                        >
                          {similarityAnalysisComplete ? (
                            <Check className="h-5 w-5" />
                          ) : (
                            <Sparkles className="h-5 w-5" />
                          )}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">3. Similarity Analysis</h3>
                            {currentDetectionStep === 3 && <Badge variant="outline">In Progress</Badge>}
                            {similarityAnalysisComplete && (
                              <Badge variant="outline" className="bg-green-50 text-green-600">
                                Complete
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Comparing extracted features with copyright database using algorithms like cosine
                            similarity, DTW, and deep learning models.
                          </p>

                          {similarityAnalysisComplete && (
                            <div className="grid grid-cols-3 gap-2 mt-3">
                              {similarityScores.cosine !== null && (
                                <div className="p-2 rounded-md bg-gray-50 border border-gray-200 text-center">
                                  <div className="text-xs text-gray-500 mb-1">Cosine Similarity</div>
                                  <div className="font-medium">{similarityScores.cosine}%</div>
                                  <Progress value={similarityScores.cosine} className="h-1 mt-1" />
                                </div>
                              )}

                              {similarityScores.dtw !== null && (
                                <div className="p-2 rounded-md bg-gray-50 border border-gray-200 text-center">
                                  <div className="text-xs text-gray-500 mb-1">DTW</div>
                                  <div className="font-medium">{similarityScores.dtw}%</div>
                                  <Progress value={similarityScores.dtw} className="h-1 mt-1" />
                                </div>
                              )}

                              {similarityScores.deepLearning !== null && (
                                <div className="p-2 rounded-md bg-gray-50 border border-gray-200 text-center">
                                  <div className="text-xs text-gray-500 mb-1">Deep Learning</div>
                                  <div className="font-medium">{similarityScores.deepLearning}%</div>
                                  <Progress value={similarityScores.deepLearning} className="h-1 mt-1" />
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {currentDetectionStep >= 4 && (
                        <div className="absolute left-5 top-10 w-0.5 h-10 bg-gray-200"></div>
                      )}
                    </div>

                    {/* Step 4: Decision Making */}
                    <div className="relative">
                      <div
                        className={`flex items-start gap-4 ${currentDetectionStep >= 4 ? "opacity-100" : "opacity-50"}`}
                      >
                        <div
                          className={`flex items-center justify-center w-10 h-10 rounded-full ${decisionMakingComplete ? (copyrightStatus === "detected" ? "bg-red-100 text-red-600" : copyrightStatus === "not_detected" ? "bg-green-100 text-green-600" : "bg-yellow-100 text-yellow-600") : currentDetectionStep === 4 ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-400"}`}
                        >
                          {decisionMakingComplete ? (
                            copyrightStatus === "detected" ? (
                              <X className="h-5 w-5" />
                            ) : copyrightStatus === "not_detected" ? (
                              <Check className="h-5 w-5" />
                            ) : (
                              <AlertTriangle className="h-5 w-5" />
                            )
                          ) : (
                            <ArrowRight className="h-5 w-5" />
                          )}
                        </div>
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">4. Decision Making</h3>
                            {currentDetectionStep === 4 && <Badge variant="outline">In Progress</Badge>}
                            {decisionMakingComplete && (
                              <Badge
                                variant="outline"
                                className={`${copyrightStatus === "detected" ? "bg-red-50 text-red-600" : copyrightStatus === "not_detected" ? "bg-green-50 text-green-600" : "bg-yellow-50 text-yellow-600"}`}
                              >
                                {copyrightStatus === "detected"
                                  ? "Copyright Detected"
                                  : copyrightStatus === "not_detected"
                                    ? "No Copyright Issues"
                                    : "Inconclusive"}
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Making a final determination based on similarity scores and threshold values.
                          </p>

                          {decisionMakingComplete && similarityScores.overall !== null && (
                            <div className="mt-3 space-y-2">
                              <div className="p-3 rounded-md bg-gray-50 border border-gray-200">
                                <div className="flex justify-between items-center">
                                  <div className="text-sm">Overall Similarity Score</div>
                                  <div className="font-medium">{similarityScores.overall}%</div>
                                </div>
                                <Progress
                                  value={similarityScores.overall}
                                  className="h-2 mt-2"
                                  indicatorClassName={`${similarityScores.overall > thresholdValue ? "bg-red-500" : "bg-green-500"}`}
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <div>0%</div>
                                  <div className="relative">
                                    <div
                                      className="absolute -top-6 -translate-x-1/2 whitespace-nowrap"
                                      style={{ left: `${thresholdValue}%` }}
                                    >
                                      <Badge variant="outline" className="text-[10px] h-5">
                                        Threshold: {thresholdValue}%
                                      </Badge>
                                    </div>
                                    <div
                                      className="h-3 w-0.5 bg-gray-400"
                                      style={{ marginLeft: `${thresholdValue}%` }}
                                    ></div>
                                  </div>
                                  <div>100%</div>
                                </div>
                              </div>

                              <div className="text-sm">
                                {copyrightStatus === "detected" ? (
                                  <div className="text-red-600">
                                    The similarity score exceeds the threshold, indicating potential copyright
                                    infringement.
                                  </div>
                                ) : copyrightStatus === "not_detected" ? (
                                  <div className="text-green-600">
                                    The similarity score is below the threshold, suggesting no copyright issues.
                                  </div>
                                ) : (
                                  <div className="text-yellow-600">
                                    The similarity score is near the threshold, making the result inconclusive.
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Analysis Log */}
              {detectionLog.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis Log</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-black text-green-400 font-mono text-sm p-4 rounded-md h-64 overflow-y-auto">
                      {detectionLog.map((log, index) => (
                        <div key={index} className="pb-1">
                          <span className="text-gray-500">[{new Date().toLocaleTimeString()}]</span> {log}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Detailed Analysis Tab */}
            <TabsContent value="analysis" className="space-y-4">
              {audioFeatures && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Waveform className="h-5 w-5 text-blue-500" />
                      Audio Features Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Tempo</div>
                          <div className="font-medium text-lg flex items-center gap-2">
                            <Clock className="h-4 w-4 text-blue-500" />
                            {audioFeatures.tempo} BPM
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Key</div>
                          <div className="font-medium text-lg flex items-center gap-2">
                            <Music className="h-4 w-4 text-blue-500" />
                            {audioFeatures.key}
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Energy</div>
                          <div className="font-medium text-lg flex items-center gap-2">
                            <Zap className="h-4 w-4 text-blue-500" />
                            {audioFeatures.energy}%
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Danceability</div>
                          <div className="font-medium text-lg flex items-center gap-2">
                            <Music2 className="h-4 w-4 text-blue-500" />
                            {audioFeatures.danceability}%
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Acousticness</div>
                          <div className="font-medium text-lg flex items-center gap-2">
                            <Mic className="h-4 w-4 text-blue-500" />
                            {audioFeatures.acousticness}%
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div className="text-sm text-muted-foreground">Instrumentalness</div>
                          <div className="font-medium text-lg flex items-center gap-2">
                            <Piano className="h-4 w-4 text-blue-500" />
                            {audioFeatures.instrumentalness}%
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Spectrogram</h3>
                          <div className="bg-muted rounded-md p-2 h-40 relative">
                            {/* Mock spectrogram visualization */}
                            <div className="absolute inset-0 p-2">
                              {spectrogramData.length > 0 && (
                                <div className="w-full h-full bg-black rounded overflow-hidden">
                                  {spectrogramData.map((row, i) => (
                                    <div key={i} className="flex h-[2px]">
                                      {row.map((value, j) => (
                                        <div
                                          key={j}
                                          className="w-[2px]"
                                          style={{
                                            backgroundColor: `hsl(240, 100%, ${100 - value * 100}%)`,
                                            opacity: 0.7 + value * 0.3,
                                          }}
                                        />
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Spectrogram showing frequency content over time. Used to identify unique audio fingerprints.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Chromagram</h3>
                          <div className="bg-muted rounded-md p-2 h-40 relative">
                            {/* Mock chromagram visualization */}
                            <div className="absolute inset-0 p-2">
                              {chromaData.length > 0 && (
                                <div className="w-full h-full bg-black rounded overflow-hidden">
                                  {chromaData.map((row, i) => (
                                    <div key={i} className="flex w-full">
                                      {row.map((value, j) => (
                                        <div
                                          key={j}
                                          className="h-[3px] flex-1"
                                          style={{
                                            backgroundColor: `hsl(${j * 30}, 100%, ${50 + value * 25}%)`,
                                            opacity: 0.5 + value * 0.5,
                                          }}
                                        />
                                      ))}
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Chromagram showing the distribution of musical pitches over time. Used for harmonic
                            analysis.
                          </p>
                        </div>
                      </div>

                      <Separator />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Melodic Pattern Analysis</h3>
                          <div className="space-y-2">
                            {melodicPatterns.map((pattern, index) => (
                              <div key={index} className="p-3 bg-muted rounded-md">
                                <div className="flex justify-between items-center">
                                  <div className="font-mono text-sm">{pattern.pattern}</div>
                                  <Badge variant={pattern.similarity > 80 ? "destructive" : "secondary"}>
                                    {pattern.similarity}% Match
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">Similar to: {pattern.source}</div>
                                <Progress value={pattern.similarity} className="h-1 mt-2" />
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-sm font-medium">Rhythmic Pattern Analysis</h3>
                          <div className="space-y-2">
                            {rhythmicPatterns.map((pattern, index) => (
                              <div key={index} className="p-3 bg-muted rounded-md">
                                <div className="flex justify-between items-center">
                                  <div className="font-mono text-sm">{pattern.pattern}</div>
                                  <Badge variant={pattern.similarity > 80 ? "destructive" : "secondary"}>
                                    {pattern.similarity}% Match
                                  </Badge>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1">Similar to: {pattern.source}</div>
                                <Progress value={pattern.similarity} className="h-1 mt-2" />
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      <Separator />

                      <div className="space-y-2">
                        <h3 className="text-sm font-medium">Similarity Matrix</h3>
                        <div className="bg-muted rounded-md p-2 h-64 relative">
                          {/* Mock similarity matrix visualization */}
                          <div className="absolute inset-0 p-2">
                            {similarityMatrix.length > 0 && (
                              <div
                                className="w-full h-full bg-black rounded overflow-hidden grid"
                                style={{
                                  gridTemplateColumns: `repeat(${similarityMatrix[0].length}, 1fr)`,
                                  gridTemplateRows: `repeat(${similarityMatrix.length}, 1fr)`,
                                }}
                              >
                                {similarityMatrix.map((row, i) =>
                                  row.map((value, j) => (
                                    <div
                                      key={`${i}-${j}`}
                                      style={{
                                        backgroundColor: `hsl(${240 - value * 240}, 100%, ${50}%)`,
                                        opacity: 0.7 + value * 0.3,
                                      }}
                                    />
                                  )),
                                )}
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            This matrix shows the similarity between different segments of the audio file and reference
                            tracks. Brighter areas indicate higher similarity, which may suggest potential copyright
                            matches.
                          </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {harmonicAnalysis?.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <PieChart className="h-5 w-5 text-amber-500" />
                      Harmonic Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-sm font-medium mb-2">Chord Progression</h3>
                          <div className="p-4 bg-muted rounded-lg">
                            <div className="flex flex-wrap gap-2">
                              {harmonicAnalysis.map((chord, index) => (
                                <div
                                  key={index}
                                  className="px-3 py-2 rounded-md text-center"
                                  style={{
                                    backgroundColor: `rgba(${chord.similarity > 90 ? "220, 38, 38" : "59, 130, 246"}, 0.2)`,
                                    border: `1px solid ${chord.similarity > 90 ? "rgb(220, 38, 38)" : "rgb(59, 130, 246)"}`,
                                    width: `${chord.duration * 20}%`,
                                    maxWidth: "100%",
                                  }}
                                >
                                  <div className="font-medium">{chord.chord}</div>
                                  <div className="text-xs text-muted-foreground">{chord.similarity}% match</div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="mt-4">
                            <h3 className="text-sm font-medium mb-2">Key Detection</h3>
                            <div className="grid grid-cols-2 gap-2">
                              <div className="p-3 bg-muted rounded-md">
                                <div className="text-sm text-muted-foreground">Primary Key</div>
                                <div className="font-medium">C Major</div>
                                <Progress value={95} className="h-1 mt-2" />
                              </div>
                              <div className="p-3 bg-muted rounded-md">
                                <div className="text-sm text-muted-foreground">Secondary Key</div>
                                <div className="font-medium">A Minor</div>
                                <Progress value={75} className="h-1 mt-2" />
                              </div>
                            </div>
                          </div>
                        </div>

                        <div>
                          <h3 className="text-sm font-medium mb-2">Harmonic Similarity</h3>
                          <div className="space-y-2">
                            <div className="p-3 bg-muted rounded-md">
                              <div className="flex justify-between items-center">
                                <div className="font-medium">Chord Progression #1</div>
                                <Badge variant="destructive">94% Match</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Matches with: "Eternal Sunshine" by Melody Masters (2020)
                              </div>
                              <div className="font-mono text-xs mt-2">I - V - vi - IV</div>
                              <Progress value={94} className="h-1 mt-2" />
                            </div>

                            <div className="p-3 bg-muted rounded-md">
                              <div className="flex justify-between items-center">
                                <div className="font-medium">Chord Progression #2</div>
                                <Badge variant="secondary">78% Match</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Matches with: "Ocean Waves" by Coastal Sounds (2018)
                              </div>
                              <div className="font-mono text-xs mt-2">I - vi - IV - V</div>
                              <Progress value={78} className="h-1 mt-2" />
                            </div>

                            <div className="p-3 bg-muted rounded-md">
                              <div className="flex justify-between items-center">
                                <div className="font-medium">Chord Progression #3</div>
                                <Badge variant="outline">65% Match</Badge>
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Matches with: "Mountain High" by Nature Sounds (2022)
                              </div>
                              <div className="font-mono text-xs mt-2">ii - V - I - vi</div>
                              <Progress value={65} className="h-1 mt-2" />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="pt-2 border-t">
                        <h3 className="text-sm font-medium mb-2">Technical Explanation</h3>
                        <p className="text-sm text-muted-foreground">
                          The harmonic analysis uses chroma features to identify chord progressions and compare them
                          against a database of known compositions. While common chord progressions themselves are not
                          copyrightable, specific implementations with similar voicings, durations, and progressions can
                          indicate potential copyright issues. The analysis uses dynamic time warping (DTW) to account
                          for tempo differences when comparing harmonic sequences.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {matchedTracks.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Matched Tracks Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <p className="text-sm text-muted-foreground">
                        The following tracks were identified as potential copyright matches based on similarity
                        analysis. Each match is scored based on multiple factors including melodic, harmonic, and
                        rhythmic similarity.
                      </p>

                      {matchedTracks.map((track, index) => (
                        <div key={index} className="p-4 bg-muted rounded-lg space-y-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-lg">{track.title}</h3>
                              <div className="text-sm text-muted-foreground">
                                Artist: {track.artist} • Album: {track.album} ({track.releaseYear})
                              </div>
                              <div className="text-xs text-muted-foreground mt-1">
                                Label: {track.label} • Registration: {track.registrationNumber}
                              </div>
                            </div>
                            <Badge
                              variant={
                                track.similarity > 85 ? "destructive" : track.similarity > 75 ? "secondary" : "outline"
                              }
                              className="text-sm"
                            >
                              {track.similarity}% Match
                            </Badge>
                          </div>

                          <Progress
                            value={track.similarity}
                            className="h-2"
                            indicatorClassName={
                              track.similarity > 85
                                ? "bg-red-500"
                                : track.similarity > 75
                                  ? "bg-yellow-500"
                                  : "bg-blue-500"
                            }
                          />

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                            <div className="p-2 bg-black/10 rounded">
                              <div className="text-xs text-muted-foreground">Melodic Similarity</div>
                              <div className="font-medium">{Math.round(track.similarity * 0.9)}%</div>
                            </div>
                            <div className="p-2 bg-black/10 rounded">
                              <div className="text-xs text-muted-foreground">Harmonic Similarity</div>
                              <div className="font-medium">{Math.round(track.similarity * 1.1)}%</div>
                            </div>
                            <div className="p-2 bg-black/10 rounded">
                              <div className="text-xs text-muted-foreground">Rhythmic Similarity</div>
                              <div className="font-medium">{Math.round(track.similarity * 0.95)}%</div>
                            </div>
                          </div>

                          <div className="text-sm pt-2 border-t mt-2">
                            <div className="font-medium mb-1">Technical Analysis</div>
                            <p className="text-muted-foreground">
                              This match was identified using a combination of audio fingerprinting and feature-based
                              similarity analysis. The high similarity score indicates substantial overlap in musical
                              content that may constitute copyright infringement. Consider seeking legal advice or
                              licensing options if you plan to use this material.
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Technical Explanation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm">
                      Music plagiarism detection is a complex process that combines signal processing, machine learning,
                      and music theory. Our system follows a four-step approach:
                    </p>

                    <div className="space-y-3">
                      <div>
                        <h3 className="text-sm font-medium">1. Feature Extraction</h3>
                        <p className="text-sm text-muted-foreground">
                          We extract multiple musical features from the audio file, including:
                        </p>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                          <li>
                            <span className="font-medium">Melody:</span> Note sequences, pitch contours, and melodic
                            patterns
                          </li>
                          <li>
                            <span className="font-medium">Harmony:</span> Chord progressions, key signatures, and
                            harmonic structure
                          </li>
                          <li>
                            <span className="font-medium">Rhythm:</span> Beat patterns, tempo, time signatures, and
                            rhythmic motifs
                          </li>
                          <li>
                            <span className="font-medium">Timbre:</span> Spectral characteristics, instrumentation, and
                            sonic texture
                          </li>
                          <li>
                            <span className="font-medium">Lyrics:</span> Textual content and phonetic patterns (when
                            applicable)
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium">2. Preprocessing</h3>
                        <p className="text-sm text-muted-foreground">
                          The extracted features are converted into numerical representations that can be compared
                          mathematically:
                        </p>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                          <li>Spectrograms and chromagrams for visual and frequency analysis</li>
                          <li>Feature vectors for efficient comparison</li>
                          <li>Normalization to account for differences in recording quality, tempo, and key</li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium">3. Similarity Analysis</h3>
                        <p className="text-sm text-muted-foreground">
                          We compare the processed features against a database of copyrighted works using multiple
                          algorithms:
                        </p>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                          <li>
                            <span className="font-medium">Cosine Similarity:</span> Measures the angle between feature
                            vectors
                          </li>
                          <li>
                            <span className="font-medium">Dynamic Time Warping (DTW):</span> Aligns sequences that may
                            vary in speed or time
                          </li>
                          <li>
                            <span className="font-medium">Deep Learning Models:</span> Neural networks trained to
                            recognize similar musical patterns
                          </li>
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-sm font-medium">4. Decision Making</h3>
                        <p className="text-sm text-muted-foreground">
                          The final determination is made by comparing similarity scores against established thresholds:
                        </p>
                        <ul className="list-disc pl-5 text-sm text-muted-foreground space-y-1 mt-1">
                          <li>Scores above {thresholdValue + 10}% indicate likely copyright infringement</li>
                          <li>Scores below {thresholdValue - 10}% suggest original content</li>
                          <li>
                            Scores between {thresholdValue - 10}% and {thresholdValue + 10}% are considered inconclusive
                          </li>
                        </ul>
                      </div>
                    </div>

                    <div className="bg-muted p-3 rounded-md mt-4">
                      <p className="text-sm font-medium">Important Note</p>
                      <p className="text-sm text-muted-foreground">
                        This analysis is provided for informational purposes only and does not constitute legal advice.
                        Copyright law is complex and varies by jurisdiction. When in doubt, consult with a legal
                        professional specializing in intellectual property and copyright law.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  )
}
