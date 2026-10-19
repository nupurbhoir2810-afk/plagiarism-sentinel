"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  BookOpen,
  FileText,
  Info,
  LayoutDashboard,
  Lock,
  MessageSquare,
  Music,
  PenTool,
  RefreshCcw,
  Settings,
  FileSearch,
  Wand2,
} from "lucide-react"

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Tools",
    icon: Settings,
    color: "text-violet-500",
    subItems: [
      {
        label: "Plagiarism Checker",
        icon: FileText,
        href: "/tool/plagiarism-checker",
      },
      {
        label: "Music Plagiarism",
        icon: Music,
        href: "/tool/music-plagiarism",
      },
      {
        label: "Paraphrasing Tool",
        icon: RefreshCcw,
        href: "/tool/paraphrasing",
      },
      {
        label: "Story Generator",
        icon: BookOpen,
        href: "/tool/story-generator",
      },
      {
        label: "Text Summarizer",
        icon: FileText,
        href: "/tool/text-summarizer",
      },
      {
        label: "AI Essay Writer",
        icon: PenTool,
        href: "/tool/ai-essay-writer",
      },
      {
        label: "Extract Text",
        icon: FileSearch,
        href: "/tool/extract-text",
      },
      {
        label: "Image Generation",
        icon: Wand2,
        href: "/tool/image-generation",
      },
    ],
  },
  {
    label: "About",
    icon: Info,
    href: "/about",
    color: "text-pink-700",
  },
  {
    label: "Blog",
    icon: MessageSquare,
    color: "text-orange-700",
    href: "/blog",
  },
  {
    label: "Privacy",
    icon: Lock,
    color: "text-green-700",
    href: "/privacy",
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/" className="flex items-center pl-3 mb-14">
          <h1 className="text-2xl font-bold">PlagSentiNEL</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <div key={route.label}>
              {route.subItems ? (
                <div className="space-y-1">
                  <div className={cn("text-sm font-medium flex items-center justify-between py-3 px-3", route.color)}>
                    <div className="flex items-center gap-x-3">
                      <route.icon className={cn("h-5 w-5")} />
                      {route.label}
                    </div>
                  </div>
                  <div className="pl-4 space-y-1">
                    {route.subItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                          "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                          pathname === item.href ? "text-white bg-white/10" : "text-zinc-400",
                        )}
                      >
                        <div className="flex items-center gap-x-3">
                          <item.icon className="h-5 w-5" />
                          {item.label}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ) : (
                <Link
                  href={route.href}
                  className={cn(
                    "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                    pathname === route.href ? "text-white bg-white/10" : "text-zinc-400",
                  )}
                >
                  <div className="flex items-center gap-x-3">
                    <route.icon className={cn("h-5 w-5", route.color)} />
                    {route.label}
                  </div>
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
