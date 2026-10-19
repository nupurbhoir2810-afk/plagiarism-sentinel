"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Copy, Check } from "lucide-react"
import { toast } from "sonner"

interface ApiDocsModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function ApiDocsModal({ isOpen, onClose }: ApiDocsModalProps) {
  const [apiKey, setApiKey] = useState("")
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    // Generate a random API key when the modal opens
    if (isOpen) {
      const key = `pk_${Math.random().toString(36).substr(2, 9)}_${Date.now().toString(36)}`
      setApiKey(key)
    }
  }, [isOpen])

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      toast.success("API key copied to clipboard")
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      toast.error("Failed to copy API key")
    }
  }

  const endpoints = [
    {
      name: "Plagiarism Check",
      endpoint: "/api/plagiarism",
      method: "POST",
      description: "Check text for plagiarism against a source",
      example: `curl -X POST https://api.plagsentinel.com/api/plagiarism \\
-H "Authorization: Bearer ${apiKey}" \\
-H "Content-Type: application/json" \\
-d '{"text": "content to check", "sourceText": "source content"}'`,
    },
    {
      name: "Music Plagiarism",
      endpoint: "/api/music-plagiarism",
      method: "POST",
      description: "Compare two audio files for similarity",
      example: `curl -X POST https://api.plagsentinel.com/api/music-plagiarism \\
-H "Authorization: Bearer ${apiKey}" \\
-H "Content-Type: multipart/form-data" \\
-F "file1=@song1.mp3" \\
-F "file2=@song2.mp3"`,
    },
    {
      name: "Text Editor",
      endpoint: "/api/editor",
      method: "POST",
      description: "Process and format text content",
      example: `curl -X POST https://api.plagsentinel.com/api/editor \\
-H "Authorization: Bearer ${apiKey}" \\
-H "Content-Type: application/json" \\
-d '{"content": "text to format", "format": "markdown"}'`,
    },
  ]

  const dialogContentId = "api-docs-description"

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[800px] animate-fade-up" aria-describedby={dialogContentId}>
        <DialogHeader>
          <DialogTitle>API Documentation</DialogTitle>
          <DialogDescription id={dialogContentId}>
            Integrate PlagSentiNEL tools into your applications
          </DialogDescription>
        </DialogHeader>
        <Tabs defaultValue="authentication" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="authentication">Authentication</TabsTrigger>
            <TabsTrigger value="endpoints">Endpoints</TabsTrigger>
            <TabsTrigger value="sdk">SDK</TabsTrigger>
          </TabsList>
          <TabsContent value="authentication" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">API Key</h3>
              <div className="flex gap-2">
                <Input value={apiKey} readOnly className="font-mono" />
                <Button variant="outline" size="icon" onClick={() => copyToClipboard(apiKey)} className="hover-lift">
                  {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-sm text-muted-foreground">
                Include this key in the Authorization header of your requests:
                <code className="ml-2 p-1 bg-muted rounded">Authorization: Bearer {apiKey}</code>
              </p>
            </div>
          </TabsContent>
          <TabsContent value="endpoints" className="space-y-6 max-h-[400px] overflow-y-auto pr-4">
            {endpoints.map((endpoint) => (
              <div key={endpoint.name} className="space-y-2 animate-fade-up">
                <h3 className="text-lg font-semibold">{endpoint.name}</h3>
                <div className="space-y-1">
                  <p className="text-sm font-medium">
                    {endpoint.method} {endpoint.endpoint}
                  </p>
                  <p className="text-sm text-muted-foreground">{endpoint.description}</p>
                </div>
                <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                  <code className="text-sm">{endpoint.example}</code>
                </pre>
              </div>
            ))}
          </TabsContent>
          <TabsContent value="sdk" className="space-y-4">
            <div className="space-y-4 animate-fade-up">
              <h3 className="text-lg font-semibold">Installation</h3>
              <pre className="p-4 bg-muted rounded-lg">
                <code>npm install @plagsentinel/sdk</code>
              </pre>
              <h3 className="text-lg font-semibold">Usage</h3>
              <pre className="p-4 bg-muted rounded-lg overflow-x-auto">
                <code>{`import { PlagSentiNEL } from '@plagsentinel/sdk'

const client = new PlagSentiNEL('${apiKey}')

// Check for plagiarism
const result = await client.checkPlagiarism({
  text: 'content to check',
  sourceText: 'source content'
})`}</code>
              </pre>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
