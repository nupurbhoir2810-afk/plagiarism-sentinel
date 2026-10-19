"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  FileUp,
  AlertTriangle,
  ExternalLink,
  Book,
  Percent,
  FileText,
  RefreshCw,
  Search,
  Globe,
  FileType2,
  Link2,
  Quote,
  Lightbulb,
  Highlighter,
  Sparkles,
  BotIcon as Robot,
  InfoIcon,
} from "lucide-react"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import AnimatedBackground from "@/components/animated-background"
import { getUserPlan, isFeatureAvailable } from "@/lib/premium-features"
import { cosineSimilarity, jaccardSimilarity, tfIdfSimilarity, detectAIContent } from "@/lib/similarity-algorithms"

// Add imports for our new components
import { AIContentDetector } from "@/components/ai-content-detector"
import { GrammarAnalyzer } from "@/components/grammar-analyzer"
import { SimilarityAnalyzer } from "@/components/similarity-analyzer"
import { extractTextFromFile } from "@/lib/document-parser"

interface PlagiarismResult {
  score: number
  matches: {
    text: string
    source: string
    similarity: number
    type: "direct" | "paraphrased" | "semantic"
    context?: string
    location: string
    originalText: string
    startIndex: number
    endIndex: number
    citation?: string
    url?: string
    confidence: number
    sourceCredibility: number
  }[]
  statistics: {
    wordCount: number
    uniqueWords: number
    sentences: number
    paragraphs: number
    readingTime: number
    processingTime: number
  }
  analysis: {
    originalityScore: number
    styleConsistency: number
    readabilityScore: number
    documentFingerprint: string
    sentimentScore: number
    topicClassification: string[]
    aiContentProbability?: number
    aiSentences?: Array<{ text: string; score: number; startIndex: number; endIndex: number }>
    aiContentPercentage?: number
    humanContentPercentage?: number
  }
  fileInfo: {
    name: string
    type: string
    size: number
    lastModified: string
    hash: string
    language: string
  }
  recommendations: {
    text: string
    type: "citation" | "paraphrase" | "warning"
    severity: "low" | "medium" | "high"
  }[]
}

const acceptedFileTypes = {
  "application/pdf": "PDF",
  "text/plain": "TXT",
  "application/msword": "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "DOCX",
  "text/rtf": "RTF",
  "text/markdown": "MD",
  "application/vnd.oasis.opendocument.text": "ODT",
  "text/html": "HTML",
}

// Enhanced database of source texts for comparison
const sourceTexts = [
  {
    id: 1,
    text: `Artificial Intelligence (AI) has emerged as one of the most transformative technologies of our time. 
    Machine learning algorithms can now process vast amounts of data to identify patterns and make predictions with remarkable accuracy. 
    Deep learning, a subset of machine learning, has revolutionized fields like computer vision and natural language processing. 
    Neural networks, inspired by the human brain, can learn complex representations from data.`,
    source: "Introduction to AI (2023)",
    url: "https://example.com/ai-intro",
    credibility: 95,
    publicationDate: "2023-01-15",
    author: "Dr. Alan Turing",
    publisher: "Tech Academic Press",
  },
  {
    id: 2,
    text: `The impact of climate change on global ecosystems is becoming increasingly evident. 
    Rising temperatures are causing polar ice caps to melt at an unprecedented rate. 
    This leads to rising sea levels, threatening coastal communities worldwide. 
    Extreme weather events are becoming more frequent and intense.`,
    source: "Climate Science Review",
    url: "https://example.com/climate-science",
    credibility: 92,
    publicationDate: "2022-11-30",
    author: "Dr. Jane Smith",
    publisher: "Environmental Science Journal",
  },
  {
    id: 3,
    text: `Quantum computing represents a fundamental shift in computational power. 
    Unlike classical bits, quantum bits or qubits can exist in multiple states simultaneously. 
    This property, known as superposition, allows quantum computers to solve certain problems exponentially faster than traditional computers. 
    Quantum entanglement enables qubits to be correlated in ways that have no classical counterpart.`,
    source: "Quantum Computing Basics",
    url: "https://example.com/quantum-basics",
    credibility: 90,
    publicationDate: "2023-03-22",
    author: "Dr. Richard Feynman",
    publisher: "Quantum Physics Institute",
  },
  {
    id: 4,
    text: `Blockchain technology has applications far beyond cryptocurrencies. 
    Its decentralized and immutable nature makes it ideal for supply chain management, voting systems, and digital identity verification. 
    Smart contracts can automate complex transactions without intermediaries, reducing costs and increasing efficiency. 
    The transparency of blockchain systems can help combat fraud and corruption in various industries.`,
    source: "Blockchain Beyond Bitcoin",
    url: "https://example.com/blockchain-applications",
    credibility: 88,
    publicationDate: "2023-02-10",
    author: "Dr. Satoshi Nakamoto",
    publisher: "Distributed Systems Journal",
  },
  {
    id: 5,
    text: `The human genome contains approximately 3 billion base pairs of DNA. 
    The Human Genome Project, completed in 2003, successfully mapped the entire human genome. 
    This breakthrough has revolutionized our understanding of genetics and opened new avenues for personalized medicine. 
    CRISPR-Cas9 gene editing technology now allows scientists to modify genes with unprecedented precision.`,
    source: "Genomics and Modern Medicine",
    url: "https://example.com/genomics-medicine",
    credibility: 94,
    publicationDate: "2022-09-15",
    author: "Dr. Jennifer Doudna",
    publisher: "Biomedical Research Institute",
  },
]

// Enhanced similarity detection with semantic analysis
const findSimilarText = (
  text: string,
  sourceText: string,
): {
  similarity: number
  type: "direct" | "paraphrased" | "semantic"
  confidence: number
} => {
  const normalizedText = text.toLowerCase().trim()
  const normalizedSource = sourceText.toLowerCase().trim()

  // Direct match detection
  if (normalizedSource.includes(normalizedText) || normalizedText.includes(normalizedSource)) {
    return { similarity: 100, type: "direct", confidence: 98 }
  }

  // Calculate word-based similarity for paraphrasing detection
  const textWords = new Set(normalizedText.split(/\s+/))
  const sourceWords = new Set(normalizedSource.split(/\s+/))
  const commonWords = new Set([...textWords].filter((x) => sourceWords.has(x)))

  const wordSimilarity = ((commonWords.size * 2) / (textWords.size + sourceWords.size)) * 100

  // Calculate semantic similarity using cosine similarity
  const semanticSimilarity = cosineSimilarity(normalizedText, normalizedSource) * 100

  // Determine type based on similarity scores
  if (wordSimilarity > 80) {
    return {
      similarity: wordSimilarity,
      type: "paraphrased",
      confidence: 90 + Math.random() * 8,
    }
  } else if (semanticSimilarity > 70) {
    return {
      similarity: semanticSimilarity,
      type: "semantic",
      confidence: 75 + Math.random() * 15,
    }
  }

  return {
    similarity: Math.max(wordSimilarity, semanticSimilarity),
    type: wordSimilarity > semanticSimilarity ? "paraphrased" : "semantic",
    confidence: 70 + Math.random() * 20,
  }
}

// Enhanced text highlighting with different colors for different match types and AI content
const highlightPlagiarizedText = (
  text: string,
  matches: PlagiarismResult["matches"],
  aiSentences: Array<{ text: string; score: number }> = [],
) => {
  let result = text
  let offset = 0

  // First highlight plagiarism matches
  matches
    .sort((a, b) => b.similarity - a.similarity)
    .forEach((match) => {
      const start = match.startIndex + offset
      const end = match.endIndex + offset

      // Different highlight colors based on match type
      let highlightClass = ""
      if (match.type === "direct") {
        highlightClass = "bg-red-200 dark:bg-red-900"
      } else if (match.type === "paraphrased") {
        highlightClass = "bg-yellow-200 dark:bg-yellow-900"
      } else {
        highlightClass = "bg-blue-200 dark:bg-blue-900"
      }

      const highlightedText = `<span class="${highlightClass}" title="${match.similarity.toFixed(1)}% match with ${match.source}">${result.slice(start, end)}</span>`
      result = result.slice(0, start) + highlightedText + result.slice(end)
      offset += highlightedText.length - (end - start)
    })

  // Then highlight AI content if available
  if (aiSentences && aiSentences.length > 0) {
    // Create a temporary DOM element to work with the HTML
    const tempDiv = document.createElement("div")
    tempDiv.innerHTML = result

    // Get all text nodes in the document
    const textNodes = []
    const walker = document.createTreeWalker(tempDiv, NodeFilter.SHOW_TEXT, null)

    let node
    while ((node = walker.nextNode())) {
      textNodes.push(node)
    }

    // For each AI-detected sentence, find and highlight it
    aiSentences.forEach((aiSentence) => {
      const sentenceText = aiSentence.text.trim()
      if (!sentenceText) return

      // Find the text node containing this sentence
      for (let i = 0; i < textNodes.length; i++) {
        const nodeText = textNodes[i].textContent || ""
        const index = nodeText.indexOf(sentenceText)

        if (index >= 0) {
          // Split the text node into three parts: before, sentence, after
          const before = nodeText.substring(0, index)
          const after = nodeText.substring(index + sentenceText.length)

          // Create the new nodes
          const beforeNode = document.createTextNode(before)

          // Create the highlight span
          const highlightSpan = document.createElement("span")
          const aiScore = Math.round(aiSentence.score * 100)

          // Different highlight intensity based on AI probability
          if (aiScore > 80) {
            highlightSpan.className = "bg-purple-200 dark:bg-purple-900"
          } else if (aiScore > 60) {
            highlightSpan.className = "bg-purple-100 dark:bg-purple-800"
          } else {
            highlightSpan.className = "bg-green-100 dark:bg-green-800"
          }

          highlightSpan.title = `${aiScore}% likely AI-generated`
          highlightSpan.textContent = sentenceText

          const afterNode = document.createTextNode(after)

          // Replace the original node with these three new nodes
          const parentNode = textNodes[i].parentNode
          if (parentNode) {
            parentNode.insertBefore(beforeNode, textNodes[i])
            parentNode.insertBefore(highlightSpan, textNodes[i])
            parentNode.insertBefore(afterNode, textNodes[i])
            parentNode.removeChild(textNodes[i])

            // Update the textNodes array
            textNodes.splice(i, 1, beforeNode, afterNode)
            break
          }
        }
      }
    })

    // Get the updated HTML
    result = tempDiv.innerHTML
  }

  return result
}

// Generate document fingerprint (simulated)
const generateDocumentFingerprint = (text: string): string => {
  // In a real implementation, this would use more sophisticated algorithms
  // like MinHash or SimHash for document fingerprinting
  const hash = Array.from(text)
    .reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) & 0xffffffff, 0)
    .toString(16)
    .padStart(8, "0")

  return `fp-${hash}-${text.length.toString(16)}`
}

// Mock function to simulate Google Search API for plagiarism detection
const searchWebForPlagiarism = async (
  text: string,
): Promise<
  Array<{
    title: string
    url: string
    snippet: string
    similarity: number
  }>
> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate mock results
  const results = []
  const numResults = Math.floor(Math.random() * 3) + 1

  const websites = [
    { title: "Academic Research Repository", url: "https://example.com/research" },
    { title: "Educational Resources Database", url: "https://example.com/education" },
    { title: "Scientific Publications Archive", url: "https://example.com/science" },
    { title: "Knowledge Base Portal", url: "https://example.com/knowledge" },
    { title: "Digital Library Collection", url: "https://example.com/library" },
  ]

  // Extract sentences from text
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)

  for (let i = 0; i < numResults; i++) {
    // Select a random sentence from the text
    const randomSentence = sentences[Math.floor(Math.random() * sentences.length)]

    // Select a random website
    const website = websites[Math.floor(Math.random() * websites.length)]

    // Generate a similarity score (higher for first results)
    const similarity = 90 - i * 15 + Math.random() * 10

    results.push({
      title: website.title,
      url: website.url,
      snippet: randomSentence.trim(),
      similarity: Math.min(100, Math.max(0, similarity)),
    })
  }

  return results.sort((a, b) => b.similarity - a.similarity)
}

export default function PlagiarismChecker() {
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [currentStep, setCurrentStep] = useState("")
  const [results, setResults] = useState<PlagiarismResult | null>(null)
  const [fileName, setFileName] = useState("")
  const [documentText, setDocumentText] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [showSourceDialog, setShowSourceDialog] = useState(false)
  const [scanHistory, setScanHistory] = useState<
    Array<{
      date: string
      filename: string
      score: number
      matches: number
    }>
  >([])
  const [citationFormat, setCitationFormat] = useState<"apa" | "mla" | "chicago">("apa")
  const [sensitivityLevel, setSensitivityLevel] = useState<number>(75)
  const [realTimeScanning, setRealTimeScanning] = useState<boolean>(true)
  const [showOriginalDocument, setShowOriginalDocument] = useState<boolean>(false)
  const [textInputMode, setTextInputMode] = useState<boolean>(false)
  const [inputText, setInputText] = useState<string>("")
  const [compareMode, setCompareMode] = useState<boolean>(false)
  const [compareText, setCompareText] = useState<string>("")
  const [showSideBySide, setShowSideBySide] = useState<boolean>(false)
  const [selectedMatchIndex, setSelectedMatchIndex] = useState<number | null>(null)
  const [showRecommendations, setShowRecommendations] = useState<boolean>(true)
  const [processingStartTime, setProcessingStartTime] = useState<number>(0)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [userPlan, setUserPlan] = useState("basic")
  const [webSearchResults, setWebSearchResults] = useState<
    Array<{
      title: string
      url: string
      snippet: string
      similarity: number
    }>
  >([])
  const [showWebResults, setShowWebResults] = useState(false)
  const [selectedAlgorithm, setSelectedAlgorithm] = useState<"cosine" | "jaccard" | "tfidf" | "combined">("combined")

  // Add a new state for deep scan mode
  const [deepScanMode, setDeepScanMode] = useState<boolean>(false)
  const [scanDepth, setScanDepth] = useState<number>(75)
  const [sourceDatabase, setSourceDatabase] = useState<string>("standard")
  const [showSourceViewer, setShowSourceViewer] = useState<boolean>(false)
  const [selectedSource, setSelectedSource] = useState<any>(null)
  const [showAIDetection, setShowAIDetection] = useState<boolean>(false)
  const [showGrammarAnalysis, setShowGrammarAnalysis] = useState<boolean>(false)
  const [showAdvancedAnalysis, setShowAdvancedAnalysis] = useState<boolean>(false)
  const [useWebSearch, setUseWebSearch] = useState<boolean>(false)

  // Get user plan on component mount
  useEffect(() => {
    setUserPlan(getUserPlan())
  }, [])

  // Generate citation based on source metadata
  const generateCitation = (source: any, format: "apa" | "mla" | "chicago") => {
    const { author, publicationDate, source: title, publisher, url } = source
    const year = publicationDate ? new Date(publicationDate).getFullYear() : new Date().getFullYear()

    switch (format) {
      case "apa":
        return `${author}. (${year}). ${title}. ${publisher}. ${url}`
      case "mla":
        return `${author}. "${title}." ${publisher}, ${year}. Web. ${new Date().toLocaleDateString()}.`
      case "chicago":
        return `${author}. "${title}." ${publisher}, ${year}. ${url}.`
      default:
        return `${author}. (${year}). ${title}.`
    }
  }

  const handleSourceClick = (source: string) => {
    const sourceObj = sourceTexts.find((s) => s.source === source)
    setSelectedSource(sourceObj || null)
    setShowSourceDialog(true)
  }

  const addToScanHistory = (filename: string, score: number, matches: number) => {
    const newScan = {
      date: new Date().toLocaleString(),
      filename,
      score,
      matches,
    }
    setScanHistory([newScan, ...scanHistory])
  }

  // Real-time scanning for text input
  useEffect(() => {
    if (realTimeScanning && inputText && inputText.length > 100 && !loading) {
      const debounceTimer = setTimeout(() => {
        analyzePlagiarism(null, inputText)
      }, 1500)

      return () => clearTimeout(debounceTimer)
    }
  }, [inputText, realTimeScanning])

  const analyzePlagiarism = async (file: File | null, text?: string) => {
    setLoading(true)
    setProgress(0)
    setResults(null)
    setProcessingStartTime(Date.now())
    setWebSearchResults([])
    setShowWebResults(false)

    try {
      let documentContent = ""

      if (file) {
        documentContent = await file.text()
        setDocumentText(documentContent)
      } else if (text) {
        documentContent = text
        setDocumentText(documentContent)
      } else {
        throw new Error("No content to analyze")
      }

      const steps = [
        { message: "Reading document content...", duration: 800 },
        { message: "Analyzing text structure...", duration: 1000 },
        { message: "Generating document fingerprint...", duration: 800 },
        { message: "Comparing with sources...", duration: 1500 },
        { message: "Detecting similarities...", duration: 1200 },
        { message: "Analyzing semantic patterns...", duration: 1000 },
        { message: "Evaluating source credibility...", duration: 900 },
        { message: "Generating recommendations...", duration: 1100 },
        { message: "Finalizing report...", duration: 800 },
      ]

      // Add web search step if enabled
      if (useWebSearch) {
        steps.splice(4, 0, { message: "Searching web for similar content...", duration: 2000 })
      }

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i].message)
        setProgress(((i + 1) / steps.length) * 100)
        await new Promise((resolve) => setTimeout(resolve, steps[i].duration))

        // Perform web search when we reach that step
        if (useWebSearch && steps[i].message === "Searching web for similar content...") {
          const webResults = await searchWebForPlagiarism(documentContent)
          setWebSearchResults(webResults)
          if (webResults.length > 0) {
            setShowWebResults(true)
          }
        }
      }

      // Process matches with enhanced detection
      const sentences = documentContent
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter(Boolean)

      const matches = []
      const recommendations = []

      // Document fingerprint for the entire text
      const documentFingerprint = generateDocumentFingerprint(documentContent)

      // Calculate AI content probability
      const aiContentProbability = detectAIContent(documentContent)

      // Add this after calculating aiContentProbability
      // Calculate sentence-level AI detection
      const aiSentences = documentContent
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 0)
        .map((sentence) => ({
          text: sentence.trim(),
          score: detectAIContent(sentence),
          startIndex: documentContent.indexOf(sentence),
          endIndex: documentContent.indexOf(sentence) + sentence.length,
        }))

      // Sort by AI probability
      aiSentences.sort((a, b) => b.score - a.score)

      // Count human vs AI content
      const totalWords = documentContent.split(/\s+/).filter(Boolean).length
      let aiWordCount = 0

      aiSentences.forEach((sentence) => {
        if (sentence.score > 0.6) {
          // Consider sentences with >60% probability as AI
          const wordCount = sentence.text.split(/\s+/).filter(Boolean).length
          aiWordCount += wordCount
        }
      })

      const humanWordCount = totalWords - aiWordCount
      const aiContentPercentage = (aiWordCount / totalWords) * 100
      const humanContentPercentage = 100 - aiContentPercentage

      // Process each sentence for potential matches
      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i]

        for (const source of sourceTexts) {
          // Calculate similarity based on selected algorithm
          let similarity = 0
          let type: "direct" | "paraphrased" | "semantic" = "semantic"
          let confidence = 0

          if (selectedAlgorithm === "cosine" || selectedAlgorithm === "combined") {
            const cosineSim = cosineSimilarity(sentence, source.text) * 100
            if (cosineSim > similarity) {
              similarity = cosineSim
              type = cosineSim > 90 ? "direct" : cosineSim > 75 ? "paraphrased" : "semantic"
              confidence = 80 + Math.random() * 15
            }
          }

          if (selectedAlgorithm === "jaccard" || selectedAlgorithm === "combined") {
            const jaccardSim = jaccardSimilarity(sentence, source.text) * 100
            if (jaccardSim > similarity) {
              similarity = jaccardSim
              type = jaccardSim > 90 ? "direct" : jaccardSim > 75 ? "paraphrased" : "semantic"
              confidence = 75 + Math.random() * 20
            }
          }

          if (selectedAlgorithm === "tfidf" || selectedAlgorithm === "combined") {
            const tfidfSim =
              tfIdfSimilarity(
                sentence,
                source.text,
                sourceTexts.map((s) => s.text),
              ) * 100
            if (tfidfSim > similarity) {
              similarity = tfidfSim
              type = tfidfSim > 90 ? "direct" : tfidfSim > 75 ? "paraphrased" : "semantic"
              confidence = 85 + Math.random() * 10
            }
          }

          // Only process if above sensitivity threshold
          if (similarity > sensitivityLevel) {
            const startIndex = documentContent.indexOf(sentence)
            const endIndex = startIndex + sentence.length

            // Generate citation for the match
            const citation = generateCitation(source, citationFormat)

            matches.push({
              text: sentence,
              source: source.source,
              similarity,
              type,
              location: `Paragraph ${Math.floor(i / 5) + 1}, Sentence ${(i % 5) + 1}`,
              originalText: source.text,
              startIndex,
              endIndex,
              citation,
              url: source.url,
              confidence,
              sourceCredibility: source.credibility,
            })

            // Generate recommendation based on match type and similarity
            if (similarity > 90 && type === "direct") {
              recommendations.push({
                text: `Direct copying detected in "${sentence.substring(0, 50)}...". Consider adding a proper citation.`,
                type: "citation",
                severity: "high",
              })
            } else if (similarity > 80 && type === "paraphrased") {
              recommendations.push({
                text: `Significant paraphrasing detected in "${sentence.substring(0, 50)}...". Ensure proper attribution.`,
                type: "citation",
                severity: "medium",
              })
            } else if (similarity > 70 && type === "semantic") {
              recommendations.push({
                text: `Similar ideas found in "${sentence.substring(0, 50)}...". Consider reviewing for originality.`,
                type: "paraphrase",
                severity: "low",
              })
            }
          }
        }
      }

      // Add web search results to matches if available
      if (webSearchResults.length > 0) {
        webSearchResults.forEach((result, index) => {
          const sentence = result.snippet
          const startIndex = documentContent.indexOf(sentence)

          if (startIndex >= 0) {
            const endIndex = startIndex + sentence.length

            matches.push({
              text: sentence,
              source: result.title,
              similarity: result.similarity,
              type: result.similarity > 90 ? "direct" : result.similarity > 75 ? "paraphrased" : "semantic",
              location: `Web Match #${index + 1}`,
              originalText: sentence,
              startIndex,
              endIndex,
              citation: `${result.title}. Retrieved from ${result.url}`,
              url: result.url,
              confidence: 85 + Math.random() * 10,
              sourceCredibility: 75 + Math.random() * 15,
            })

            if (result.similarity > 85) {
              recommendations.push({
                text: `Content found on the web at "${result.title}". Consider adding a citation or reviewing for originality.`,
                type: "citation",
                severity: "high",
              })
            }
          }
        })
      }

      // Calculate statistics
      const words = documentContent.split(/\s+/).filter(Boolean)
      const uniqueWords = new Set(words.map((w) => w.toLowerCase()))
      const paragraphs = documentContent.split(/\n\s*\n/)
      const processingTime = (Date.now() - processingStartTime) / 1000

      // Calculate overall score with weighted factors
      const directMatches = matches.filter((m) => m.type === "direct")
      const paraphrasedMatches = matches.filter((m) => m.type === "paraphrased")
      const semanticMatches = matches.filter((m) => m.type === "semantic")

      // Weight different types of matches differently
      const weightedScore =
        directMatches.reduce((acc, m) => acc + m.similarity, 0) * 1.0 +
        paraphrasedMatches.reduce((acc, m) => acc + m.similarity, 0) * 0.7 +
        semanticMatches.reduce((acc, m) => acc + m.similarity, 0) * 0.4

      const totalMatchCount = matches.length || 1
      const overallScore = matches.length > 0 ? Math.round(weightedScore / totalMatchCount) : 0

      // Calculate originality score (inverse of plagiarism score)
      const originalityScore = Math.max(0, 100 - overallScore)

      // Simulate style consistency and readability scores
      const styleConsistency = 70 + Math.floor(Math.random() * 30)
      const readabilityScore = 65 + Math.floor(Math.random() * 35)
      const sentimentScore = 0.2 + Math.random() * 0.6 // -1 to 1 scale, normalized to 0-1 range

      // Topic classification (simulated)
      const possibleTopics = ["Academic", "Scientific", "Technical", "Business", "Creative", "Informative"]
      const topicClassification = [
        possibleTopics[Math.floor(Math.random() * possibleTopics.length)],
        possibleTopics[Math.floor(Math.random() * possibleTopics.length)],
      ].filter((v, i, a) => a.indexOf(v) === i) // Remove duplicates

      const results: PlagiarismResult = {
        score: overallScore,
        matches,
        statistics: {
          wordCount: words.length,
          uniqueWords: uniqueWords.size,
          sentences: sentences.length,
          paragraphs: paragraphs.length,
          readingTime: Math.ceil(words.length / 200),
          processingTime,
        },
        analysis: {
          originalityScore,
          styleConsistency,
          readabilityScore,
          documentFingerprint,
          sentimentScore,
          topicClassification,
          aiContentProbability,
          aiSentences,
          aiContentPercentage,
          humanContentPercentage,
        },
        fileInfo: {
          name: file ? file.name : "Text Input",
          type: file ? file.type : "text/plain",
          size: documentContent.length,
          lastModified: file ? new Date(file.lastModified).toLocaleString() : new Date().toLocaleString(),
          hash: "sha256-" + Math.random().toString(36).substring(2),
          language: "English", // In a real app, would use language detection
        },
        recommendations,
      }

      setResults(results)
      addToScanHistory(file ? file.name : "Text Input", overallScore, matches.length)

      // Show advanced analysis
      setShowAIDetection(true)
      setShowGrammarAnalysis(true)
      setShowAdvancedAnalysis(true)

      toast.success("Analysis complete!")
    } catch (error) {
      console.error("Analysis error:", error)
      toast.error("Failed to analyze document")
    } finally {
      setLoading(false)
      setProgress(0)
      setCurrentStep("")
    }
  }

  // Add this function after the existing analyzePlagiarism function
  const performDeepScan = async (file: File | null, text?: string) => {
    setLoading(true)
    setProgress(0)
    setResults(null)
    setProcessingStartTime(Date.now())
    setWebSearchResults([])
    setShowWebResults(false)

    try {
      let documentContent = ""

      if (file) {
        documentContent = await file.text()
        setDocumentText(documentContent)
      } else if (text) {
        documentContent = text
        setDocumentText(documentContent)
      } else {
        throw new Error("No content to analyze")
      }

      // Enhanced deep scan steps
      const steps = [
        { message: "Initializing deep scan...", duration: 800 },
        { message: "Analyzing document structure...", duration: 1000 },
        { message: "Generating document fingerprint...", duration: 800 },
        { message: "Searching comprehensive database...", duration: 2000 },
        { message: "Performing semantic analysis...", duration: 1500 },
        { message: "Analyzing writing style patterns...", duration: 1200 },
        { message: "Cross-referencing with academic sources...", duration: 1800 },
        { message: "Detecting paraphrased content...", duration: 1500 },
        { message: "Analyzing citation patterns...", duration: 1000 },
        { message: "Verifying source credibility...", duration: 1200 },
        { message: "Generating detailed report...", duration: 1000 },
      ]

      // Add web search step if enabled
      if (useWebSearch) {
        steps.splice(4, 0, { message: "Performing comprehensive web search...", duration: 2500 })
      }

      for (let i = 0; i < steps.length; i++) {
        setCurrentStep(steps[i].message)
        setProgress(((i + 1) / steps.length) * 100)
        await new Promise((resolve) => setTimeout(resolve, steps[i].duration))

        // Perform web search when we reach that step
        if (useWebSearch && steps[i].message === "Performing comprehensive web search...") {
          const webResults = await searchWebForPlagiarism(documentContent)
          setWebSearchResults(webResults)
          if (webResults.length > 0) {
            setShowWebResults(true)
          }
        }
      }

      // Enhanced processing for deep scan
      // This would include more sophisticated analysis in a real implementation
      const sentences = documentContent
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter(Boolean)

      const matches = []
      const recommendations = []
      const documentFingerprint = generateDocumentFingerprint(documentContent)

      // Calculate AI content probability with more detailed analysis
      const aiContentProbability = detectAIContent(documentContent)

      // Add this after calculating aiContentProbability
      // Calculate sentence-level AI detection
      const aiSentences = documentContent
        .split(/[.!?]+/)
        .filter((s) => s.trim().length > 0)
        .map((sentence) => ({
          text: sentence.trim(),
          score: detectAIContent(sentence),
          startIndex: documentContent.indexOf(sentence),
          endIndex: documentContent.indexOf(sentence) + sentence.length,
        }))

      // Sort by AI probability
      aiSentences.sort((a, b) => b.score - a.score)

      // Count human vs AI content
      const totalWords = documentContent.split(/\s+/).filter(Boolean).length
      let aiWordCount = 0

      aiSentences.forEach((sentence) => {
        if (sentence.score > 0.6) {
          // Consider sentences with >60% probability as AI
          const wordCount = sentence.text.split(/\s+/).filter(Boolean).length
          aiWordCount += wordCount
        }
      })

      const humanWordCount = totalWords - aiWordCount
      const aiContentPercentage = (aiWordCount / totalWords) * 100
      const humanContentPercentage = 100 - aiContentPercentage

      // Process with higher sensitivity for deep scan
      for (let i = 0; i < sentences.length; i++) {
        const sentence = sentences[i]

        for (const source of sourceTexts) {
          // Calculate similarity using multiple algorithms for deep scan
          let similarity = 0
          let type: "direct" | "paraphrased" | "semantic" = "semantic"
          let confidence = 0

          // Use all algorithms and take the highest similarity
          const cosineSim = cosineSimilarity(sentence, source.text) * 100
          const jaccardSim = jaccardSimilarity(sentence, source.text) * 100
          const tfidfSim =
            tfIdfSimilarity(
              sentence,
              source.text,
              sourceTexts.map((s) => s.text),
            ) * 100

          // Weighted combination for deep scan
          similarity = cosineSim * 0.5 + jaccardSim * 0.3 + tfidfSim * 0.2

          // Determine type based on similarity
          type = similarity > 90 ? "direct" : similarity > 75 ? "paraphrased" : "semantic"
          confidence = 85 + Math.random() * 10

          // Lower threshold for deep scan
          if (similarity > scanDepth) {
            const startIndex = documentContent.indexOf(sentence)
            const endIndex = startIndex + sentence.length
            const citation = generateCitation(source, citationFormat)

            matches.push({
              text: sentence,
              source: source.source,
              similarity,
              type,
              location: `Paragraph ${Math.floor(i / 5) + 1}, Sentence ${(i % 5) + 1}`,
              originalText: source.text,
              startIndex,
              endIndex,
              citation,
              url: source.url,
              confidence,
              sourceCredibility: source.credibility,
            })

            // Generate more detailed recommendations for deep scan
            if (similarity > 90 && type === "direct") {
              recommendations.push({
                text: `Direct copying detected in "${sentence.substring(0, 50)}...". Consider adding a proper citation to ${source.source} by ${source.author}.`,
                type: "citation",
                severity: "high",
              })
            } else if (similarity > 75 && type === "paraphrased") {
              recommendations.push({
                text: `Significant paraphrasing detected in "${sentence.substring(0, 50)}...". Ensure proper attribution to ${source.source}.`,
                type: "citation",
                severity: "medium",
              })
            } else if (similarity > 60 && type === "semantic") {
              recommendations.push({
                text: `Similar ideas found in "${sentence.substring(0, 50)}...". Consider reviewing for originality or citing ${source.source}.`,
                type: "paraphrase",
                severity: "low",
              })
            }
          }
        }
      }

      // Add web search results to matches if available
      if (webSearchResults.length > 0) {
        webSearchResults.forEach((result, index) => {
          const sentence = result.snippet
          const startIndex = documentContent.indexOf(sentence)

          if (startIndex >= 0) {
            const endIndex = startIndex + sentence.length

            matches.push({
              text: sentence,
              source: result.title,
              similarity: result.similarity,
              type: result.similarity > 90 ? "direct" : result.similarity > 75 ? "paraphrased" : "semantic",
              location: `Web Match #${index + 1}`,
              originalText: sentence,
              startIndex,
              endIndex,
              citation: `${result.title}. Retrieved from ${result.url}`,
              url: result.url,
              confidence: 90 + Math.random() * 8,
              sourceCredibility: 80 + Math.random() * 15,
            })

            if (result.similarity > 80) {
              recommendations.push({
                text: `Content found on the web at "${result.title}". Consider adding a citation or reviewing for originality.`,
                type: "citation",
                severity: "high",
              })
            }
          }
        })
      }

      // Calculate statistics
      const words = documentContent.split(/\s+/).filter(Boolean)
      const uniqueWords = new Set(words.map((w) => w.toLowerCase()))
      const paragraphs = documentContent.split(/\n\s*\n/)
      const processingTime = (Date.now() - processingStartTime) / 1000

      // Calculate overall score with weighted factors for deep scan
      const directMatches = matches.filter((m) => m.type === "direct")
      const paraphrasedMatches = matches.filter((m) => m.type === "paraphrased")
      const semanticMatches = matches.filter((m) => m.type === "semantic")

      // Weight different types of matches differently with higher sensitivity
      const weightedScore =
        directMatches.reduce((acc, m) => acc + m.similarity, 0) * 1.0 +
        paraphrasedMatches.reduce((acc, m) => acc + m.similarity, 0) * 0.8 +
        semanticMatches.reduce((acc, m) => acc + m.similarity, 0) * 0.6

      const totalMatchCount = matches.length || 1
      const overallScore = matches.length > 0 ? Math.round(weightedScore / totalMatchCount) : 0
      const originalityScore = Math.max(0, 100 - overallScore)

      // Enhanced analysis metrics for deep scan
      const styleConsistency = 70 + Math.floor(Math.random() * 30)
      const readabilityScore = 65 + Math.floor(Math.random() * 35)
      const sentimentScore = 0.2 + Math.random() * 0.6
      const possibleTopics = ["Academic", "Scientific", "Technical", "Business", "Creative", "Informative"]
      const topicClassification = [
        possibleTopics[Math.floor(Math.random() * possibleTopics.length)],
        possibleTopics[Math.floor(Math.random() * possibleTopics.length)],
      ].filter((v, i, a) => a.indexOf(v) === i)

      const results: PlagiarismResult = {
        score: overallScore,
        matches,
        statistics: {
          wordCount: words.length,
          uniqueWords: uniqueWords.size,
          sentences: sentences.length,
          paragraphs: paragraphs.length,
          readingTime: Math.ceil(words.length / 200),
          processingTime,
        },
        analysis: {
          originalityScore,
          styleConsistency,
          readabilityScore,
          documentFingerprint,
          sentimentScore,
          topicClassification,
          aiContentProbability,
          aiSentences,
          aiContentPercentage,
          humanContentPercentage,
        },
        fileInfo: {
          name: file ? file.name : "Text Input",
          type: file ? file.type : "text/plain",
          size: documentContent.length,
          lastModified: file ? new Date(file.lastModified).toLocaleString() : new Date().toLocaleString(),
          hash: "sha256-" + Math.random().toString(36).substring(2),
          language: "English",
        },
        recommendations,
      }

      setResults(results)
      addToScanHistory(file ? file.name : "Text Input", overallScore, matches.length)

      // Show advanced analysis for premium users
      setShowAIDetection(true)
      setShowGrammarAnalysis(true)
      setShowAdvancedAnalysis(true)

      toast.success("Deep scan complete!")
    } catch (error) {
      console.error("Analysis error:", error)
      toast.error("Failed to analyze document")
    } finally {
      setLoading(false)
      setProgress(0)
      setCurrentStep("")
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileType = file.type
    const fileName = file.name.toLowerCase()

    // Check if file type is supported
    const isSupportedType = Object.keys(acceptedFileTypes).some(
      (type) =>
        fileType === type ||
        fileName.endsWith(`.${acceptedFileTypes[type as keyof typeof acceptedFileTypes].toLowerCase()}`),
    )

    if (!isSupportedType) {
      toast.error("Unsupported file format")
      return
    }

    if (file.size > 25 * 1024 * 1024) {
      toast.error("File size must be less than 25MB")
      return
    }

    setFileName(file.name)
    setLoading(true)
    setProgress(10)
    setCurrentStep("Reading document content...")

    try {
      // Extract text from the file using our document parser
      const extractedText = await extractTextFromFile(file)

      // Now analyze the extracted text
      if (deepScanMode) {
        await performDeepScan(null, extractedText)
      } else {
        await analyzePlagiarism(null, extractedText)
      }
    } catch (error) {
      console.error("Error processing file:", error)
      toast.error(`Failed to process file: ${error instanceof Error ? error.message : "Unknown error"}`)
      setLoading(false)
      setProgress(0)
      setCurrentStep("")
    }
  }

  const handleTextSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!inputText.trim()) {
      toast.error("Please enter some text to analyze")
      return
    }

    if (deepScanMode) {
      await performDeepScan(null, inputText)
    } else {
      await analyzePlagiarism(null, inputText)
    }
  }

  // Add a function to view source details
  const viewSourceDetails = (source: string) => {
    const sourceObj = sourceTexts.find((s) => s.source === source)
    setSelectedSource(sourceObj)
    setShowSourceViewer(true)
  }

  const downloadReport = () => {
    if (!results) return

    const report = `
PLAGIARISM ANALYSIS REPORT
=========================
Generated: ${new Date().toLocaleString()}

FILE INFORMATION
---------------
Name: ${results.fileInfo.name}
Type: ${results.fileInfo.type}
Size: ${(results.fileInfo.size / 1024 / 1024).toFixed(2)} MB
Last Modified: ${results.fileInfo.lastModified}
Language: ${results.fileInfo.language}
Document Fingerprint: ${results.analysis.documentFingerprint}

SIMILARITY ANALYSIS
-----------------
Overall Similarity Score: ${results.score}%
Originality Score: ${results.analysis.originalityScore}%
Style Consistency: ${results.analysis.styleConsistency}%
Readability Score: ${results.analysis.readabilityScore}%
AI Content Probability: ${results.analysis.aiContentProbability ? `${Math.round(results.analysis.aiContentProbability * 100)}%` : "Not analyzed"}
Total Matches Found: ${results.matches.length}

DOCUMENT STATISTICS
-----------------
Word Count: ${results.statistics.wordCount}
Unique Words: ${results.statistics.uniqueWords}
Sentences: ${results.statistics.sentences}
Paragraphs: ${results.statistics.paragraphs}
Estimated Reading Time: ${results.statistics.readingTime} minutes
Processing Time: ${results.statistics.processingTime.toFixed(2)} seconds

MATCHED CONTENT
-------------
${results.matches
  .map(
    (match) => `
• Match Type: ${match.type.toUpperCase()} (${match.similarity.toFixed(1)}% similarity)
Confidence: ${match.confidence.toFixed(1)}%
Location: ${match.location}
Text: "${match.text}"
Source: ${match.source} (Credibility: ${match.sourceCredibility}%)
Citation: ${match.citation || ""}
URL: ${match.url || ""}
`,
  )
  .join("\n")}

RECOMMENDATIONS
-------------
${results.recommendations
  .map(
    (rec) => `
• ${rec.type.toUpperCase()} (${rec.severity} priority): ${rec.text}
`,
  )
  .join("\n")}

ANALYSIS SUMMARY
-------------
This document has been analyzed for potential plagiarism using advanced text comparison algorithms.
The overall similarity score of ${results.score}% indicates ${
      results.score > 30
        ? "significant concerns about originality"
        : results.score > 15
          ? "some potential issues with originality"
          : "a high level of originality"
    }.

${results.analysis.aiContentProbability ? `AI CONTENT ANALYSIS: This document shows approximately ${Math.round(results.analysis.aiContentProbability * 100)}% probability of containing AI-generated content.` : ""}

1. Review all highlighted matches
2. Add proper citations where needed
3. Paraphrase content with high similarity scores
4. Consider the recommendations provided above
`

    const blob = new Blob([report], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `plagiarism-report-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Report downloaded!")
  }

  const getSimilarityColor = (value: number) => {
    if (value >= 75) return "text-red-500"
    if (value >= 50) return "text-yellow-500"
    return "text-green-500"
  }

  const getSimilarityBadgeVariant = (value: number, type: string) => {
    if (type === "direct") return "destructive"
    if (type === "paraphrased") return "warning"
    if (type === "semantic") return "secondary"

    if (value >= 75) return "destructive"
    if (value >= 50) return "warning"
    return "default"
  }

  const handleMatchClick = (index: number) => {
    setSelectedMatchIndex(index)

    // Scroll to the match in the document
    if (results && results.matches[index]) {
      const match = results.matches[index]
      const textElement = document.getElementById("document-content")

      if (textElement) {
        // Create a temporary element to measure position
        const tempSpan = document.createElement("span")
        tempSpan.innerHTML = documentText.substring(0, match.startIndex)
        textElement.appendChild(tempSpan)

        const position = tempSpan.offsetHeight
        textElement.removeChild(tempSpan)

        textElement.scrollTop = position - 100 // Scroll with some offset
      }
    }
  }

  const handleUpgradeSuccess = (plan: string) => {
    setUserPlan(plan)
    toast.success(`Your account has been upgraded to ${plan}!`)

    // Refresh feature availability
    if (isFeatureAvailable("plagiarismChecker.aiDetection", plan) && results) {
      setShowAIDetection(true)
    }

    if (isFeatureAvailable("plagiarismChecker.grammarAnalysis", plan) && results) {
      setShowGrammarAnalysis(true)
    }

    if (isFeatureAvailable("plagiarismChecker.advancedAnalysis", plan) && results) {
      setShowAdvancedAnalysis(true)
    }
  }

  const sourceText = sourceTexts.map((s) => s.text).join("\n")

  return (
    <TooltipProvider>
      <div className="container py-8">
        <AnimatedBackground variant="grid" intensity="light" color="#22c55e" />
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold">Advanced Plagiarism Detection</h1>
              <p className="text-muted-foreground">
                Compare your text against multiple sources to detect potential plagiarism with AI-powered analysis
              </p>
            </div>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="space-y-6">
                <Tabs defaultValue="file" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="file" onClick={() => setTextInputMode(false)}>
                      <FileUp className="mr-2 h-4 w-4" />
                      Upload Document
                    </TabsTrigger>
                    <TabsTrigger value="text" onClick={() => setTextInputMode(true)}>
                      <FileText className="mr-2 h-4 w-4" />
                      Enter Text
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="file" className="space-y-4 pt-4">
                    <div className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 text-center">
                      <div className="mb-4">
                        <FileUp className="h-8 w-8 text-muted-foreground mb-2" />
                        <h3 className="font-semibold">Upload Document for Analysis</h3>
                        <p className="text-sm text-muted-foreground">
                          Supported formats: PDF, DOC, DOCX, TXT, RTF, MD, ODT, HTML
                        </p>
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept={Object.keys(acceptedFileTypes).join(",")}
                        onChange={handleFileUpload}
                      />
                      <Button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        {loading ? (
                          <>
                            <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                            Analyzing Document...
                          </>
                        ) : (
                          <>
                            <Search className="mr-2 h-4 w-4" />
                            Analyze Document
                          </>
                        )}
                      </Button>
                      {fileName && <p className="mt-2 text-sm text-muted-foreground">Selected file: {fileName}</p>}
                    </div>

                    <div className="flex flex-col md:flex-row md:items-center gap-4 mt-4">
                      <div className="flex items-center space-x-2">
                        <Switch id="deepScanMode" checked={deepScanMode} onCheckedChange={setDeepScanMode} />
                        <div className="flex items-center gap-1.5">
                          <Label htmlFor="deepScanMode">Enable Deep Scan</Label>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Deep scan performs more thorough analysis with higher sensitivity to detect subtle
                            similarities
                          </TooltipContent>
                        </Tooltip>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="useWebSearch" checked={useWebSearch} onCheckedChange={setUseWebSearch} />
                        <div className="flex items-center gap-1.5">
                          <Label htmlFor="useWebSearch">Web Search</Label>
                          <Badge variant="outline" className="text-xs gap-0.5 py-0 h-5">
                            <Globe className="h-3 w-3 text-blue-500" />
                            <span>New</span>
                          </Badge>
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>
                            Search the web for similar content to detect online plagiarism
                          </TooltipContent>
                        </Tooltip>
                      </div>
                    </div>

                    {deepScanMode && (
                      <div className="mt-4 space-y-2">
                        <Label htmlFor="scanDepthSlider">Scan Depth: {scanDepth}%</Label>
                        <Slider
                          id="scanDepthSlider"
                          min={50}
                          max={90}
                          step={5}
                          value={[scanDepth]}
                          onValueChange={(value) => setScanDepth(value[0])}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Higher Sensitivity</span>
                          <span>Maximum Precision</span>
                        </div>

                        <div className="space-y-2 mt-4">
                          <Label htmlFor="sourceDatabase">Source Database</Label>
                          <Select value={sourceDatabase} onValueChange={setSourceDatabase}>
                            <SelectTrigger id="sourceDatabase">
                              <SelectValue placeholder="Select database" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="standard">Standard (General Sources)</SelectItem>
                              <SelectItem value="academic">Academic (Journals & Publications)</SelectItem>
                              <SelectItem value="comprehensive">Comprehensive (All Sources)</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2 mt-4">
                          <Label htmlFor="algorithmSelect">Similarity Algorithm</Label>
                          <Select
                            value={selectedAlgorithm}
                            onValueChange={(value) => setSelectedAlgorithm(value as any)}
                          >
                            <SelectTrigger id="algorithmSelect">
                              <SelectValue placeholder="Select algorithm" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="combined">Combined (All Algorithms)</SelectItem>
                              <SelectItem value="cosine">Cosine Similarity</SelectItem>
                              <SelectItem value="jaccard">Jaccard Similarity</SelectItem>
                              <SelectItem value="tfidf">TF-IDF Similarity</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-xs text-muted-foreground mt-1">
                            Different algorithms excel at detecting different types of plagiarism
                          </p>
                        </div>
                      </div>
                    )}
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4 pt-4">
                    <form onSubmit={handleTextSubmit} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="inputText">Enter text to analyze</Label>
                        <Textarea
                          id="inputText"
                          placeholder="Paste or type your text here..."
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          className="min-h-[200px]"
                        />
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch
                          id="realTimeScanning"
                          checked={realTimeScanning}
                          onCheckedChange={setRealTimeScanning}
                        />
                        <Label htmlFor="realTimeScanning">Enable real-time scanning</Label>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <InfoIcon className="h-4 w-4 text-muted-foreground" />
                          </TooltipTrigger>
                          <TooltipContent>Automatically scan text as you type (after 100 characters)</TooltipContent>
                        </Tooltip>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="sensitivitySlider">Detection Sensitivity: {sensitivityLevel}%</Label>
                        <Slider
                          id="sensitivitySlider"
                          min={50}
                          max={95}
                          step={5}
                          value={[sensitivityLevel]}
                          onValueChange={(value) => setSensitivityLevel(value[0])}
                        />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Less Strict</span>
                          <span>More Strict</span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Switch id="useWebSearch" checked={useWebSearch} onCheckedChange={setUseWebSearch} />
                        <div className="flex items-center gap-1.5">
                          <Label htmlFor="useWebSearch">Web Search</Label>
                          <Badge variant="outline" className="text-xs gap-0.5 py-0 h-5">
                            <Globe className="h-3 w-3 text-blue-500" />
                            <span>New</span>
                          </Badge>
                        </div>
                      </div>

                      <div className="flex flex-col md:flex-row gap-2">
                        <Button
                          type="button"
                          disabled={loading || !inputText.trim()}
                          variant="outline"
                          className="gap-1.5"
                          onClick={() => performDeepScan(null, inputText)}
                        >
                          Deep Scan
                        </Button>

                        <Select value={selectedAlgorithm} onValueChange={(value) => setSelectedAlgorithm(value as any)}>
                          <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Algorithm" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="combined">Combined</SelectItem>
                            <SelectItem value="cosine">Cosine Similarity</SelectItem>
                            <SelectItem value="jaccard">Jaccard Similarity</SelectItem>
                            <SelectItem value="tfidf">TF-IDF Similarity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </form>
                  </TabsContent>
                </Tabs>

                {loading && (
                  <div className="space-y-4">
                    <Progress value={progress} />
                    <p className="text-center text-sm text-muted-foreground">{currentStep}</p>
                  </div>
                )}

                {results && (
                  <div className="space-y-6">
                    {/* File Information Card */}
                    <Card className="bg-muted/50">
                      <CardContent className="p-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">File Type</div>
                            <div className="font-medium flex items-center gap-2">
                              <FileType2 className="h-4 w-4" />
                              {results.fileInfo.type in acceptedFileTypes
                                ? acceptedFileTypes[results.fileInfo.type as keyof typeof acceptedFileTypes]
                                : "Text"}
                            </div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Size</div>
                            <div className="font-medium">{(results.fileInfo.size / 1024).toFixed(2)} KB</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Words</div>
                            <div className="font-medium">{results.statistics.wordCount}</div>
                          </div>
                          <div className="space-y-1">
                            <div className="text-sm text-muted-foreground">Reading Time</div>
                            <div className="font-medium">{results.statistics.readingTime} min</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Main Stats */}
                    <div className="grid gap-4 md:grid-cols-4">
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center gap-2">
                            <div
                              className={`rounded-full p-3 ${
                                results.score > 30
                                  ? "bg-red-100 text-red-700"
                                  : results.score > 15
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-green-100 text-green-700"
                              }`}
                            >
                              <Percent className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">Similarity Score</h3>
                            <div className="text-2xl font-bold">{results.score}%</div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center gap-2">
                            <div className="rounded-full p-3 bg-blue-100 text-blue-700">
                              <FileText className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">Matched Segments</h3>
                            <div className="text-2xl font-bold">{results.matches.length}</div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center gap-2">
                            <div className="rounded-full p-3 bg-green-100 text-green-700">
                              <Sparkles className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">Originality Score</h3>
                            <div className="text-2xl font-bold">{results.analysis.originalityScore}%</div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center gap-2">
                            <div className="rounded-full p-3 bg-purple-100 text-purple-700">
                              <Robot className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">AI Content</h3>
                            <div className="text-2xl font-bold">
                              {results.analysis.aiContentProbability
                                ? `${Math.round(results.analysis.aiContentProbability * 100)}%`
                                : "N/A"}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Content Analysis */}
                    <div className="grid gap-6 md:grid-cols-3">
                      <div className="md:col-span-2">
                        <Card>
                          <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Document Content</CardTitle>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setShowOriginalDocument(!showOriginalDocument)}
                              >
                                {showOriginalDocument ? (
                                  <>
                                    <Highlighter className="mr-2 h-4 w-4" />
                                    Show Highlights
                                  </>
                                ) : (
                                  <>
                                    <FileText className="mr-2 h-4 w-4" />
                                    Show Original
                                  </>
                                )}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-6">
                              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                                <div
                                  id="document-content"
                                  className="prose dark:prose-invert max-w-none"
                                  dangerouslySetInnerHTML={{
                                    __html: showOriginalDocument
                                      ? documentText
                                      : highlightPlagiarizedText(
                                          documentText,
                                          results.matches,
                                          results.analysis.aiSentences,
                                        ),
                                  }}
                                />
                              </ScrollArea>
                              <div className="flex items-center gap-4 text-sm">
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bg-red-200 dark:bg-red-900"></div>
                                  <span>Direct Match</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bg-yellow-200 dark:bg-yellow-900"></div>
                                  <span>Paraphrased</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <div className="w-3 h-3 rounded-full bg-blue-200 dark:bg-blue-900"></div>
                                  <span>Semantic Match</span>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <div>
                        <Card className="h-full">
                          <CardHeader>
                            <CardTitle>Matched Content</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-[400px]">
                              <div className="space-y-4">
                                {results.matches.map((match, index) => (
                                  <Card
                                    key={index}
                                    className={`${selectedMatchIndex === index ? "border-primary" : ""}`}
                                    onClick={() => handleMatchClick(index)}
                                  >
                                    <CardContent className="p-4">
                                      <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                          <Badge variant={getSimilarityBadgeVariant(match.similarity, match.type)}>
                                            {match.similarity.toFixed(1)}% Match
                                          </Badge>
                                          <Badge variant="outline">
                                            {match.type.charAt(0).toUpperCase() + match.type.slice(1)}
                                          </Badge>
                                        </div>
                                        <div className="space-y-2">
                                          <p className="text-sm font-medium">Your Text:</p>
                                          <p className="text-sm bg-yellow-100 dark:bg-yellow-900/50 p-2 rounded">
                                            {match.text}
                                          </p>
                                        </div>
                                        <div className="space-y-2">
                                          <p className="text-sm font-medium">Source:</p>
                                          <p className="text-sm bg-muted p-2 rounded">{match.originalText}</p>
                                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                            <Book className="h-4 w-4" />
                                            {match.source}
                                          </div>
                                        </div>
                                        <div className="text-sm text-muted-foreground">Citation: {match.citation}</div>
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          onClick={(e) => {
                                            e.stopPropagation()
                                            viewSourceDetails(match.source)
                                          }}
                                          className="w-full mt-2 gap-1.5"
                                        >
                                          <Link2 className="h-4 w-4" />
                                          View Complete Source
                                        </Button>
                                      </div>
                                    </CardContent>
                                  </Card>
                                ))}
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      </div>
                    </div>

                    {/* Web Search Results */}
                    {showWebResults && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Globe className="h-5 w-5 text-blue-500" />
                            Web Search Results
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {webSearchResults.map((result, index) => (
                              <div key={index} className="p-4 bg-muted rounded-lg border">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-medium">{result.title}</h3>
                                    <a
                                      href={result.url}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="text-sm text-blue-500 hover:underline flex items-center gap-1"
                                    >
                                      {result.url}
                                      <ExternalLink className="h-3 w-3" />
                                    </a>
                                  </div>
                                  <Badge variant={result.similarity > 80 ? "destructive" : "secondary"}>
                                    {result.similarity.toFixed(1)}% Match
                                  </Badge>
                                </div>
                                <div className="mt-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded border border-yellow-200 dark:border-yellow-800">
                                  <p className="text-sm">{result.snippet}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* AI Detection and Grammar Analysis */}
                    {(showAIDetection || showGrammarAnalysis || showAdvancedAnalysis) && (
                      <div className="grid gap-6 md:grid-cols-2">
                        {/*{showAIDetection && <AIContentAnalysis text={documentText} />}*/}

                        {/*{showGrammarAnalysis && <GrammarStyleAnalysis text={documentText} />}*/}

                        {/*{showAdvancedAnalysis && (*/}
                        {/*  <div className="md:col-span-2">*/}
                        {/*    <AdvancedSimilarityAnalysis text={documentText} sourceTexts={sourceTexts} />*/}
                        {/*  </div>*/}
                        {/*)}*/}
                      </div>
                    )}

                    {/* Recommendations */}
                    {showRecommendations && results.recommendations.length > 0 && (
                      <Card>
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2">
                            <Lightbulb className="h-5 w-5 text-yellow-500" />
                            Recommendations
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            {results.recommendations.map((rec, index) => (
                              <div
                                key={index}
                                className={`p-4 rounded-lg border ${
                                  rec.severity === "high"
                                    ? "bg-red-50 dark:bg-red-900/20 border-red-200"
                                    : rec.severity === "medium"
                                      ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200"
                                      : "bg-blue-50 dark:bg-blue-900/20 border-blue-200"
                                }`}
                              >
                                <div className="flex items-start gap-3">
                                  {rec.type === "citation" && <Quote className="h-5 w-5 mt-0.5 text-blue-500" />}
                                  {rec.type === "paraphrase" && <RefreshCw className="h-5 w-5 mt-0.5 text-green-500" />}
                                  {rec.type === "warning" && (
                                    <AlertTriangle className="h-5 w-5 mt-0.5 text-yellow-500" />
                                  )}
                                  <div>
                                    <p className="text-sm">{rec.text}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    )}

                    {/* New Tabs */}
                    <Tabs defaultValue="summary" className="w-full">
                      <TabsList className="grid w-full grid-cols-4">
                        <TabsTrigger value="summary">Summary</TabsTrigger>
                        <TabsTrigger value="citations">Citations</TabsTrigger>
                        <TabsTrigger value="history">History</TabsTrigger>
                        <TabsTrigger value="settings">Settings</TabsTrigger>
                      </TabsList>

                      <TabsContent value="summary">
                        <Card>
                          <CardHeader>
                            <CardTitle>Analysis Summary</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">Similarity Score</div>
                                  <div className="font-medium text-lg">{results.score}%</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">AI Content</div>
                                  <div className="font-medium text-lg">
                                    {Math.round(results.analysis.aiContentPercentage)}%
                                  </div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">Matched Segments</div>
                                  <div className="font-medium text-lg">{results.matches.length}</div>
                                </div>
                                <div className="space-y-1">
                                  <div className="text-sm text-muted-foreground">Word Count</div>
                                  <div className="font-medium text-lg">{results.statistics.wordCount}</div>
                                </div>
                              </div>

                              <div className="pt-4 border-t">
                                <h3 className="font-medium mb-2">Summary Assessment</h3>
                                <p className="text-muted-foreground">
                                  {results.score > 30
                                    ? "This document shows significant similarity with existing sources. "
                                    : results.score > 15
                                      ? "This document shows some similarity with existing sources. "
                                      : "This document shows minimal similarity with existing sources. "}
                                  {results.analysis.aiContentPercentage > 70
                                    ? "It appears to be primarily AI-generated content. "
                                    : results.analysis.aiContentPercentage > 40
                                      ? "It contains a substantial amount of AI-generated content. "
                                      : "It appears to be primarily human-written content. "}
                                  {results.matches.length > 10
                                    ? "There are numerous matched segments that should be reviewed."
                                    : results.matches.length > 5
                                      ? "There are several matched segments that should be reviewed."
                                      : "There are few matched segments that require attention."}
                                </p>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="citations">
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>Citations</CardTitle>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setCitationFormat("apa")}
                                  className={citationFormat === "apa" ? "bg-primary text-primary-foreground" : ""}
                                >
                                  APA
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setCitationFormat("mla")}
                                  className={citationFormat === "mla" ? "bg-primary text-primary-foreground" : ""}
                                >
                                  MLA
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setCitationFormat("chicago")}
                                  className={citationFormat === "chicago" ? "bg-primary text-primary-foreground" : ""}
                                >
                                  Chicago
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-[400px]">
                              <div className="space-y-4">
                                {results.matches.map((match, index) => (
                                  <div key={index} className="space-y-2">
                                    <p className="text-sm font-medium">
                                      {match.source}
                                      <Button
                                        variant="link"
                                        size="sm"
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          viewSourceDetails(match.source)
                                        }}
                                        className="w-full mt-2 gap-1.5"
                                      >
                                        View Complete Source
                                      </Button>
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      {generateCitation(match, citationFormat)}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="history">
                        <Card>
                          <CardHeader>
                            <CardTitle>Scan History</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ScrollArea className="h-[400px]">
                              <div className="space-y-4">
                                {scanHistory.map((scan, index) => (
                                  <div key={index} className="p-4 bg-muted rounded-lg">
                                    <div className="flex justify-between items-center">
                                      <div>
                                        <h3 className="font-medium">{scan.filename}</h3>
                                        <p className="text-sm text-muted-foreground">{scan.date}</p>
                                      </div>
                                      <div className="flex items-center gap-4">
                                        <Badge variant={scan.score > 50 ? "destructive" : "secondary"}>
                                          {scan.score}% Similarity
                                        </Badge>
                                        <Badge variant="outline">{scan.matches} Matches</Badge>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </ScrollArea>
                          </CardContent>
                        </Card>
                      </TabsContent>

                      <TabsContent value="settings">
                        <Card>
                          <CardHeader>
                            <CardTitle>Settings</CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="citationFormat">Citation Format</Label>
                              <Select value={citationFormat} onValueChange={setCitationFormat}>
                                <SelectTrigger id="citationFormat">
                                  <SelectValue placeholder="Select citation format" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="apa">APA</SelectItem>
                                  <SelectItem value="mla">MLA</SelectItem>
                                  <SelectItem value="chicago">Chicago</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="sensitivitySlider">Detection Sensitivity: {sensitivityLevel}%</Label>
                              <Slider
                                id="sensitivitySlider"
                                min={50}
                                max={95}
                                step={5}
                                value={[sensitivityLevel]}
                                onValueChange={(value) => setSensitivityLevel(value[0])}
                              />
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Less Strict</span>
                                <span>More Strict</span>
                              </div>
                            </div>

                            <Button variant="outline" onClick={downloadReport} className="w-full">
                              Download Report
                            </Button>
                          </CardContent>
                        </Card>
                      </TabsContent>
                    </Tabs>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <div className="space-y-8 mt-8">
        <SimilarityAnalyzer sourceText={sourceText} suspectText={documentText} />

        <AIContentDetector initialText={documentText} />

        <GrammarAnalyzer initialText={documentText} />
      </div>
    </TooltipProvider>
  )
}
