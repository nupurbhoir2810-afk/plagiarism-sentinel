// Utility functions for text similarity algorithms

/**
 * Calculate cosine similarity between two text documents
 * @param text1 First text document
 * @param text2 Second text document
 * @returns Similarity score between 0 and 1
 */
export function cosineSimilarity(text1: string, text2: string): number {
  // Tokenize and create term frequency vectors
  const words1 = text1.toLowerCase().split(/\s+/).filter(Boolean)
  const words2 = text2.toLowerCase().split(/\s+/).filter(Boolean)

  // Create term frequency maps
  const freqMap1: Record<string, number> = {}
  const freqMap2: Record<string, number> = {}

  words1.forEach((word) => {
    freqMap1[word] = (freqMap1[word] || 0) + 1
  })

  words2.forEach((word) => {
    freqMap2[word] = (freqMap2[word] || 0) + 1
  })

  // Get unique words from both documents
  const uniqueWords = new Set([...Object.keys(freqMap1), ...Object.keys(freqMap2)])

  // Calculate dot product and magnitudes
  let dotProduct = 0
  let magnitude1 = 0
  let magnitude2 = 0

  uniqueWords.forEach((word) => {
    const freq1 = freqMap1[word] || 0
    const freq2 = freqMap2[word] || 0

    dotProduct += freq1 * freq2
    magnitude1 += freq1 * freq1
    magnitude2 += freq2 * freq2
  })

  magnitude1 = Math.sqrt(magnitude1)
  magnitude2 = Math.sqrt(magnitude2)

  // Prevent division by zero
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0
  }

  return dotProduct / (magnitude1 * magnitude2)
}

/**
 * Calculate Jaccard similarity between two text documents
 * @param text1 First text document
 * @param text2 Second text document
 * @returns Similarity score between 0 and 1
 */
export function jaccardSimilarity(text1: string, text2: string): number {
  // Tokenize and create sets of words
  const words1 = new Set(text1.toLowerCase().split(/\s+/).filter(Boolean))
  const words2 = new Set(text2.toLowerCase().split(/\s+/).filter(Boolean))

  // Calculate intersection and union
  const intersection = new Set([...words1].filter((word) => words2.has(word)))
  const union = new Set([...words1, ...words2])

  // Prevent division by zero
  if (union.size === 0) {
    return 0
  }

  return intersection.size / union.size
}

/**
 * Calculate TF-IDF similarity between two text documents
 * @param text1 First text document
 * @param text2 Second text document
 * @param corpus Array of documents for IDF calculation
 * @returns Similarity score between 0 and 1
 */
export function tfIdfSimilarity(text1: string, text2: string, corpus: string[]): number {
  // Add the two documents to the corpus for IDF calculation
  const fullCorpus = [...corpus, text1, text2]

  // Tokenize documents
  const tokenizedCorpus = fullCorpus.map((doc) => doc.toLowerCase().split(/\s+/).filter(Boolean))

  // Calculate document frequency for each term
  const docFreq: Record<string, number> = {}
  const uniqueTermsPerDoc = tokenizedCorpus.map((tokens) => new Set(tokens))

  uniqueTermsPerDoc.forEach((terms) => {
    terms.forEach((term) => {
      docFreq[term] = (docFreq[term] || 0) + 1
    })
  })

  // Calculate IDF for each term
  const idf: Record<string, number> = {}
  const N = fullCorpus.length

  Object.keys(docFreq).forEach((term) => {
    idf[term] = Math.log(N / docFreq[term])
  })

  // Calculate TF-IDF vectors for the two documents
  const tokens1 = tokenizedCorpus[tokenizedCorpus.length - 2] // text1
  const tokens2 = tokenizedCorpus[tokenizedCorpus.length - 1] // text2

  const termFreq1: Record<string, number> = {}
  const termFreq2: Record<string, number> = {}

  tokens1.forEach((term) => {
    termFreq1[term] = (termFreq1[term] || 0) + 1
  })

  tokens2.forEach((term) => {
    termFreq2[term] = (termFreq2[term] || 0) + 1
  })

  // Normalize term frequencies
  const uniqueTerms = new Set([...tokens1, ...tokens2])
  const tfidf1: Record<string, number> = {}
  const tfidf2: Record<string, number> = {}

  uniqueTerms.forEach((term) => {
    const tf1 = termFreq1[term] || 0
    const tf2 = termFreq2[term] || 0

    tfidf1[term] = (tf1 / tokens1.length) * (idf[term] || 0)
    tfidf2[term] = (tf2 / tokens2.length) * (idf[term] || 0)
  })

  // Calculate cosine similarity between TF-IDF vectors
  let dotProduct = 0
  let magnitude1 = 0
  let magnitude2 = 0

  uniqueTerms.forEach((term) => {
    const val1 = tfidf1[term] || 0
    const val2 = tfidf2[term] || 0

    dotProduct += val1 * val2
    magnitude1 += val1 * val1
    magnitude2 += val2 * val2
  })

  magnitude1 = Math.sqrt(magnitude1)
  magnitude2 = Math.sqrt(magnitude2)

  // Prevent division by zero
  if (magnitude1 === 0 || magnitude2 === 0) {
    return 0
  }

  return dotProduct / (magnitude1 * magnitude2)
}

/**
 * Detect AI-generated content using heuristic analysis
 * @param text Text to analyze
 * @returns Probability of AI generation (0-1)
 */
export function detectAIContent(text: string): number {
  // In a real implementation, this would use a trained model
  // Here we use some heuristics that might indicate AI-generated text

  // Normalize text
  const normalizedText = text.toLowerCase()

  // Calculate metrics
  const avgWordLength = calculateAvgWordLength(normalizedText)
  const lexicalDiversity = calculateLexicalDiversity(normalizedText)
  const sentenceVariability = calculateSentenceVariability(text)
  const commonPhraseFrequency = calculateCommonPhraseFrequency(normalizedText)
  const repetitionScore = calculateRepetitionScore(normalizedText)

  // Combine metrics with weights
  const aiScore =
    avgWordLength * 0.15 +
    (1 - lexicalDiversity) * 0.25 +
    (1 - sentenceVariability) * 0.2 +
    commonPhraseFrequency * 0.2 +
    repetitionScore * 0.2

  // Normalize to 0-1 range
  return Math.min(1, Math.max(0, aiScore))
}

// Helper functions for AI detection

function calculateAvgWordLength(text: string): number {
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length === 0) return 0

  const totalLength = words.reduce((sum, word) => sum + word.length, 0)
  const avgLength = totalLength / words.length

  // Normalize: typical human writing has avg word length of 4-5 characters
  // Higher values might indicate more formal/technical/AI writing
  return Math.min(1, avgLength / 7)
}

function calculateLexicalDiversity(text: string): number {
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length === 0) return 0

  const uniqueWords = new Set(words)

  // Type-Token Ratio (TTR)
  return uniqueWords.size / words.length
}

function calculateSentenceVariability(text: string): number {
  const sentences = text.split(/[.!?]+/).filter((s) => s.trim().length > 0)
  if (sentences.length <= 1) return 0

  // Calculate sentence lengths
  const sentenceLengths = sentences.map((s) => s.trim().split(/\s+/).filter(Boolean).length)

  // Calculate standard deviation
  const mean = sentenceLengths.reduce((sum, len) => sum + len, 0) / sentenceLengths.length
  const variance = sentenceLengths.reduce((sum, len) => sum + Math.pow(len - mean, 2), 0) / sentenceLengths.length
  const stdDev = Math.sqrt(variance)

  // Normalize: higher variability (up to a point) is more human-like
  return Math.min(1, stdDev / 10)
}

function calculateCommonPhraseFrequency(text: string): number {
  // Common phrases or transitions often used by AI
  const commonPhrases = [
    "in conclusion",
    "it is important to note",
    "on the other hand",
    "in summary",
    "as a result",
    "it is worth mentioning",
    "it should be noted",
    "it is clear that",
    "in other words",
    "for instance",
  ]

  let count = 0
  commonPhrases.forEach((phrase) => {
    const regex = new RegExp(`\\b${phrase}\\b`, "gi")
    const matches = text.match(regex)
    if (matches) count += matches.length
  })

  // Normalize based on text length
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.min(1, count / (words / 100))
}

function calculateRepetitionScore(text: string): number {
  const words = text.split(/\s+/).filter(Boolean)
  if (words.length === 0) return 0

  // Count word frequencies
  const freqMap: Record<string, number> = {}
  words.forEach((word) => {
    freqMap[word] = (freqMap[word] || 0) + 1
  })

  // Calculate repetition score
  let repetitionSum = 0
  Object.values(freqMap).forEach((freq) => {
    if (freq > 1) {
      repetitionSum += freq - 1
    }
  })

  // Normalize
  return Math.min(1, repetitionSum / (words.length / 10))
}
