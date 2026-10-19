"use client"

import { useRef, useEffect } from "react"

interface SpectrogramProps {
  data: number[][]
  width?: number
  height?: number
  colorMap?: "inferno" | "viridis" | "magma" | "plasma"
}

export function Spectrogram({ data, width = 500, height = 200, colorMap = "inferno" }: SpectrogramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Get dimensions
    const timeFrames = data.length
    const frequencyBins = data[0].length

    // Calculate pixel dimensions
    const pixelWidth = canvas.width / timeFrames
    const pixelHeight = canvas.height / frequencyBins

    // Find min and max values for normalization
    let minVal = Number.POSITIVE_INFINITY
    let maxVal = Number.NEGATIVE_INFINITY

    for (let i = 0; i < timeFrames; i++) {
      for (let j = 0; j < frequencyBins; j++) {
        minVal = Math.min(minVal, data[i][j])
        maxVal = Math.max(maxVal, data[i][j])
      }
    }

    // Draw spectrogram
    for (let i = 0; i < timeFrames; i++) {
      for (let j = 0; j < frequencyBins; j++) {
        // Normalize value to 0-1 range
        const normalizedValue = (data[i][j] - minVal) / (maxVal - minVal)

        // Get color based on colormap
        const color = getColorFromMap(normalizedValue, colorMap)

        // Draw pixel
        ctx.fillStyle = color
        ctx.fillRect(
          i * pixelWidth,
          canvas.height - (j + 1) * pixelHeight, // Flip y-axis so low frequencies are at bottom
          pixelWidth,
          pixelHeight,
        )
      }
    }
  }, [data, width, height, colorMap])

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={width} height={height} className="w-full h-full rounded-md" />
      <div className="absolute left-0 top-0 h-full w-8 bg-gradient-to-r from-background to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-background to-transparent pointer-events-none" />
    </div>
  )
}

interface ChromagramProps {
  data: number[][]
  width?: number
  height?: number
}

export function Chromagram({ data, width = 500, height = 200 }: ChromagramProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !data || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Get dimensions
    const timeFrames = data.length
    const pitchClasses = data[0].length // Should be 12 for chromagram

    // Calculate pixel dimensions
    const pixelWidth = canvas.width / timeFrames
    const pixelHeight = canvas.height / pitchClasses

    // Note names for labels
    const noteNames = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

    // Draw chromagram
    for (let i = 0; i < timeFrames; i++) {
      for (let j = 0; j < pitchClasses; j++) {
        // Normalize value to 0-1 range (should already be normalized)
        const value = data[i][j]

        // Get color intensity
        const intensity = Math.floor(value * 255)
        const color = `rgb(${intensity}, ${Math.floor(intensity * 0.7)}, ${Math.floor(intensity * 0.4)})`

        // Draw pixel
        ctx.fillStyle = color
        ctx.fillRect(i * pixelWidth, j * pixelHeight, pixelWidth, pixelHeight)
      }
    }

    // Draw pitch class labels
    ctx.fillStyle = "rgba(255, 255, 255, 0.7)"
    ctx.font = "10px sans-serif"
    for (let j = 0; j < pitchClasses; j++) {
      ctx.fillText(noteNames[j], 5, j * pixelHeight + pixelHeight / 2 + 3)
    }
  }, [data, width, height])

  return (
    <div className="relative">
      <canvas ref={canvasRef} width={width} height={height} className="w-full h-full rounded-md" />
      <div className="absolute left-0 top-0 h-full w-16 bg-gradient-to-r from-background to-transparent pointer-events-none" />
    </div>
  )
}

interface WaveformProps {
  audioBuffer?: AudioBuffer
  peaks?: number[]
  width?: number
  height?: number
  color?: string
}

export function Waveform({ audioBuffer, peaks, width = 500, height = 100, color = "#22c55e" }: WaveformProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw waveform
    ctx.strokeStyle = color
    ctx.lineWidth = 1

    if (audioBuffer) {
      // Get audio data
      const channelData = audioBuffer.getChannelData(0) // Use first channel
      const step = Math.ceil(channelData.length / canvas.width)

      ctx.beginPath()
      for (let i = 0; i < canvas.width; i++) {
        const index = Math.floor(i * step)
        const value = channelData[index]

        const x = i
        const y = ((value + 1) * canvas.height) / 2 // Convert -1..1 to 0..height

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    } else if (peaks && peaks.length > 0) {
      // Use provided peak data
      const step = Math.ceil(peaks.length / canvas.width)

      ctx.beginPath()
      for (let i = 0; i < canvas.width; i++) {
        const index = Math.floor(i * step)
        const value = peaks[index]

        const x = i
        const y = (1 - value) * canvas.height // Assuming peaks are 0..1

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    } else {
      // Draw placeholder waveform
      ctx.beginPath()
      const segments = 100
      for (let i = 0; i < segments; i++) {
        const x = (i * canvas.width) / segments
        const y = canvas.height / 2 + ((Math.sin(i * 0.2) * canvas.height) / 4) * Math.random()

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      }
      ctx.stroke()
    }
  }, [audioBuffer, peaks, width, height, color])

  return <canvas ref={canvasRef} width={width} height={height} className="w-full h-full rounded-md" />
}

interface SimilarityMatrixProps {
  matrix: number[][]
  width?: number
  height?: number
  colorMap?: "inferno" | "viridis" | "magma" | "plasma"
}

export function SimilarityMatrix({ matrix, width = 300, height = 300, colorMap = "viridis" }: SimilarityMatrixProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !matrix || matrix.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Get dimensions
    const rows = matrix.length
    const cols = matrix[0].length

    // Calculate pixel dimensions
    const pixelWidth = canvas.width / cols
    const pixelHeight = canvas.height / rows

    // Find min and max values for normalization
    let minVal = Number.POSITIVE_INFINITY
    let maxVal = Number.NEGATIVE_INFINITY

    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        minVal = Math.min(minVal, matrix[i][j])
        maxVal = Math.max(maxVal, matrix[i][j])
      }
    }

    // Draw matrix
    for (let i = 0; i < rows; i++) {
      for (let j = 0; j < cols; j++) {
        // Normalize value to 0-1 range
        const normalizedValue = (matrix[i][j] - minVal) / (maxVal - minVal)

        // Get color based on colormap
        const color = getColorFromMap(normalizedValue, colorMap)

        // Draw pixel
        ctx.fillStyle = color
        ctx.fillRect(j * pixelWidth, i * pixelHeight, pixelWidth, pixelHeight)
      }
    }
  }, [matrix, width, height, colorMap])

  return <canvas ref={canvasRef} width={width} height={height} className="w-full h-full rounded-md" />
}

// Helper function to get color from colormap
function getColorFromMap(value: number, colorMap: "inferno" | "viridis" | "magma" | "plasma"): string {
  // Simple implementation of colormaps
  // In a real implementation, would use proper colormap libraries

  let r = 0
  let g = 0
  let b = 0

  switch (colorMap) {
    case "inferno":
      // Simplified inferno colormap
      r = Math.floor(255 * Math.min(1, value * 1.5))
      g = Math.floor(50 + 100 * value - 100 * value * value)
      b = Math.floor((100 * Math.max(0, value - 0.4)) / 0.6)
      break

    case "viridis":
      // Simplified viridis colormap
      r = Math.floor(70 * value)
      g = Math.floor(100 + 155 * value)
      b = Math.floor(180 - 100 * value)
      break

    case "magma":
      // Simplified magma colormap
      r = Math.floor(50 + 205 * value)
      g = Math.floor(30 + 100 * value - 100 * value * value)
      b = Math.floor(100 + (100 * Math.max(0, value - 0.5)) / 0.5)
      break

    case "plasma":
      // Simplified plasma colormap
      r = Math.floor(20 + 235 * value)
      g = Math.floor(20 + 200 * value - 200 * value * value)
      b = Math.floor(150 - 150 * value)
      break
  }

  return `rgb(${r}, ${g}, ${b})`
}
