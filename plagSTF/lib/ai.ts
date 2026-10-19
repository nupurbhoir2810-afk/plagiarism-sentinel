import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function analyzeText(text: string) {
  try {
    const { text: analysis } = await generateText({
      model: openai("gpt-4"),
      prompt: `Analyze the following text for potential plagiarism. Consider writing style, vocabulary usage, and content originality. Provide a detailed analysis:

${text}`,
      temperature: 0.7,
    })
    return analysis
  } catch (error) {
    console.error("AI analysis error:", error)
    throw new Error("Failed to analyze text")
  }
}

export async function generateParaphrasing(text: string, style: string) {
  try {
    const { text: paraphrased } = await generateText({
      model: openai("gpt-4"),
      prompt: `Paraphrase the following text in a ${style} style while maintaining its meaning:

${text}`,
      temperature: 0.8,
    })
    return paraphrased
  } catch (error) {
    console.error("AI paraphrasing error:", error)
    throw new Error("Failed to paraphrase text")
  }
}

export async function generateCitation(source: string, format: "apa" | "mla" | "chicago") {
  try {
    const { text: citation } = await generateText({
      model: openai("gpt-4"),
      prompt: `Generate a ${format.toUpperCase()} citation for the following source:

${source}`,
      temperature: 0.3,
    })
    return citation
  } catch (error) {
    console.error("AI citation error:", error)
    throw new Error("Failed to generate citation")
  }
}
