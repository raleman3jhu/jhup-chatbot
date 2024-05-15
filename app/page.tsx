"use client"

import { useChat } from "ai/react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"

const bookImages = {
  TeachingWithAI: "/assets/TeachingWithAI.jpg",
  HonestAging: "/assets/HonestAging.jpg",
  IDread: "/assets/IDreadTheThoughtOfThePlace.jpg",
  MathInDrag: "/assets/MathInDrag.jpg",
  The36HourDay: "/assets/The36HourDay.jpg",
  WildlifeDisease: "/assets/WildlifeDiseaseAndHealthInConservation.jpg",
}

const bookTitles = {
  TeachingWithAI: "Teaching with AI",
  HonestAging: "Honest Aging",
  IDread: "I Dread the Thought of the Place",
  MathInDrag: "Math in Drag",
  The36HourDay: "The 36 Hour Day",
  WildlifeDisease: "Wildlife Disease and Health in Conservation",
}

const bookUrls = {
  TeachingWithAI: "https://www.press.jhu.edu/books/title/53869/teaching-ai",
  HonestAging: "https://www.press.jhu.edu/books/title/12807/honest-aging",
  IDread: "https://www.press.jhu.edu/books/title/11509/i-dread-thought-place",
  MathInDrag: "https://www.press.jhu.edu/books/title/12813/math-drag",
  The36HourDay: "https://www.press.jhu.edu/books/title/12526/36-hour-day",
  WildlifeDisease:
    "https://www.press.jhu.edu/books/title/12727/wildlife-disease-and-health-conservation",
}

type bookKey =
  | "TeachingWithAI"
  | "HonestAging"
  | "IDread"
  | "MathInDrag"
  | "The36HourDay"
  | "WildlifeDisease"

export default function Chat() {
  // default to the book 'Teaching with AI'
  const [bookTitle, setBookTitle] = useState(bookTitles.TeachingWithAI)
  const [bookUrl, setBookUrl] = useState(bookUrls.TeachingWithAI)
  const [bookImg, setBookImg] = useState(bookImages.TeachingWithAI)

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      body: {
        bookTitle: bookTitle,
        bookUrl: bookUrl,
      },
    })

  const [loading, setLoading] = useState(false)
  const [isNewBook, setIsNewBook] = useState(false)

  const scrollableChatRef = useRef<HTMLDivElement>(null)

  const updateBook = (newBook: bookKey) => {
    setBookTitle(bookTitles[newBook])
    setBookUrl(bookUrls[newBook])
    setBookImg(bookImages[newBook])
    setIsNewBook(true)
  }

  useEffect(() => {
    setLoading(isLoading)
    setIsNewBook(false)
  }, [isLoading])

  // Scroll to the bottom of the div whenever the height changes
  useEffect(() => {
    if (scrollableChatRef.current != null) {
      const chat = scrollableChatRef.current
      chat.scrollTop = chat.scrollHeight
    }
  })

  //legacy prop layout on img
  return (
    <div className='flex flex-row justify-center items-center h-screen'>
      <Image
        src={bookImg}
        alt=''
        height={400}
        width={320}
        layout='fixed'
        className='mx-6 hidden md:block'
      ></Image>
      <div className='flex flex-col justify-between rounded-md items-center max-h-full bg-slate-700 px-2 my-6 mx-2'>
        <div
          ref={scrollableChatRef}
          className='flex flex-col w-full max-w-lg max-h-80-screen mb-10 overflow-y-auto mx-auto stretch'
        >
          <div className='rounded-md text-lg my-4 p-2 ml-2 mr-5 bg-slate-800 border border-solid border-white'>
            Hi I&apos;m your virtual assistant. What would you like to know
            about the book &apos;Teaching with AI&apos;?
          </div>
          {messages.map((m, index) => (
            <div
              key={m.id}
              className={`rounded-md text-lg my-4 p-2 whitespace-pre-wrap border border-solid border-white ${
                index % 2 === 0
                  ? "ml-5 mr-2 bg-heritage-blue"
                  : "ml-2 mr-5 bg-slate-800"
              }`}
            >
              {m.content}
            </div>
          ))}
          {loading && <p className='mx-auto animate-pulse'>Loading...</p>}
          {isNewBook && (
            <p className='mx-auto text-lg'>
              You're now chatting about &apos;{bookTitle}&apos;
            </p>
          )}
        </div>
        <form
          onSubmit={handleSubmit}
          className='w-full mb-4 flex justify-around'
        >
          <input
            className='w-full max-w-lg p-2 border border-slate-300 rounded shadow-xl text-black'
            value={input}
            placeholder='What would you like to know?'
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
      <div className='flex flex-col rounded-md items-center max-h-full bg-slate-800 px-2 my-6 mx-2'>
        <h2 className='text-3xl py-2'>Table of Contents</h2>
        <p className='pb-2'>Select a different book to ask questions</p>
        <button
          className='bg-black px-2 py-1 rounded-md my-1'
          onClick={() => updateBook("TeachingWithAI")}
        >
          Teaching with AI
        </button>
        <button
          className='bg-black px-2 py-1 rounded-md my-1'
          onClick={() => updateBook("HonestAging")}
        >
          Honest Aging
        </button>
        <button
          className='bg-black px-2 py-1 rounded-md my-1'
          onClick={() => updateBook("IDread")}
        >
          I Dread the Thought of the Place
        </button>
        <button
          className='bg-black px-2 py-1 rounded-md my-1'
          onClick={() => updateBook("MathInDrag")}
        >
          Math in Drag
        </button>
        <button
          className='bg-black px-2 py-1 rounded-md my-1'
          onClick={() => updateBook("The36HourDay")}
        >
          The 36 Hour Day
        </button>
        <button
          className='bg-black px-2 py-1 rounded-md my-1'
          onClick={() => updateBook("WildlifeDisease")}
        >
          Wildlife Disease and Health
        </button>
      </div>
    </div>
  )
}
