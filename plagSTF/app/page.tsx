"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  FileCheck,
  RefreshCcw,
  BookOpen,
  FileText,
  PenTool,
  FileSearch,
  ArrowRight,
  Zap,
  Music,
  Code,
} from "lucide-react"
import { useState } from "react"
import ApiDocsModal from "@/components/api-docs-modal"
import { motion } from "framer-motion"
import AnimatedBackground from "@/components/animated-background"

export default function HomePage() {
  const [isApiModalOpen, setIsApiModalOpen] = useState(false)
  const tools = [
    {
      title: "Plagiarism Checker",
      description: "Check your content for originality",
      icon: FileCheck,
      href: "/tool/plagiarism-checker",
      color: "text-green-500",
    },
    {
      title: "Music Plagiarism",
      description: "Compare audio files for similarity",
      icon: Music,
      href: "/tool/music-plagiarism",
      color: "text-purple-500",
    },
    {
      title: "Paraphrasing Tool",
      description: "Rewrite content in different styles",
      icon: RefreshCcw,
      href: "/tool/paraphrasing",
      color: "text-indigo-500",
    },
    {
      title: "Story Generator",
      description: "Create engaging stories with AI",
      icon: BookOpen,
      href: "/tool/story-generator",
      color: "text-yellow-500",
    },
    {
      title: "Text Summarizer",
      description: "Get concise summaries instantly",
      icon: FileText,
      href: "/tool/text-summarizer",
      color: "text-orange-500",
    },
    {
      title: "AI Essay Writer",
      description: "Generate well-structured essays",
      icon: PenTool,
      href: "/tool/ai-essay-writer",
      color: "text-pink-500",
    },
    {
      title: "Extract Text From Image",
      description: "Convert images to editable text",
      icon: FileSearch,
      href: "/tool/extract-text",
      color: "text-cyan-500",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      {/* Animated Background */}
      <AnimatedBackground variant="particles" intensity="medium" color="#3b82f6" secondaryColor="#10b981" />

      {/* Hero Section */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter animate-fade-up sm:text-4xl md:text-5xl lg:text-6xl">
                AI-Powered Content Analysis
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 animate-fade-up animation-delay-100">
                Advanced plagiarism detection and content analysis tools powered by cutting-edge AI technology.
              </p>
            </div>
            <div className="space-x-4 animate-fade-up animation-delay-200">
              <Link href="/login">
                <Button className="gap-2 hover:scale-105 transition-transform bg-green-500 hover:bg-green-600 button-shine">
                  Get Started <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="#features">
                <Button variant="outline" className="gap-2 hover:scale-105 transition-transform">
                  View Tools <Zap className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Grid */}
      <section id="features" className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool, index) => (
              <motion.div
                key={tool.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link href={tool.href}>
                  <Card className="h-full transition-all hover:scale-105 hover:shadow-lg group animate-glow">
                    <CardHeader>
                      <tool.icon className={`h-8 w-8 ${tool.color} transition-transform group-hover:scale-110`} />
                      <CardTitle>{tool.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{tool.description}</p>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API Section */}
      <section className="py-20 bg-muted/50 relative">
        <AnimatedBackground variant="gradient" intensity="light" color="#22c55e" secondaryColor="#3b82f6" />
        <div className="container px-4 md:px-6 relative z-10">
          <div className="grid gap-12 lg:grid-cols-2">
            <div className="space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter">Powerful APIs for Developers</h2>
              <p className="text-lg text-muted-foreground">
                Integrate our AI-powered content analysis tools directly into your applications.
              </p>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-6">
                    <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                      <code className="text-sm">
                        {`fetch('https://api.plagsentinel.com/v1/analyze', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    text: 'Content to analyze'
  })
})`}
                      </code>
                    </pre>
                  </CardContent>
                </Card>
                <Button
                  className="gap-2 bg-green-500 hover:bg-green-600 button-shine"
                  onClick={() => setIsApiModalOpen(true)}
                >
                  <Code className="h-4 w-4" />
                  View API Documentation
                </Button>
              </div>
            </div>
            <div className="grid gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>REST API Features</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span>Plagiarism Detection</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span>Content Analysis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span>Text Processing</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span>AI-Powered Generation</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>SDK Support</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span>JavaScript / TypeScript</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span>Python</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span>Java</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 bg-green-500 rounded-full" />
                    <span>PHP</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
      <ApiDocsModal isOpen={isApiModalOpen} onClose={() => setIsApiModalOpen(false)} />
    </div>
  )
}
