"use client"

import { useState, useRef } from "react"
import { getFAQ } from "@/lib/utils"

export default function Page() {
  const [results, setResults] = useState<any[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  const getSimilarFaqs = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (inputRef.current?.value) {
      const question = inputRef.current?.value
      const similarFaqs = await getFAQ(question)
      setResults(similarFaqs)
    }
  }

  return (
    <div className='flex flex-col justify-center items-center h-screen'>
      <div className='text-7xl font-google'>
        <span className='text-blue-500'>A</span>
        <span className='text-red-500'>l</span>
        <span className='text-yellow-500'>l</span>
        <span className='text-green-500'>b</span>
        <span className='text-blue-500'>o</span>
        <span className='text-yellow-500'>o</span>
        <span className='text-red-500'>g</span>
        <span className='text-green-500'>l</span>
        <span className='text-blue-500'>e</span>
      </div>
      <form
        onSubmit={(event) => getSimilarFaqs(event)}
        className='my-6 p-2 flex items-center bg-slate-800 rounded-full shadow-xl w-11/12 min-w-96 max-w-3xl'
      >
        <input
          id='user-question'
          type='text'
          ref={inputRef}
          className='flex-grow bg-slate-800 text-white p-2 rounded-lg outline-none'
          placeholder='Enter your question to search the Allbook FAQs.'
        />
        <button
          type='submit'
          aria-label='Submit Question'
          className='ml-2 p-2 bg-gray-700 text-white rounded-full hover:bg-gray-600 focus:outline-none'
        >
          <svg
            xmlns='http://www.w3.org/2000/svg'
            className='h-5 w-5'
            fill='none'
            viewBox='0 0 24 24'
            stroke='currentColor'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M5 10l7-7m0 0l7 7m-7-7v18'
            />
          </svg>
        </button>
      </form>
      {!(!Array.isArray(results) || !results.length) && (
        <div className='h-2/3 min-w-96 max-w-3xl overflow-y-auto bg-slate-700 rounded-lg p-2'>
          {results.map((result, index) => (
            <>
              <h2 className='text-2xl'>{result.Question}</h2>
              <p key={index} className='mb-4'>
                {result.Answer}
              </p>
            </>
          ))}
        </div>
      )}
    </div>
  )
}
