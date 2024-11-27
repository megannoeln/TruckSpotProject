import React from "react";
import CuisineLimitModal from "../Modal/CuisineLimitModal";
const EventDetailSection = ({
  event,
  cuisineLimits,
  isLoggedIn,
  userType,
  onReservation,
  onShowVendors,
  onShowCuisineLimit,
  showCuisineLimitModal,
  onCloseCuisineLimit,
  newCuisineLimit,
  setNewCuisineLimit,
  handleAddCuisineLimit,
  cuisineTypes,
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
        <h2 className="text-xl font-semibold">{event.strEventName}</h2>
        <p className="text-gray-600">
          {new Date(event.dtDateOfEvent).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>

        <div className="space-y-2">
          {/* Email */}
          <div className="flex items-center gap-2 text-gray-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>{event.strEmail}</span>
          </div>

          {/* Contact */}
          <div className="flex items-center gap-2 text-gray-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{event.strContact}</span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 text-gray-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{event.strLocation}</span>
          </div>

          {/* Available Space */}
          <div className="flex items-center gap-2 text-gray-600">
            {event.intAvailableSpaces > 0 ? (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            ) : (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            )}
            <span>{event.intAvailableSpaces} Available Space</span>
          </div>

          {/* Price */}
          <div className="flex items-center gap-2 text-gray-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <span>{event.monPricePerSpace} Per Space</span>
          </div>

          {/* Cuisine Limits */}
          <div className="mt-4">
            <div className="flex items-center gap-2 text-gray-600">
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                />
              </svg>
              <span className="font-semibold">Cuisine Limits:</span>
            </div>

            <div className="ml-7 mt-2 space-y-2 bg-gray-50 p-3 rounded-md">
              {cuisineLimits.map((cuisine, index) => (
                <div
                  key={index}
                  className="flex justify-between text-sm text-gray-600"
                >
                  <span>{cuisine.CuisineType}</span>
                  <span
                    className={`font-medium ${
                      cuisine.Available === 0
                        ? "text-red-500"
                        : "text-green-600"
                    }`}
                  >
                    {cuisine.Limit - cuisine.Available}/{cuisine.Limit} spots
                  </span>
                </div>
              ))}
            </div>
            <div className="flex justify-center items-center space-x-4">
              {isLoggedIn &&
                userType === "1" &&
                new Date(event.dtDateOfEvent) > new Date() && (
                  <button
                    className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                    onClick={onReservation}
                  >
                    Reserve a spot
                  </button>
                )}

              {isLoggedIn && userType === "2" && (
                <button
                  onClick={onShowVendors}
                  className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
                >
                  Show Vendors
                </button>
              )}

              {isLoggedIn &&
                userType === "2" &&
                event.intOrganizerID ===
                  parseInt(sessionStorage.getItem("userID")) && (
                  <div className="flex space-x-4">
                    <button
                      onClick={onShowCuisineLimit}
                      className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition-colors"
                    >
                      Add Cuisine Limit
                    </button>
                    <CuisineLimitModal
                      show={showCuisineLimitModal}
                      onClose={onCloseCuisineLimit}
                      newCuisineLimit={newCuisineLimit}
                      setNewCuisineLimit={setNewCuisineLimit}
                      handleAddCuisineLimit={handleAddCuisineLimit}
                      cuisineTypes={cuisineTypes}
                    />
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailSection;
