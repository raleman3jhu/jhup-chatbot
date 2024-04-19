"use client"
import { useState } from "react"
import OpenAI from "openai"

type ChatFormProps = {
  getSimilarDocs: (question: string) => Promise<Document[]>
}

const ChatForm: React.FC<ChatFormProps> = async ({ getSimilarDocs }) => {
  const introduction =
    "Hello, I'm your virtual assistant. What would you like to know about 'Teaching with AI'?"
  const [conversation, setConversation] = useState([introduction])
  const [userInput, setUserInput] = useState("")

  const handleSubmit = async () => {
    "use server"
    const openai = new OpenAI()

    let updatedConversation = [userInput]
    const bookContent = await getSimilarDocs(userInput)

    const chatResponse = await openai

    //set state to append updated conversation
  }

  return (
    <div>
      <div className='flex justify-center mb-4'>
        <div className='bg-white min-h-10 w-80 text-black'>
          {conversation.map((message) => (
            <p className='bg-slate-400 m-2 p-1'>{message}</p>
          ))}
        </div>
      </div>
      <form className='flex justify-center align-center'>
        <textarea
          className='text-black'
          aria-label="What would you like to know about 'Teaching with AI'?"
          id='userInput'
          name='userInput'
          onChange={(e) => {
            setUserInput(e.currentTarget.value)
          }}
        ></textarea>
        <button
          className='bg-heritage-blue mx-2 px-2 py-1'
          type='submit'
          onClick={() => getSimilarDocs(userInput)}
        >
          Submit
        </button>
      </form>
    </div>
  )
}

export default ChatForm
