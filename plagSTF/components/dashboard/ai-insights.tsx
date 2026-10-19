"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Zap, FileText, AlertTriangle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface AIInsight {
  category: string
  score: number
  change: number
  details: string
}

interface AIInsightsProps {
  insights: AIInsight[]
}

export function AIInsights({ insights }: AIInsightsProps) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-medium">AI Insights</CardTitle>
          <Brain className="h-5 w-5 text-blue-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {insights.map((insight, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {index === 0 && <Zap className="h-4 w-4 text-yellow-500" />}
                  {index === 1 && <FileText className="h-4 w-4 text-green-500" />}
                  {index === 2 && <AlertTriangle className="h-4 w-4 text-red-500" />}
                  <span className="font-medium">{insight.category}</span>
                </div>
                <span className="text-sm text-muted-foreground">
                  {insight.change > 0 ? "+" : ""}
                  {insight.change}%
                </span>
              </div>
              <Progress value={insight.score} />
              <p className="text-sm text-muted-foreground">{insight.details}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
