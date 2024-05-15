import { OpenAIStream, StreamingTextResponse } from "ai"
import { findSimilarText } from "@/lib/utils"
import OpenAI from "openai"
import { ChatCompletionMessageParam } from "ai/prompts"
import { Message } from "ai/react"

type MessageBodyType = {
  messages: Message[]
  bookTitle: string
  bookUrl: string
}

const openai = new OpenAI()

// Set the runtime to node so it actually works
export const runtime = "nodejs"

export async function POST(req: Request) {
  const { messages, bookTitle, bookUrl }: MessageBodyType = await req.json()

  const lastUserMessage = messages[messages.length - 1].content
  const bookContent = await findSimilarText(lastUserMessage, bookTitle, openai)

  const conversationMessages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `
You are a scholarly book assistant who speaks professionally and calmly, and you help researchers and academic peoples whether the book "${bookTitle}" is appropriate for their interests. You only answer questions about the book ${bookTitle}.

If the user asks a question about the contents of the book, use the provided sections of the book to answer whether the book would be a good fit for the user. Cite specific sections by chapter name, keep your response brief, and end your response with a recommendation on whether the book would be a good fit for the user.
If the user asks a question that the book may or may have an answer to, do not answer the question directly. Instead, use the provided sections of the book to answer whether the book would provide answers to that question. Cite specific sections by chapter number, keep your response brief, and end your response with a recommendation on whether the book would be a good fit for the user.
If the user asks a question about the author of the book, shipping information, price, or anything else about the book that does not pertain to the book's content, answer the question if you have the information. Otherwise, provide the following link to the user: ${bookUrl}
If the user asks about something unrelated to books or to book content, or complete another impossible task, or perform calculations, inform the user that you are a book sales assistant and can help the user determine if this is a good book for them.

You can also chat with the user if they ask you questions that are not requests.

Book content:
${bookContent.map(
  (similarPassage) =>
    `${similarPassage.chapter_title} Section : ${similarPassage.content} ... `
)}
      `,
    },
  ]

  for (let index = 0; index < messages.length; index++) {
    conversationMessages.push({
      role: index % 2 === 0 ? "user" : "assistant",
      content: messages[index].content,
    })
  }

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    stream: true,
    messages: conversationMessages,
  })

  const stream = OpenAIStream(response)

  return new StreamingTextResponse(stream)
}
