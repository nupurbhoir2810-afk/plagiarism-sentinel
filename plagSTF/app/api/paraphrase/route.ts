import { NextResponse } from "next/server"
import { generateParaphrasing } from "@/lib/ai"

export async function POST(req: Request) {
  try {
    const { text, style } = await req.json()

    if (!text || !style) {
      return NextResponse.json({ error: "Text and style are required" }, { status: 400 })
    }

    const paraphrased = await generateParaphrasing(text, style)

    return NextResponse.json({ paraphrased })
  } catch (error) {
    console.error("Paraphrasing error:", error)
    return NextResponse.json({ error: "Failed to paraphrase text" }, { status: 500 })
  }
}
