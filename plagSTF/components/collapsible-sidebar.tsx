"use client"

import { useState } from "react"
import { Sidebar } from "./sidebar"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function CollapsibleSidebar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 md:hidden"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
      </Button>
      <div
        className={`
        fixed inset-y-0 left-0 transform z-40
        md:relative md:translate-x-0
        transition duration-200 ease-in-out
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:flex md:w-64 md:flex-col
      `}
      >
        <Sidebar />
      </div>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-30 md:hidden" onClick={() => setIsOpen(false)} />}
    </>
  )
}
