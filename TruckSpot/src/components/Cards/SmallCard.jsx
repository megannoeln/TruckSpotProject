// SmallCard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useEffect } from "react";

function SmallCard({ event }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  // Format the date
  const formattedDate = new Date(event.dtDateOfEvent).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  useEffect(() => {
    // Check session storage for user data
    const storedUserType = sessionStorage.getItem('userType');
    const storedUserID = sessionStorage.getItem('userID');

    if (storedUserType && storedUserID) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
    } else {
      console.log('No session data found');
    }

  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/eventinformation/${event.intEventID}`}>
        <img 
          className="rounded-t-lg w-full h-[150px] object-cover" 
          src="./src/assets/sample.jpg"
          alt={event.strEventName} 
        />
      </Link>
      <div className="p-5">
        <Link to={`/eventinformation/${event.intEventID}`}>
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {event.strEventName}
          </h5>
        </Link>
        <p className="text-sm text-gray-500 mb-2">
          {formattedDate}
        </p>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
          {event.strDescription}
        </p>
        
        
        <Link 
          to={`/eventinformation/${event.intEventID}`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
        >
          Read more
          <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default SmallCard;