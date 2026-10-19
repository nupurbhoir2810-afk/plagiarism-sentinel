"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"

interface AnimatedBackgroundProps {
  variant?: "default" | "waves" | "particles" | "gradient" | "grid"
  intensity?: "light" | "medium" | "strong"
  color?: string
  secondaryColor?: string
}

export default function AnimatedBackground({
  variant = "default",
  intensity = "medium",
  color,
  secondaryColor,
}: AnimatedBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Determine colors based on theme and props
    const isDark = theme === "dark"
    const primaryColor = color || (isDark ? "#3b82f6" : "#3b82f6")
    const secColor = secondaryColor || (isDark ? "#10b981" : "#10b981")

    // Intensity factors
    const intensityFactor = intensity === "light" ? 0.3 : intensity === "medium" ? 0.6 : 0.9

    // Animation variables
    let animationFrameId: number
    const particles: any[] = []
    let time = 0

    // Initialize particles for particle effect
    if (variant === "particles" || variant === "default") {
      const particleCount = Math.floor(window.innerWidth / 20) * intensityFactor

      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 2 + 1,
          color: Math.random() > 0.5 ? primaryColor : secColor,
          speed: Math.random() * 0.5 + 0.2,
          directionX: Math.random() * 2 - 1,
          directionY: Math.random() * 2 - 1,
          opacity: Math.random() * 0.5 + 0.1,
        })
      }
    }

    // Animation loop
    const animate = () => {
      time += 0.01
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Different animation based on variant
      switch (variant) {
        case "waves":
          drawWaves(ctx, canvas, time, primaryColor, secColor, intensityFactor)
          break
        case "gradient":
          drawGradient(ctx, canvas, time, primaryColor, secColor, intensityFactor)
          break
        case "grid":
          drawGrid(ctx, canvas, time, primaryColor, secColor, intensityFactor)
          break
        case "particles":
        case "default":
        default:
          drawParticles(ctx, canvas, time, particles, intensityFactor)
          break
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrameId)
    }
  }, [variant, intensity, color, secondaryColor, theme])

  return <canvas ref={canvasRef} className="fixed inset-0 -z-10 h-full w-full bg-transparent pointer-events-none" />
}

// Drawing functions
function drawParticles(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  time: number,
  particles: any[],
  intensityFactor: number,
) {
  // Draw connections between particles
  ctx.strokeStyle = `rgba(100, 100, 255, ${0.03 * intensityFactor})`
  ctx.lineWidth = 0.5

  for (let i = 0; i < particles.length; i++) {
    const p1 = particles[i]

    // Move particles
    p1.x += p1.directionX * p1.speed
    p1.y += p1.directionY * p1.speed

    // Bounce off edges
    if (p1.x < 0 || p1.x > canvas.width) p1.directionX *= -1
    if (p1.y < 0 || p1.y > canvas.height) p1.directionY *= -1

    // Draw particle
    ctx.beginPath()
    ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2)
    ctx.fillStyle = p1.color.replace(")", `, ${p1.opacity})`)
    ctx.fill()

    // Connect nearby particles
    for (let j = i + 1; j < particles.length; j++) {
      const p2 = particles[j]
      const dx = p1.x - p2.x
      const dy = p1.y - p2.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      if (distance < 100) {
        ctx.beginPath()
        ctx.moveTo(p1.x, p1.y)
        ctx.lineTo(p2.x, p2.y)
        ctx.stroke()
      }
    }
  }
}

function drawWaves(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  time: number,
  primaryColor: string,
  secondaryColor: string,
  intensityFactor: number,
) {
  const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
  gradient.addColorStop(0, primaryColor + "20")
  gradient.addColorStop(1, secondaryColor + "20")

  for (let i = 0; i < 5; i++) {
    ctx.beginPath()
    ctx.moveTo(0, canvas.height / 2)

    for (let x = 0; x < canvas.width; x++) {
      const frequency = 0.005 * intensityFactor
      const amplitude = 50 * intensityFactor
      const y =
        canvas.height / 2 +
        Math.sin(x * frequency + time + i) * amplitude +
        Math.sin(x * frequency * 2 + time + i * 0.5) * amplitude * 0.5

      ctx.lineTo(x, y)
    }

    ctx.lineTo(canvas.width, canvas.height)
    ctx.lineTo(0, canvas.height)
    ctx.closePath()
    ctx.fillStyle = gradient
    ctx.globalAlpha = 0.1 - i * 0.015
    ctx.fill()
    ctx.globalAlpha = 1
  }
}

function drawGradient(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  time: number,
  primaryColor: string,
  secondaryColor: string,
  intensityFactor: number,
) {
  const x = canvas.width / 2 + Math.cos(time * 0.2) * canvas.width * 0.3
  const y = canvas.height / 2 + Math.sin(time * 0.3) * canvas.height * 0.2

  const gradient = ctx.createRadialGradient(x, y, 0, x, y, canvas.width * intensityFactor)

  gradient.addColorStop(0, primaryColor + "30")
  gradient.addColorStop(0.5, secondaryColor + "20")
  gradient.addColorStop(1, "transparent")

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, canvas.width, canvas.height)
}

function drawGrid(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  time: number,
  primaryColor: string,
  secondaryColor: string,
  intensityFactor: number,
) {
  const gridSize = 30
  const lineWidth = 0.5

  ctx.strokeStyle = primaryColor + "20"
  ctx.lineWidth = lineWidth

  // Vertical lines
  for (let x = 0; x < canvas.width; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, canvas.height)
    ctx.stroke()
  }

  // Horizontal lines
  for (let y = 0; y < canvas.height; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(canvas.width, y)
    ctx.stroke()
  }

  // Animated dots at intersections
  ctx.fillStyle = secondaryColor + "40"

  for (let x = 0; x < canvas.width; x += gridSize) {
    for (let y = 0; y < canvas.height; y += gridSize) {
      const distance = Math.sqrt(Math.pow(x - canvas.width / 2, 2) + Math.pow(y - canvas.height / 2, 2))
      const size = (Math.sin(distance * 0.01 - time) + 1) * 2 * intensityFactor

      if (size > 0.5) {
        ctx.beginPath()
        ctx.arc(x, y, size, 0, Math.PI * 2)
        ctx.fill()
      }
    }
  }
}
