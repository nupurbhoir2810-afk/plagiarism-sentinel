import { NextResponse } from "next/server"
import { generateCitation } from "@/lib/ai"

export async function POST(req: Request) {
  try {
    const { source, format } = await req.json()

    if (!source || !format) {
      return NextResponse.json({ error: "Source and format are required" }, { status: 400 })
    }

    const citation = await generateCitation(source, format as "apa" | "mla" | "chicago")

    return NextResponse.json({ citation })
  } catch (error) {
    console.error("Citation error:", error)
    return NextResponse.json({ error: "Failed to generate citation" }, { status: 500 })
  }
}
