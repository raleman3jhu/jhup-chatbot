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
    <div className='flex flex-row justify-center items-center h-screen border-red-500 border-solid border-2'>
      <Image
        src={coverImage}
        alt=''
        height={400}
        width={320}
        layout='fixed'
        className='mx-6'
      ></Image>
      <div className='flex flex-col justify-between'>
        <div
          ref={scrollableChatRef}
          className='flex flex-col w-full max-w-lg max-h-80-screen mb-10 overflow-y-auto mx-auto stretch'
        >
          <div className='rounded-md my-4 p-2 ml-2 mr-5 bg-slate-700'>
            Hi I&apos;m your virtual assistant. What would you like to know
            about the book &apos;Teaching with AI&apos;?
          </div>
          {messages.map((m, index) => (
            <div
              key={m.id}
              className={`rounded-md text-xl my-4 p-2 whitespace-pre-wrap ${
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
        <form onSubmit={handleSubmit}>
          <input
            className='fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl text-black'
            value={input}
            placeholder='Say something...'
            onChange={handleInputChange}
          />
        </form>
      </div>
    </div>
  )
}
