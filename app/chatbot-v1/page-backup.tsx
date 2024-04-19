"use client"
import { useState } from "react"
import { getChatResponse } from "@/lib/utils"

export default function Page() {
  const introduction: string | null =
    "Hello, I'm your virtual assistant. What would you like to know about 'Teaching with AI'?"
  const [conversation, setConversation] = useState([introduction])
  const [userInput, setUserInput] = useState("")

  const handleSubmit = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault()
    setConversation((conversation) => [...conversation, userInput])
    const chatResponse = await getChatResponse(conversation, userInput)
    setConversation((conversation) => [...conversation, chatResponse])
  }

  return (
    <div className='border-red-600 border-2 border-solid flex flex-col items-center'>
      <div className='flex justify-center my-4 max-w-screen-sm md:max-w-screen-md lg:max-w-screen-lg'>
        <div className='bg-slate-800'>
          {conversation.map((message, index) => (
            <p
              key={index}
              className={`rounded-md my-4 p-2 ${
                index % 2 === 0
                  ? "ml-2 mr-5 bg-slate-700"
                  : "ml-5 mr-2 bg-heritage-blue"
              }`}
            >
              {message}
            </p>
          ))}
        </div>
      </div>
      <form className='flex justify-center align-center'>
        <textarea
          className='text-black'
          aria-label="What would you like to know about 'Teaching with AI'?"
          id='userInput'
          name='userInput'
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
        ></textarea>
        <button
          className='bg-heritage-blue mx-2 px-2 py-1'
          onClick={(e) => handleSubmit(e)}
        >
          Submit
        </button>
      </form>
    </div>
  )
}
