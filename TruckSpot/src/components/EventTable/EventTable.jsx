import React from 'react';
import { Link } from 'react-router-dom';
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from 'react-router-dom';

function EventTable() {

    const [events, setEvents] = useState([]);
    const storedUserID = sessionStorage.getItem('userID');
    const navigate = useNavigate();
    
    const handleRowClick = (eventID) => {
        navigate(`/eventinformation/${eventID}`);
    };

    const handleButtonClick = (e, callback) => {
        e.stopPropagation();  // This prevents the row click event
        callback();
    };

    useEffect(() => {
      const fetchEvents = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/myreservationTable?userID=${storedUserID}`);
          console.log('Events data:', response.data);
          setEvents(response.data);
        } catch (err) {
          console.error('Error fetching events:', err);
          setError(err.message || 'Error loading events');
        } finally {
        }
      };
  
      fetchEvents();
    }, []);

    const handleCancel = async (eventID) => {
        if (window.confirm('Are you sure you want to cancel this reservation?')) {
          try {
            await axios.post('http://localhost:5000/api/cancel-reservation', {
              eventID,
              userID: storedUserID
            });
            // Remove the cancelled event from the list
            setEvents(events.filter(event => event.intEventID !== eventID));
            alert('Reservation cancelled successfully');
          } catch (error) {
            console.error('Error cancelling reservation:', error);
            alert('Failed to cancel reservation');
          }
        }
      };
  
      const handleReview = (eventID) => {
        console.log('Review for event:', eventID);
      };
  

    const formattedDate = new Date(events.dtDateOfEvent).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
        });

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
                <tr key={event.intEventID} 
                className="hover cursor-pointer"
                onClick={() => handleRowClick(event.intEventID)}>
                  <th>{index + 1}</th>
                 
                  <td>{event.strEventName}</td>
                  
                  <td>{eventDate.toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                  })}</td>
                  <td>{event.OrganizerName}</td>
                  <td>
                    {isPastEvent ? (
                      <button 
                      onClick={(e) => handleButtonClick(e, () => handleReview(event.intEventID))}
                        className="btn btn-primary btn-sm"
                      >
                        Review
                      </button>
                    ) : (
                      <button 
                      onClick={(e) => handleButtonClick(e, () => handleCancel(event.intEventID))}
                        className="btn btn-error btn-sm"
                      >
                        Cancel
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
}

export default EventTable