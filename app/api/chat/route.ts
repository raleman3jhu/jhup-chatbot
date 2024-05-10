import { OpenAIStream, StreamingTextResponse } from "ai"
import { findSimilarText } from "@/lib/utils"
import OpenAI from "openai"
import { ChatCompletionMessageParam } from "ai/prompts"
import { Message } from "ai/react"

const openai = new OpenAI()
const book_name = "Teaching with AI"
const book_link = "https://www.press.jhu.edu/books/title/53869/teaching-ai"

// Set the runtime to node so it actually works
export const runtime = "nodejs"

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json()

  const lastUserMessage = messages[messages.length - 1].content
  const bookContent = await findSimilarText(lastUserMessage, openai)

  const conversationMessages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `
You are a book assistant, and you help researchers and academic people determine whether the book they're considering is appropriate for their interests. The book is ${book_name}.

If the user asks a question about the contents of the book, use the provided sections of the book to answer whether the book would be a good fit for the user. Cite specific sections by chapter number, keep your response brief, and end your response with a recommendation on whether the book would be a good fit for the user.
If the user asks a question that the book may or may have an answer to, do not answer the question directly. Instead, use the provided sections of the book to answer whether the book would provide answers to that question. Cite specific sections by chapter number, keep your response brief, and end your response with a recommendation on whether the book would be a good fit for the user.
If the user asks a question about the author of the book, shipping information, price, or anything else about the book that does not pertain to the book's content, answer the question if you have the information. Otherwise, provide the following link to the user: ${book_link}
If the user asks about something unrelated to books or to book content, or complete another impossible task, or perform calculations, inform the user that you are a book sales assistant and can help the user determine if this is a good book for them.

You can also chat with the user if they ask you questions that are not requests.

Book content:
${bookContent.map(
  (similarPassage) =>
    `Similar passage ${similarPassage.chapter_number} ${similarPassage.chapter_title} Section : ${similarPassage.content} ... `
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

  // Ask OpenAI for a streaming chat completion given the prompt
  const response = await openai.chat.completions.create({
    model: "gpt-4-turbo",
    stream: true,
    messages: conversationMessages,
  })

  // Convert the response into a friendly text-stream
  const stream = OpenAIStream(response)
  // Respond with the stream
  return new StreamingTextResponse(stream)
}
