"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { BarChart, FileText, LogOut, Music, PieChart } from "lucide-react"
import AnimatedBackground from "@/components/animated-background"

interface UserData {
  username: string
  name: string
}

export default function Dashboard() {
  const router = useRouter()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user") || sessionStorage.getItem("user")

      if (storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser)
          setUserData(parsedUser)
        } catch (error) {
          console.error("Failed to parse user data:", error)
          handleLogout()
        }
      } else {
        // Redirect to login if no user data found
        router.push("/login")
      }

      setIsLoading(false)
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    // Clear user data from storage
    localStorage.removeItem("user")
    sessionStorage.removeItem("user")

    toast.success("You have been logged out successfully")
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    )
  }

  // Mock statistics data
  const stats = {
    documentsScanned: 24,
    plagiarismDetected: 7,
    musicAnalyzed: 12,
    averageSimilarity: 18.5,
  }

  return (
    <div className="min-h-screen bg-background">
      <AnimatedBackground variant="grid" intensity="light" color="#6366f1" />

      <div className="container py-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {userData?.name || "User"}!</h1>
            <p className="text-muted-foreground">Here's an overview of your plagiarism detection activities</p>
          </div>

          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Documents Scanned</CardDescription>
              <CardTitle className="text-3xl">{stats.documentsScanned}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <FileText className="inline h-4 w-4 mr-1" />
                Last 30 days
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Plagiarism Detected</CardDescription>
              <CardTitle className="text-3xl">{stats.plagiarismDetected}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <PieChart className="inline h-4 w-4 mr-1" />
                {Math.round((stats.plagiarismDetected / stats.documentsScanned) * 100)}% of scanned documents
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Music Files Analyzed</CardDescription>
              <CardTitle className="text-3xl">{stats.musicAnalyzed}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <Music className="inline h-4 w-4 mr-1" />
                Last 30 days
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardDescription>Average Similarity</CardDescription>
              <CardTitle className="text-3xl">{stats.averageSimilarity}%</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-xs text-muted-foreground">
                <BarChart className="inline h-4 w-4 mr-1" />
                Across all documents
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
