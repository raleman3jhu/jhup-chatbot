"use server"
import OpenAI from "openai"
import clientPromise from "@/lib/mongodb"

const getQuestionEmbedding = async (question: string, openai: OpenAI) => {
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: question,
    encoding_format: "float",
  })

  return embedding.data[0].embedding
}

export const getFAQ = async (question: string, openai: OpenAI) => {
  const questionEmbedding = await getQuestionEmbedding(question, openai)

  const client = await clientPromise
  const db = client.db("FAQs")
  const faq_embeddings = db.collection("Embeddings")

  const similarDoc = await faq_embeddings
    .aggregate([
      {
        $vectorSearch: {
          queryVector: questionEmbedding,
          path: "Question_Embed",
          numCandidates: 1,
          limit: 1,
          index: "vector_search",
        },
      },
      {
        $project: {
          Answer: 1,
          Question: 1,
        },
      },
    ])
    .toArray()

  return similarDoc[0]
}

export const findSimilarText = async (
  question: string,
  title: string,
  openai: OpenAI
) => {
  const questionEmbedding = await getQuestionEmbedding(question, openai)

  const client = await clientPromise
  const db = client.db("Books")
  const book_embeddings = db.collection("Embeddings_New")

  const similarDocs = await book_embeddings
    .aggregate([
      {
        $vectorSearch: {
          queryVector: questionEmbedding,
          path: "embedding",
          numCandidates: 10,
          limit: 10,
          index: "vector_search",
        },
      },
      {
        $match: {
          book_title: title,
        },
      },
      {
        $project: {
          chapter_title: 1,
          section: 1,
          content: 1,
        },
      },
    ])
    .toArray()

  return similarDocs
}
