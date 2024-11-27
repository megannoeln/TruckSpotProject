// SmallCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";

function SmallCard({ event }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);

  // Format the date
  const formattedDate = new Date(event.dtDateOfEvent).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  useEffect(() => {
    // Check session storage for user data
    const storedUserType = sessionStorage.getItem("userType");
    const storedUserID = sessionStorage.getItem("userID");

    if (storedUserType && storedUserID) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
    } else {
    }
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/eventinformation/${event.intEventID}`}>
        <img
          className="rounded-t-lg w-full h-[225px] object-cover"
          src={`http://localhost:5000${event.strLogoFilePath}`}
          alt={event.strEventName}
        />
      </Link>
      <div className="p-4">
        <Link to={`/eventinformation/${event.intEventID}`}>
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            {event.strEventName}
          </h5>
        </Link>
        <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
          {event.strDescription}
        </p>
      </div>
    </div>
  );
}

export default SmallCard;
