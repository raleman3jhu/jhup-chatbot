"use client"

import { useChat } from "ai/react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import coverImage from "../public/assets/teachingWithAI.jpg"

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat()
  const [loading, setLoading] = useState(false)
  const scrollableChatRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setLoading(isLoading)
  }, [isLoading])

  // Scroll to the bottom of the div whenever the height changes
  useEffect(() => {
    if (scrollableChatRef.current != null) {
      const chat = scrollableChatRef.current
      chat.scrollTop = chat.scrollHeight
    }
  })

  return (
    <div className='flex flex-row justify-center items-center h-screen'>
      <Image
        src={coverImage}
        alt=''
        height={400}
        width={320}
        layout='fixed'
        className='mx-6 hidden md:block'
      ></Image>
      <div className='flex flex-col justify-between rounded-md items-center max-h-full bg-slate-600 px-2 my-6 mx-2'>
        <div
          ref={scrollableChatRef}
          className='flex flex-col w-full max-w-lg max-h-80-screen mb-10 overflow-y-auto mx-auto stretch'
        >
          <div className='rounded-md text-lg my-4 p-2 ml-2 mr-5 bg-slate-700 border border-solid border-white'>
            Hi I&apos;m your virtual assistant. What would you like to know
            about the book &apos;Teaching with AI&apos;?
          </div>
          {messages.map((m, index) => (
            <div
              key={m.id}
              className={`rounded-md text-lg my-4 p-2 whitespace-pre-wrap border border-solid border-white ${
                index % 2 === 0
                  ? "ml-5 mr-2 bg-heritage-blue"
                  : "ml-2 mr-5 bg-slate-700"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && <p className='mx-auto animate-pulse'>Loading...</p>}
        </div>
        <form
          onSubmit={handleSubmit}
          className='w-full mb-4 flex justify-around'
        >
          <input
            className='w-full max-w-lg p-2 border border-gray-300 rounded shadow-xl text-black'
            value={input}
            placeholder='What do you want to know?'
            onChange={handleInputChange}
          />
          <button
            type='submit'
            aria-label='Submit question'
            className='bg-heritage-blue py-2 px-4 mx-2 rounded-sm'
          >
            ↵
          </button>
        </form>
      </div>
    </div>
  )
}
