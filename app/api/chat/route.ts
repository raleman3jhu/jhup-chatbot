import { OpenAIStream, StreamingTextResponse } from "ai"
import { findSimilarText } from "@/lib/utils"
import OpenAI from "openai"
import { ChatCompletionMessageParam } from "ai/prompts"
import { Message } from "ai/react"

const openai = new OpenAI()

// Set the runtime to node so it actually works
export const runtime = "nodejs"

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json()

  const lastUserMessage = messages[messages.length - 1].content
  const bookContent = await findSimilarText(lastUserMessage, openai)

  const conversationMessages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `You are a book sales assistant that helps customers who are researchers and academics determine if the selected book is what the they want. The selected book is 'Teaching with AI'.`,
    },
    {
      role: "system",
      content: `You will be prompted with a conversation ending in a query from the user, in addition to the most semantically similar passages from the book 'Teaching with AI'. These are the most similar passages from the book, although they might not be very similar.`,
    },
    {
      role: "system",
      content: `${bookContent.map(
        (similarPassage) =>
          `Similar passage ${similarPassage.chapter_number} ${similarPassage.chapter_title} Section : ${similarPassage.content} ... `
      )}`,
    },
    {
      role: "system",
      content: `If the user asks about something unrelated to books, let them know you are a book assistant. Otherwise, if a user asks about the contents of the book, answer whether the book would be a good match for the user, citing one or two specific Sections. If the Sections are more related to the user query, recommend the book more; if the Sections are less related to the user query, recommend the book less. Try to limit your response to about 100 words.`,
    },
  ]

  for (let index = 0; index < messages.length; index++) {
    conversationMessages.push({
      role: index % 2 === 0 ? "user" : "assistant",
      content: messages[index].content,
    })
  }

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    stream: true,
    messages: conversationMessages,
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
