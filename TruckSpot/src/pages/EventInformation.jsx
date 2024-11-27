import React from "react";
import Navbar from "../components/Navbar/Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useState } from "react";
import { useEffect } from "react";
import VendorModal from "../components/VendorsAttend/VendorModal";
import CuisineLimitModal from "../components/Modal/CuisineLimitModal";
import FeedbackSection from "../components/Feedback/FeedbackSection";
import ConfirmationModal from "../components/Modal/ComfirmationModal";
import EventDetailSection from "../components/EventDetail/EventDetailSection";
function EventInformation() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null); // Store event details
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [userType, setUserType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [showVendorModal, setShowVendorModal] = useState(false);
  const [feedbacks, setFeedbacks] = useState([
    {
      strVendorName: "",
      intRating: 0,
      strVendorComment: "",
      monTotalRevenue: 0,
    },
  ]);
  const [cuisineTypes, setCuisineTypes] = useState([]);
  const [cuisineLimits, setCuisineLimits] = useState([]);
  const [showCuisineLimitModal, setShowCuisineLimitModal] = useState(false);
  const [newCuisineLimit, setNewCuisineLimit] = useState({
    cuisineTypeId: "",
    limit: "",
  });

  const fetchCuisineLimits = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/events/${eventId}/cuisine-limits`
      );
      setCuisineLimits(response.data);
    } catch (err) {
      console.error("Error fetching cuisine limits:", err);
    }
  };

  const fetchCuisineTypes = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/cuisine-types"
      );
      setCuisineTypes(response.data);
    } catch (err) {
      console.error("Error fetching cuisine types:", err);
    }
  };

  const fetchEventDetails = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/events/${eventId}`
      );
      setEvent(response.data);
    } catch (err) {
      console.error("Error fetching event details:", err);
      setError(err.message || "Error fetching event details");
    }
  };

  const fetchVendors = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/events/${eventId}/vendors`
      );
      setVendors(response.data);
    } catch (err) {
      console.error("Error fetching vendors:", err);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      const response = await axios.get(
        `http://localhost:5000/api/events/${eventId}/comments`
      );
      setFeedbacks(response.data);
    } catch (err) {
      console.error("Error fetching feedbacks:", err);
    }
  };

  const handleAddCuisineLimit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `http://localhost:5000/api/events/${eventId}/cuisine-limits`,
        {
          eventId: eventId,
          cuisineTypeId: parseInt(newCuisineLimit.cuisineTypeId),
          limit: parseInt(newCuisineLimit.limit),
        }
      );

      if (response.data.success) {
        alert("Cuisine limit updated successfully");
        setShowCuisineLimitModal(false);
        setNewCuisineLimit({ cuisineTypeId: "", limit: "" });
        fetchCuisineLimits();
      }
    } catch (error) {
      console.error("Error adding cuisine limit:", error);
      alert("Failed to add cuisine limit");
    }
  };

  useEffect(() => {
    const storedUserType = sessionStorage.getItem("userType");
    const storedUserID = sessionStorage.getItem("userID");
    if (storedUserType && storedUserID) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
    } else {
    }
  }, []);

  useEffect(() => {
    fetchCuisineTypes();
    fetchFeedbacks();
    fetchEventDetails();
    fetchVendors();
    fetchCuisineLimits();
    // Fetch all necessary data when eventId changes
  }, [eventId]);

  const handleReservation = async () => {
    setShowModal(true); // Show confirmation modal when click on a button that have On
  };

  const confirmReservation = async () => {
    const storedUserID = sessionStorage.getItem("userID");
    console.log("Attempting reserve");
    console.log(eventId);
    try {
      const response = await axios.post("http://localhost:5000/api/reserve", {
        eventID: eventId,
        userID: storedUserID,
      });
      fetchCuisineLimits();
      setShowModal(false);
    } catch (err) {
      console.error("Full error:", err.response?.data);
      alert(err.response?.data?.error || "Reservation failed");
    }
  };

  if (event) {
    return (
      <>
        <div className="min-h-screen">
          <Navbar />
          <ConfirmationModal
            show={showModal}
            onClose={() => setShowModal(false)}
            onConfirm={confirmReservation}
          />
          <div className="container mx-auto px-4 py-8 max-w-6xl">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
                  <EventDetailSection
                    event={event} // Passes the main event data object containing all event details
                    cuisineLimits={cuisineLimits} // Passes array of cuisine limits showing available spots for each cuisine type
                    isLoggedIn={isLoggedIn} // Indicate if user is logged in
                    userType={userType} // String indicating user type
                    onReservation={handleReservation} // Function to handle when vendor clicks reserve button
                    onShowVendors={() => setShowVendorModal(true)} // Function to show vendor list modal
                    onShowCuisineLimit={() => setShowCuisineLimitModal(true)} // Function to show cuisine limit modal
                    showCuisineLimitModal={showCuisineLimitModal} // Control visibility of cuisine limit modal
                    onCloseCuisineLimit={() => setShowCuisineLimitModal(false)} // Function to close cuisine limit modal
                    newCuisineLimit={newCuisineLimit} // Object containing new cuisine limit data
                    setNewCuisineLimit={setNewCuisineLimit} // Function to update cuisine limit state
                    handleAddCuisineLimit={handleAddCuisineLimit} // Function to handle adding new cuisine limit
                    cuisineTypes={cuisineTypes} // Array of cuisine types sending to CuisineLimitModal
                  />
                </div>
              </div>
              <div className="space-y-6">
                {event.strLogoFilePath && (
                  <div className="w-full h-64 rounded-lg overflow-hidden">
                    <img
                      src={`http://localhost:5000${event.strLogoFilePath}`}
                      alt={`${event.strEventName} event`}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        console.log(
                          "Image failed to load:",
                          event.strLogoFilePath
                        );
                        e.target.onerror = null;
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                )}
                <div className="space-y-4">
                  <h2 className="text-xl font-semibold">
                    {event.strEventName}, {event.strLocation}
                  </h2>
                  <div className="space-y-4 text-gray-600">
                    <p>{event.strDescription}</p>
                  </div>

                  <VendorModal
                    show={showVendorModal}
                    onClose={() => setShowVendorModal(false)}
                    vendors={vendors}
                  />
                </div>
              </div>
            </div>
            {feedbacks && feedbacks.length > 0 && (
              <div className="container mx-auto px-4 py-8 max-w-6xl">
                <FeedbackSection feedbacks={feedbacks} />
              </div>
            )}
          </div>
        </div>
      </>
    );
  }
}

export default EventInformation;
