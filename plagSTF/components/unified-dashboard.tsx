"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import {
  FileCheck,
  Music,
  RefreshCcw,
  BookOpen,
  FileText,
  PenTool,
  FileSearch,
  BarChart3,
  Settings,
  History,
  Zap,
  BookMarked,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function UnifiedDashboard() {
  const [activeTab, setActiveTab] = useState("overview")
  const router = useRouter()

  const tools = [
    {
      id: "plagiarism-checker",
      name: "Document Plagiarism",
      description: "Scan documents for plagiarized content",
      icon: FileCheck,
      color: "text-green-500",
      path: "/tool/plagiarism-checker",
    },
    {
      id: "music-plagiarism",
      name: "Music Plagiarism",
      description: "Analyze audio files for copyright infringement",
      icon: Music,
      color: "text-purple-500",
      path: "/tool/music-plagiarism",
    },
    {
      id: "paraphrasing",
      name: "Paraphrasing Tool",
      description: "Rewrite content while preserving meaning",
      icon: RefreshCcw,
      color: "text-indigo-500",
      path: "/tool/paraphrasing",
    },
    {
      id: "story-generator",
      name: "Story Generator",
      description: "Create original narratives with AI",
      icon: BookOpen,
      color: "text-yellow-500",
      path: "/tool/story-generator",
    },
    {
      id: "text-summarizer",
      name: "Text Summarizer",
      description: "Generate concise summaries of long texts",
      icon: FileText,
      color: "text-orange-500",
      path: "/tool/text-summarizer",
    },
    {
      id: "ai-essay-writer",
      name: "AI Essay Writer",
      description: "Generate well-structured essays on any topic",
      icon: PenTool,
      color: "text-pink-500",
      path: "/tool/ai-essay-writer",
    },
    {
      id: "extract-text",
      name: "Extract Text",
      description: "Extract text from images with OCR",
      icon: FileSearch,
      color: "text-cyan-500",
      path: "/tool/extract-text",
    },
  ]

  const recentActivity = [
    { id: 1, tool: "Document Plagiarism", date: "2 hours ago", result: "12% similarity" },
    { id: 2, tool: "Music Plagiarism", date: "Yesterday", result: "No matches found" },
    { id: 3, tool: "AI Essay Writer", date: "3 days ago", result: "Essay generated" },
    { id: 4, tool: "Extract Text", date: "1 week ago", result: "98% accuracy" },
  ]

  return (
    <div className="container py-8 max-w-7xl mx-auto">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Plagiarism Detection Suite</h1>
            <p className="text-muted-foreground">Advanced tools for content originality and creation</p>
          </div>
          <div className="flex gap-4">
            <Button variant="outline" className="gap-2">
              <History className="h-4 w-4" />
              History
            </Button>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
            <Button className="gap-2">
              <Zap className="h-4 w-4" />
              New Analysis
            </Button>
          </div>
        </div>

        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tools">Tools</TabsTrigger>
            <TabsTrigger value="activity">Recent Activity</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Scans</CardTitle>
                  <FileCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">248</div>
                  <p className="text-xs text-muted-foreground">+12% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Avg. Similarity</CardTitle>
                  <BarChart3 className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">18.2%</div>
                  <p className="text-xs text-muted-foreground">-3.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Content Created</CardTitle>
                  <BookMarked className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">36</div>
                  <p className="text-xs text-muted-foreground">+8% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Accuracy Rate</CardTitle>
                  <Zap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">98.5%</div>
                  <p className="text-xs text-muted-foreground">+0.5% from last month</p>
                </CardContent>
              </Card>
            </div>

            <h2 className="text-xl font-semibold mt-6">Quick Access</h2>
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {tools.slice(0, 4).map((tool) => (
                <Card
                  key={tool.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push(tool.path)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <tool.icon className={`h-8 w-8 ${tool.color}`} />
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-end">
              <Button variant="outline" onClick={() => setActiveTab("tools")}>
                View All Tools
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="tools" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
              {tools.map((tool) => (
                <Card
                  key={tool.id}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => router.push(tool.path)}
                >
                  <CardContent className="p-6">
                    <div className="flex flex-col items-center text-center space-y-2">
                      <tool.icon className={`h-8 w-8 ${tool.color}`} />
                      <CardTitle className="text-lg">{tool.name}</CardTitle>
                      <CardDescription>{tool.description}</CardDescription>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your recent scans and content creation</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity.map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">{activity.tool}</p>
                        <p className="text-sm text-muted-foreground">{activity.date}</p>
                      </div>
                      <div>
                        <Badge variant="outline">{activity.result}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Saved Reports</CardTitle>
                <CardDescription>Access your saved analysis reports</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No saved reports yet</p>
                  <Button className="mt-4">Create New Report</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
