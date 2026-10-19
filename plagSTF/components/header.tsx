"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Search, Menu, User } from "lucide-react"
import ModeToggle from "@/components/mode-toggle"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useState, useEffect } from "react"
import AuthModal from "./auth-modal"
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [user, setUser] = useState<{ email: string; name: string; isPremium: boolean } | null>(null)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    const userData = localStorage.getItem("user")
    if (userData) {
      const user = JSON.parse(userData)
      setUser({
        email: user.email,
        name: user.loginMethod === "google" ? "Google User" : user.name,
        isPremium: user.isPremium,
      })
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    router.push("/")
  }

  const links = [
    {
      href: "/tool/plagiarism-checker",
      label: "Plagiarism Checker",
      animation: "hover:translate-y-[-2px] transition-transform",
    },
    {
      href: "/tool/music-plagiarism",
      label: "Music Plagiarism",
      animation: "hover:translate-y-[-2px] transition-transform",
    },
    {
      href: "/tool/paraphrasing",
      label: "Paraphrasing Tool",
      animation: "hover:translate-y-[-2px] transition-transform",
    },
    {
      href: "/tool/story-generator",
      label: "Story Generator",
      animation: "hover:translate-y-[-2px] transition-transform",
    },
    {
      href: "/tool/text-summarizer",
      label: "Text Summarizer",
      animation: "hover:translate-y-[-2px] transition-transform",
    },
    {
      href: "/tool/ai-essay-writer",
      label: "AI Essay Writer",
      animation: "hover:translate-y-[-2px] transition-transform",
    },
    {
      href: "/tool/extract-text",
      label: "Extract Text",
      animation: "hover:translate-y-[-2px] transition-transform",
    },
  ]

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">PlagSentiNEL</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-foreground/80 text-foreground/60 ${link.animation}`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon" className="hover:bg-transparent">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <nav className="flex flex-col space-y-4">
                {links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-foreground/60 transition-colors hover:text-foreground/80"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
          <Link href="/" className="mr-6 flex items-center space-x-2 md:hidden">
            <span className="font-bold">PlagSentiNEL</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-4">
            {mounted ? (
              <nav className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-transparent"
                  onClick={() => setIsSearchOpen(true)}
                >
                  <Search className="h-5 w-5" />
                  <span className="sr-only">Search</span>
                </Button>
                <ModeToggle />
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="gap-2">
                        <User className="h-5 w-5" />
                        {user.name}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => router.push("/dashboard")}>Dashboard</DropdownMenuItem>
                      <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button
                    variant="outline"
                    onClick={() => setIsOpen(true)}
                    className="hover:scale-105 transition-transform"
                  >
                    Login
                  </Button>
                )}
              </nav>
            ) : null}
          </div>
        </div>
      </header>
      <AuthModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Tools">
            {links.map((link) => (
              <CommandItem
                key={link.href}
                onSelect={() => {
                  router.push(link.href)
                  setIsSearchOpen(false)
                }}
              >
                {link.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
