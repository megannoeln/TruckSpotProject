import React from "react";
import { Link } from "react-router-dom";

function MediumCard({ title, description, image, eventId, date }) {
  const defaultImage = "./src/assets/event-default-medium.jpg";
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/eventinformation/${eventId}`}>
        <img
          className="rounded-t-lg w-full h-[300px] object-cover"
          src={`http://localhost:5000${image}`}
          alt={title}
        />
      </Link>
      <div className="p-5">
        <Link to={`/eventinformation/${eventId}`}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
        </Link>
        <p className="mb-2 text-sm text-gray-500">
          {new Date(date).toLocaleDateString()}
        </p>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
}

export default MediumCard;
