import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

const posts = [
  {
    title: "Understanding AI-Powered Plagiarism Detection",
    description: "Learn how modern AI algorithms detect content similarity and maintain academic integrity.",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    category: "Technology",
    slug: "ai-plagiarism-detection",
  },
  {
    title: "The Future of Content Creation",
    description: "Exploring how AI tools are transforming the way we create and verify content.",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    category: "Industry Insights",
    slug: "future-content-creation",
  },
  {
    title: "Best Practices for Academic Writing",
    description: "Tips and guidelines for maintaining originality in academic papers.",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    category: "Education",
    slug: "academic-writing-practices",
  },
  {
    title: "Music Plagiarism in the Digital Age",
    description: "How technology is helping identify and prevent music copyright infringement.",
    date: new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
    category: "Music",
    slug: "music-plagiarism-digital-age",
  },
]

export default function Blog() {
  return (
    <div className="container py-12">
      <div className="max-w-4xl mx-auto space-y-12">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">Blog</h1>
          <p className="text-lg text-muted-foreground">Insights and updates from the PlagSentiNEL team</p>
        </div>

        <div className="grid gap-6">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`}>
              <Card className="transition-all hover:bg-muted/50">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <CardTitle>{post.title}</CardTitle>
                      <CardDescription>{post.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>{post.date}</span>
                    <span>{post.category}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
