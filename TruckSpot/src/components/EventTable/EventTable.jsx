import React from "react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import ReviewModal from "../Modal/ReviewModal";

function EventTable() {
  const [events, setEvents] = useState([]);
  const storedUserID = sessionStorage.getItem("userID");
  const storedUserType = sessionStorage.getItem("userType");
  const navigate = useNavigate();
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [review, setReview] = useState({
    rating: 0,
    revenue: "",
    comment: "",
  });

  const handleRowClick = (eventID) => {
    navigate(`/eventinformation/${eventID}`);
  };

  const handleButtonClick = (e, callback) => {
    e.stopPropagation(); // This prevents the row click event
    callback();
  };

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/myreservationTable`,
          {
            params: {
              userID: storedUserID,
              userType: storedUserType,
            },
          }
        );
        console.log("Events data:", response.data);
        setEvents(response.data);
      } catch (err) {
        console.error("Error fetching events:", err);
        setError(err.message || "Error loading events");
      } finally {
      }
    };

    fetchEvents();
  }, []);

  const handleCancel = async (eventID) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await axios.post("http://localhost:5000/api/cancel-reservation", {
          eventID,
          userID: storedUserID,
        });
        // Remove the cancelled event from the list
        setEvents(events.filter((event) => event.intEventID !== eventID));
        alert("Reservation cancelled successfully");
      } catch (error) {
        console.error("Error cancelling reservation:", error);
      }
    }
  };

  const handleReview = (eventID) => {
    setSelectedEventId(eventID);
    setReview({
      rating: 0,
      revenue: "",
      comment: "",
    });
    setShowReviewModal(true);
  };

  const handleSubmitReview = async () => {
    try {
      await axios.post("http://localhost:5000/api/vendor-feedback", {
        intVendorID: storedUserID,
        intEventID: selectedEventId,
        monTotalRevenue: review.revenue,
        intRating: review.rating,
        strVendorComment: review.comment,
      });
      setShowReviewModal(false);
      alert("Review submitted successfully");
    } catch (error) {
      console.error("Error submitting review:", error);
      alert("Failed to submit review");
    }
  };

  const handleDelete = async (eventID) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) {
      try {
        await axios.post("http://localhost:5000/api/delete-event", {
          eventID,
        });
        // Remove the deleted event from the list
        setEvents(events.filter((event) => event.intEventID !== eventID));
        alert("Event deleted successfully");
      } catch (error) {
        console.error("Error deleting event:", error);
        alert("Failed to delete an event");
      }
    }
  };

  const handleEventDetails = async (eventID) => {};

  const formattedDate = new Date(events.dtDateOfEvent).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  );

  return (
    <div className="overflow-x-auto">
      <table className="table">
        {/* head */}
        <thead>
          <tr>
            <th>#</th>
            <th>Event Name</th>
            <th>Event Date</th>
            <th>Organizer</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event, index) => {
            // Check if event date is in the past
            const eventDate = new Date(event.dtDateOfEvent);
            const today = new Date();
            const isPastEvent = eventDate < today;
            return (
              <tr
                key={event.intEventID}
                className="hover cursor-pointer"
                onClick={() => handleRowClick(event.intEventID)}
              >
                <th>{index + 1}</th>

                <td>{event.strEventName}</td>

                <td>
                  {eventDate.toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </td>
                <td>{event.OrganizerName}</td>
                <td>
                  {storedUserType === "1" &&
                    (isPastEvent ? (
                      <button
                        onClick={(e) =>
                          handleButtonClick(e, () =>
                            handleReview(event.intEventID)
                          )
                        }
                        className="btn btn-primary btn-sm"
                      >
                        Review
                      </button>
                    ) : (
                      <button
                        onClick={(e) =>
                          handleButtonClick(e, () =>
                            handleCancel(event.intEventID)
                          )
                        }
                        className="btn btn-error btn-sm"
                      >
                        Cancel
                      </button>
                    ))}
                  {storedUserType === "2" &&
                    (isPastEvent ? (
                      <Link to={`/eventinformation/${event.intEventID}`}>
                        <button
                          onClick={(e) =>
                            handleButtonClick(e, () =>
                              handleEventDetails(event.intEventID)
                            )
                          }
                          className="btn btn-primary btn-sm"
                        >
                          Details
                        </button>
                      </Link>
                    ) : (
                      <button
                        onClick={(e) =>
                          handleButtonClick(e, () =>
                            handleDelete(event.intEventID)
                          )
                        }
                        className="btn btn-error btn-sm"
                      >
                        Delete
                      </button>
                    ))}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <ReviewModal
        show={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setReview({
            rating: 0,
            revenue: "",
            comment: "",
          });
        }}
        onSubmit={handleSubmitReview}
        review={review}
        setReview={setReview}
      />
    </div>
  );
}

export default EventTable;
