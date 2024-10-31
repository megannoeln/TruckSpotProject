import React from 'react'
import { Link } from 'react-router-dom'

function BigCard() {
  return (
    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <Link to="/eventinformation">
        <img 
          className="rounded-t-lg w-full h-[300px] object-cover" 
          src="./src/assets/sample.jpg" 
          alt="Main event" 
        />
      </Link>
      <div className="p-4">
        <Link to="/eventinformation">
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            Event Title
          </h5>
        </Link>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Officia perferendis mollitia tenetur ipsum. Non, fugiat.
        </p>
        <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
          Read more
          <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
        </a>
    </div>
  </div>
      )
}

export default BigCard