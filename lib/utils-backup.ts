"use server"
import OpenAI from "openai"
import clientPromise from "@/lib/mongodb"

const openai = new OpenAI()

const getQuestionEmbedding = async (question: string) => {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
    encoding_format: "float",
  })

  return embedding.data[0].embedding
}

const findSimilarText = async (question: string) => {
  const questionEmbedding = await getQuestionEmbedding(question)

  const client = await clientPromise
  const db = client.db("Books")
  const book_embeddings = db.collection("Embeddings_Small")

  const similarDocs = await book_embeddings
    .aggregate([
      {
        $vectorSearch: {
          queryVector: questionEmbedding,
          path: "embedding",
          numCandidates: 20,
          limit: 5,
          index: "vector_index",
        },
      },
      {
        $project: {
          chapter_number: 1,
          chapter_title: 1,
          section: 1,
          content: 1,
        },
      },
    ])
    .toArray()

  return similarDocs
}

export const getChatResponse = async (
  currentConversation: string[],
  userInput: string
) => {
  let updatedConversation: string[] = currentConversation.slice()

  const bookContent = await findSimilarText(userInput)

  const chatResponse = await openai.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a scholarly sales assistant that helps customers who are researchers and academics determine if the selected book is what the they want. The selected book is 'Teaching with AI'.`,
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
        content: `If the user asks a question about the book itself, answer the question. Otherwise, if a user asks about the contents of the book, answer whether the book would be a good match for the user, citing one or two specific Sections. Try to limit your response to about 100 words.`,
      },
      {
        role: "user",
        content: `${updatedConversation.map(
          (conv, index) =>
            `${index % 2 === 0 ? "User" : "AI Assistant"}: ${conv}`
        )}`,
      },
    ],
    model: "gpt-4",
  })

  return chatResponse.choices[0].message.content
    ? chatResponse.choices[0].message.content
    : "Sorry, there was an error. Try asking your question again."
}
