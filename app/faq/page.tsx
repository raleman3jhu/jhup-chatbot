"use client"

import { useChat } from "ai/react"
import { useState, useEffect, useRef } from "react"

export default function Page() {
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
      <form className='mt-6 p-2 flex items-center bg-slate-800 rounded-full shadow-xl w-11/12 min-w-96 max-w-3xl'>
        <input
          className='flex-grow bg-slate-800 text-white p-2 rounded-lg outline-none'
          placeholder='Search the Allbook FAQs by keyword or question.'
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
    </div>
  )
}

export function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "faq/api/chat",
    })

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

  //legacy prop layout on img
  return (
    <div className='flex flex-col lg:flex-row lg:justify-center items-center h-screen'>
      <div className='flex flex-col justify-between rounded-md items-center max-h-full bg-slate-700 px-2 my-6 mx-2'>
        <div
          ref={scrollableChatRef}
          className='flex flex-col w-full max-w-lg max-h-80-screen mb-10 overflow-y-auto mx-auto stretch'
        >
          <div className='rounded-md text-lg my-4 p-2 ml-2 mr-5 bg-slate-800 border border-solid border-white'>
            Hi I&apos;m your virtual assistant. What would you like to know
            about AllBooks?
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
    </div>
  )
}

// "use client"

// import { useChat } from "ai/react"
// import { useState, useEffect, useRef } from "react"

// export default function Chat() {
//   const { messages, input, handleInputChange, handleSubmit, isLoading } =
//     useChat({
//       api: "faq/api/chat",
//     })

//   const [loading, setLoading] = useState(false)

//   const scrollableChatRef = useRef<HTMLDivElement>(null)

//   useEffect(() => {
//     setLoading(isLoading)
//   }, [isLoading])

//   // Scroll to the bottom of the div whenever the height changes
//   useEffect(() => {
//     if (scrollableChatRef.current != null) {
//       const chat = scrollableChatRef.current
//       chat.scrollTop = chat.scrollHeight
//     }
//   })

//   //legacy prop layout on img
//   return (
//     <div className='flex flex-col lg:flex-row lg:justify-center items-center h-screen'>
//       <div className='flex flex-col justify-between rounded-md items-center max-h-full bg-slate-700 px-2 my-6 mx-2'>
//         <div
//           ref={scrollableChatRef}
//           className='flex flex-col w-full max-w-lg max-h-80-screen mb-10 overflow-y-auto mx-auto stretch'
//         >
//           <div className='rounded-md text-lg my-4 p-2 ml-2 mr-5 bg-slate-800 border border-solid border-white'>
//             Hi I&apos;m your virtual assistant. What would you like to know
//             about AllBooks?
//           </div>
//           {messages.map((m, index) => (
//             <div
//               key={m.id}
//               className={`rounded-md text-lg my-4 p-2 whitespace-pre-wrap border border-solid border-white ${
//                 index % 2 === 0
//                   ? "ml-5 mr-2 bg-heritage-blue"
//                   : "ml-2 mr-5 bg-slate-800"
//               }`}
//             >
//               {m.content}
//             </div>
//           ))}
//           {loading && <p className='mx-auto animate-pulse'>Loading...</p>}
//         </div>
//         <form
//           onSubmit={handleSubmit}
//           className='w-full mb-4 flex justify-around'
//         >
//           <input
//             className='w-full max-w-lg p-2 border border-slate-300 rounded shadow-xl text-black'
//             value={input}
//             placeholder='What would you like to know?'
//             onChange={handleInputChange}
//           />
//           <button
//             type='submit'
//             aria-label='Submit question'
//             className='bg-heritage-blue py-2 px-4 mx-2 rounded-sm'
//           >
//             ↵
//           </button>
//         </form>
//       </div>
//     </div>
//   )
// }
