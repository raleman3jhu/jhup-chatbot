import { OpenAIStream, StreamingTextResponse } from "ai"
import { getFAQ } from "@/lib/utils"
import OpenAI from "openai"
import { ChatCompletionMessageParam } from "ai/prompts"
import { Message } from "ai/react"

const openai = new OpenAI()

// Set the runtime to node so it actually works
export const runtime = "nodejs"

export async function POST(req: Request) {
  const { messages }: { messages: Message[] } = await req.json()

  const lastUserMessage = messages[messages.length - 1].content
  const answer = await getFAQ(lastUserMessage)

  const conversationMessages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: `Reply exactly with the following: Question: ${answer.Question} Answer: ${answer.Answer}
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
