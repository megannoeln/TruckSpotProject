import React from "react";
import { Link } from "react-router-dom";

function BigCard({ title, description, image, eventId, date }) {
  return (
    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      <Link to={`/eventinformation/${eventId}`}>
        <img
          className="rounded-t-lg w-full h-[400px] object-cover"
          src={`http://localhost:5000${image}`}
          alt={title}
        />
      </Link>
      <div className="p-4">
        <Link to={`/eventinformation/${eventId}`}>
          <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
            {title}
          </h5>
        </Link>
        <p className="mb-2 text-sm text-gray-500">
          {new Date(date).toLocaleDateString()}
        </p>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  );
}

export default BigCard;
