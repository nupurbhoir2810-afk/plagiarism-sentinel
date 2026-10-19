import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Footer() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-4 py-10 md:flex-row md:gap-8">
        <div className="space-y-4 md:flex-1">
          <h2 className="text-lg font-bold">PlagSentiNEL</h2>
          <p className="text-sm text-muted-foreground">
            Advanced AI-powered content analysis tools for academic and professional use.
          </p>
        </div>
        <div className="grid flex-1 grid-cols-2 gap-8 sm:grid-cols-3">
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Tools</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/tool/plagiarism-checker">
                <Button variant="link" className="h-auto p-0">
                  Plagiarism Checker
                </Button>
              </Link>
              <Link href="/tool/music-plagiarism">
                <Button variant="link" className="h-auto p-0">
                  Music Plagiarism
                </Button>
              </Link>
              {/* Removed Text Editor Link */}
            </nav>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Company</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/about">
                <Button variant="link" className="h-auto p-0">
                  About
                </Button>
              </Link>
              <Link href="/blog">
                <Button variant="link" className="h-auto p-0">
                  Blog
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="link" className="h-auto p-0">
                  Contact
                </Button>
              </Link>
            </nav>
          </div>
          <div className="space-y-3">
            <h3 className="text-sm font-medium">Legal</h3>
            <nav className="flex flex-col space-y-2">
              <Link href="/privacy">
                <Button variant="link" className="h-auto p-0">
                  Privacy
                </Button>
              </Link>
              <Link href="/terms">
                <Button variant="link" className="h-auto p-0">
                  Terms
                </Button>
              </Link>
            </nav>
          </div>
        </div>
      </div>
      <div className="border-t">
        <div className="container flex flex-col gap-2 py-4 md:flex-row md:gap-4">
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2025 PlagSentiNEL. All rights reserved.
          </p>
          <nav className="flex justify-center gap-4 md:ml-auto">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
