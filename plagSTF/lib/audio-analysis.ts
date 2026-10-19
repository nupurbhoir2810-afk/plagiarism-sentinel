// Utility functions for audio analysis and music plagiarism detection

/**
 * Extract MFCC features from audio data (mock implementation)
 * @param audioData Audio data buffer
 * @returns Array of MFCC features
 */
export function extractMFCCs(audioData: ArrayBuffer): number[][] {
  // In a real implementation, this would use signal processing libraries
  // to extract Mel-Frequency Cepstral Coefficients

  // Mock implementation that returns random MFCC-like features
  const numFrames = 100
  const numCoefficients = 13

  const mfccs: number[][] = []

  for (let i = 0; i < numFrames; i++) {
    const frame: number[] = []
    for (let j = 0; j < numCoefficients; j++) {
      // Generate values that would somewhat resemble MFCCs
      frame.push((Math.random() * 2 - 1) * 10)
    }
    mfccs.push(frame)
  }

  return mfccs
}

/**
 * Convert audio to spectrogram data (mock implementation)
 * @param audioData Audio data buffer
 * @returns Spectrogram data as 2D array
 */
export function audioToSpectrogram(audioData: ArrayBuffer): number[][] {
  // In a real implementation, this would use FFT to generate a spectrogram

  // Mock implementation that returns random spectrogram-like data
  const timeFrames = 100
  const frequencyBins = 128

  const spectrogram: number[][] = []

  for (let i = 0; i < timeFrames; i++) {
    const frame: number[] = []
    for (let j = 0; j < frequencyBins; j++) {
      // Generate values that would somewhat resemble a spectrogram
      // Lower frequencies tend to have higher energy
      const energy = Math.random() * Math.exp(-j / 30)
      frame.push(energy)
    }
    spectrogram.push(frame)
  }

  return spectrogram
}

/**
 * Calculate Dynamic Time Warping distance between two feature sequences
 * @param sequence1 First feature sequence
 * @param sequence2 Second feature sequence
 * @returns DTW distance (lower means more similar)
 */
export function dynamicTimeWarping(sequence1: number[][], sequence2: number[][]): number {
  const n = sequence1.length
  const m = sequence2.length

  // Initialize DTW matrix
  const dtw: number[][] = Array(n + 1)
    .fill(0)
    .map(() => Array(m + 1).fill(Number.POSITIVE_INFINITY))
  dtw[0][0] = 0

  // Calculate DTW matrix
  for (let i = 1; i <= n; i++) {
    for (let j = 1; j <= m; j++) {
      const cost = euclideanDistance(sequence1[i - 1], sequence2[j - 1])
      dtw[i][j] =
        cost +
        Math.min(
          dtw[i - 1][j], // insertion
          dtw[i][j - 1], // deletion
          dtw[i - 1][j - 1], // match
        )
    }
  }

  // Return normalized DTW distance
  return dtw[n][m] / (n + m)
}

/**
 * Calculate Euclidean distance between two feature vectors
 * @param vector1 First feature vector
 * @param vector2 Second feature vector
 * @returns Euclidean distance
 */
function euclideanDistance(vector1: number[], vector2: number[]): number {
  // Ensure vectors are of the same length
  const length = Math.min(vector1.length, vector2.length)

  let sum = 0
  for (let i = 0; i < length; i++) {
    sum += Math.pow(vector1[i] - vector2[i], 2)
  }

  return Math.sqrt(sum)
}

/**
 * Extract chroma features from audio (mock implementation)
 * @param audioData Audio data buffer
 * @returns Chroma features
 */
export function extractChromaFeatures(audioData: ArrayBuffer): number[][] {
  // In a real implementation, this would extract pitch class profiles
  // representing the 12 semitones of the musical octave

  // Mock implementation
  const numFrames = 100
  const numPitchClasses = 12

  const chromaFeatures: number[][] = []

  for (let i = 0; i < numFrames; i++) {
    const frame: number[] = []
    // Generate random energy distribution across pitch classes
    let total = 0
    for (let j = 0; j < numPitchClasses; j++) {
      const energy = Math.random()
      frame.push(energy)
      total += energy
    }
    // Normalize
    for (let j = 0; j < numPitchClasses; j++) {
      frame[j] /= total
    }
    chromaFeatures.push(frame)
  }

  return chromaFeatures
}

/**
 * Convert audio to MIDI-like representation (mock implementation)
 * @param audioData Audio data buffer
 * @returns Array of note events
 */
export function audioToMIDI(audioData: ArrayBuffer): Array<{
  note: number
  start: number
  duration: number
  velocity: number
}> {
  // In a real implementation, this would use pitch detection algorithms

  // Mock implementation that returns random note events
  const noteEvents = []
  const numNotes = 50 + Math.floor(Math.random() * 50)

  let currentTime = 0
  for (let i = 0; i < numNotes; i++) {
    const note = 36 + Math.floor(Math.random() * 48) // C2 to C6
    const duration = 0.1 + Math.random() * 0.9 // 0.1 to 1 second
    const velocity = 60 + Math.floor(Math.random() * 67) // 60 to 127

    noteEvents.push({
      note,
      start: currentTime,
      duration,
      velocity,
    })

    currentTime += duration * (0.8 + Math.random() * 0.4) // Some overlap or gap
  }

  return noteEvents
}

/**
 * Calculate similarity between two audio files based on multiple features
 * @param features1 Features from first audio
 * @param features2 Features from second audio
 * @returns Similarity score between 0 and 1
 */
export function calculateAudioSimilarity(
  features1: {
    mfccs: number[][]
    chroma: number[][]
    notes: Array<{ note: number; start: number; duration: number; velocity: number }>
  },
  features2: {
    mfccs: number[][]
    chroma: number[][]
    notes: Array<{ note: number; start: number; duration: number; velocity: number }>
  },
): {
  overall: number
  rhythmic: number
  melodic: number
  harmonic: number
} {
  // Calculate DTW distance for MFCCs (timbre similarity)
  const mfccDistance = dynamicTimeWarping(features1.mfccs, features2.mfccs)
  const mfccSimilarity = Math.max(0, 1 - mfccDistance / 10)

  // Calculate similarity for chroma features (harmonic similarity)
  const chromaDistance = dynamicTimeWarping(features1.chroma, features2.chroma)
  const chromaSimilarity = Math.max(0, 1 - chromaDistance / 5)

  // Calculate note pattern similarity (melodic similarity)
  const melodicSimilarity = calculateMelodicSimilarity(features1.notes, features2.notes)

  // Calculate rhythmic similarity
  const rhythmicSimilarity = calculateRhythmicSimilarity(features1.notes, features2.notes)

  // Combine similarities with weights
  const overallSimilarity =
    mfccSimilarity * 0.3 + chromaSimilarity * 0.3 + melodicSimilarity * 0.25 + rhythmicSimilarity * 0.15

  return {
    overall: overallSimilarity,
    rhythmic: rhythmicSimilarity,
    melodic: melodicSimilarity,
    harmonic: chromaSimilarity,
  }
}

/**
 * Calculate melodic similarity between two sets of note events
 * @param notes1 First set of note events
 * @param notes2 Second set of note events
 * @returns Similarity score between 0 and 1
 */
function calculateMelodicSimilarity(
  notes1: Array<{ note: number; start: number; duration: number; velocity: number }>,
  notes2: Array<{ note: number; start: number; duration: number; velocity: number }>,
): number {
  // Extract note sequences (ignoring timing)
  const sequence1 = notes1.map((n) => n.note)
  const sequence2 = notes2.map((n) => n.note)

  // Calculate longest common subsequence
  const lcs = longestCommonSubsequence(sequence1, sequence2)

  // Normalize by the length of the shorter sequence
  return lcs / Math.min(sequence1.length, sequence2.length)
}

/**
 * Calculate rhythmic similarity between two sets of note events
 * @param notes1 First set of note events
 * @param notes2 Second set of note events
 * @returns Similarity score between 0 and 1
 */
function calculateRhythmicSimilarity(
  notes1: Array<{ note: number; start: number; duration: number; velocity: number }>,
  notes2: Array<{ note: number; start: number; duration: number; velocity: number }>,
): number {
  // Extract onset patterns (note start times)
  const onsets1 = notes1.map((n) => n.start).sort((a, b) => a - b)
  const onsets2 = notes2.map((n) => n.start).sort((a, b) => a - b)

  // Convert to inter-onset intervals (time between consecutive notes)
  const ioi1 = []
  const ioi2 = []

  for (let i = 1; i < onsets1.length; i++) {
    ioi1.push(onsets1[i] - onsets1[i - 1])
  }

  for (let i = 1; i < onsets2.length; i++) {
    ioi2.push(onsets2[i] - onsets2[i - 1])
  }

  // Normalize IOIs
  const normalizeIOIs = (iois: number[]) => {
    const sum = iois.reduce((a, b) => a + b, 0)
    return iois.map((ioi) => ioi / sum)
  }

  const normalizedIOI1 = normalizeIOIs(ioi1)
  const normalizedIOI2 = normalizeIOIs(ioi2)

  // Calculate similarity using Earth Mover's Distance (simplified)
  const distance = calculateEMD(normalizedIOI1, normalizedIOI2)

  // Convert distance to similarity
  return Math.max(0, 1 - distance)
}

/**
 * Calculate Earth Mover's Distance (simplified)
 * @param dist1 First distribution
 * @param dist2 Second distribution
 * @returns EMD value
 */
function calculateEMD(dist1: number[], dist2: number[]): number {
  // Simplified EMD calculation
  // In a real implementation, this would use a proper EMD algorithm

  // Ensure distributions are of the same length
  const length = Math.min(dist1.length, dist2.length)
  const d1 = dist1.slice(0, length)
  const d2 = dist2.slice(0, length)

  // Calculate cumulative distributions
  const cdf1 = []
  const cdf2 = []

  let sum1 = 0
  let sum2 = 0

  for (let i = 0; i < length; i++) {
    sum1 += d1[i]
    sum2 += d2[i]
    cdf1.push(sum1)
    cdf2.push(sum2)
  }

  // Calculate EMD as the sum of absolute differences between CDFs
  let emd = 0
  for (let i = 0; i < length; i++) {
    emd += Math.abs(cdf1[i] - cdf2[i])
  }

  return emd / length
}

/**
 * Find the length of the longest common subsequence
 * @param seq1 First sequence
 * @param seq2 Second sequence
 * @returns Length of LCS
 */
function longestCommonSubsequence(seq1: number[], seq2: number[]): number {
  const m = seq1.length
  const n = seq2.length

  // Initialize LCS matrix
  const lcs: number[][] = Array(m + 1)
    .fill(0)
    .map(() => Array(n + 1).fill(0))

  // Fill LCS matrix
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (seq1[i - 1] === seq2[j - 1]) {
        lcs[i][j] = lcs[i - 1][j - 1] + 1
      } else {
        lcs[i][j] = Math.max(lcs[i - 1][j], lcs[i][j - 1])
      }
    }
  }

  return lcs[m][n]
}

/**
 * Mock function to simulate API call to music recognition service
 * @param audioData Audio data buffer
 * @returns Promise resolving to recognition results
 */
export async function recognizeMusicWithAPI(audioData: ArrayBuffer): Promise<{
  matches: Array<{
    title: string
    artist: string
    album: string
    releaseYear: number
    similarity: number
    isrc?: string
    label?: string
  }>
  confidence: number
}> {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 2000))

  // Generate mock results
  const numMatches = Math.floor(Math.random() * 3) + 1
  const matches = []

  const artists = [
    "The Melodic Minds",
    "Quantum Harmony",
    "Electric Echo",
    "Sonic Waves",
    "Rhythm Republic",
    "Harmonic Fusion",
    "Digital Orchestra",
    "Acoustic Alchemy",
  ]

  const albums = [
    "Soundscapes",
    "Harmonic Journey",
    "Rhythmic Patterns",
    "Melodic Visions",
    "Sonic Explorations",
    "Acoustic Dreams",
    "Digital Horizons",
    "Frequency Spectrum",
  ]

  for (let i = 0; i < numMatches; i++) {
    const similarity = 95 - i * 15 + Math.random() * 10

    matches.push({
      title: `Track ${Math.floor(Math.random() * 12) + 1}`,
      artist: artists[Math.floor(Math.random() * artists.length)],
      album: albums[Math.floor(Math.random() * albums.length)],
      releaseYear: 2010 + Math.floor(Math.random() * 13),
      similarity: Math.min(100, Math.max(0, similarity)),
      isrc: `US-S1Z-${10 + Math.floor(Math.random() * 10)}-00${Math.floor(Math.random() * 100)}`,
      label: ["Universal Music", "Sony Music", "Warner Music", "Independent"][Math.floor(Math.random() * 4)],
    })
  }

  return {
    matches: matches.sort((a, b) => b.similarity - a.similarity),
    confidence: matches[0]?.similarity || 0,
  }
}
