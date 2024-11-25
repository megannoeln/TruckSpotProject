import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState } from "react";
import { useEffect } from "react";
import VendorModal from '../components/VendorsAttend/VendorModal';


function EventInformation() {
  const { eventId } = useParams(); 
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [vendors, setVendors] = useState([]);
  const [showVendorModal, setShowVendorModal] = useState(false);


  useEffect(() => {
    const fetchEventDetails = async () => {
        try {
            console.log('Fetching event details for ID:', eventId);
            const response = await axios.get(`http://localhost:5000/api/events/${eventId}`);
            console.log('Event details:', response.data);
            setEvent(response.data);
        } catch (err) {
            console.error('Error fetching event details:', err);
            setError(err.message || 'Error fetching event details');
        }
    };

    const fetchVendors = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/events/${eventId}/vendors`);
        setVendors(response.data);
      } catch (err) {
        console.error('Error fetching vendors:', err);
      }
    };

    fetchEventDetails();
    fetchVendors();
}, [eventId]);

  useEffect(() => {
    console.log('Events state updated:', event);
  }, [event]);

  useEffect(() => {
    const storedUserType = sessionStorage.getItem('userType');
    const storedUserID = sessionStorage.getItem('userID');

    if (storedUserType && storedUserID) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
    } else {
      console.log('No session data found');
    }

  }, []);

  const handleReservation = async () => {
    setShowModal(true);
   };

   const confirmReservation = async () => {
    const storedUserID = sessionStorage.getItem('userID');
    console.log("Attempting reserve")
    console.log(eventId)
    try {
      const response = await axios.post('http://localhost:5000/api/reserve', {  
        eventID: eventId,
        userID: storedUserID
      });
      console.log('Reservation successful:');
      setShowModal(false);
    } catch (err) {
      console.error('Full error:', err.response?.data);
      alert(err.response?.data?.error || 'Reservation failed');
      
    }
   };


  if (event) {return (
    <>
    <div className="min-h-screen">
      <Navbar />
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg">
              <h3 className="text-lg font-semibold">Confirm Reservation</h3>
              <p className="my-4">Are you sure you want to reserve a spot for this event?</p>
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  No
                </button>
                <button
                  onClick={confirmReservation}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
          )}
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid md:grid-cols-2 gap-8">

          <div className="space-y-6">
            
            <div className="bg-white shadow-sm rounded-lg p-6 space-y-4">
              <h2 className="text-xl font-semibold">{event.strEventName}</h2>
              <p className="text-gray-600"> {new Date(event.dtDateOfEvent).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                        })}</p>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{event.strEmail}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{event.strContact}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  
                  
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{event.strLocation}</span>
                </div>
              </div>
              {/* if it's a vendor show reserve button */}
              <div className='flex justify-center items-center space-x-4'>
              {isLoggedIn && userType === '1' && new Date(event.dtDateOfEvent) > new Date() &&(
              <button 
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
              onClick={handleReservation}>
                Reserve a spot
              </button>
              )}
              <button onClick={() => setShowVendorModal(true)} className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
                Show Vendors
              </button>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden">
              <img 
                src="./src/assets/oktoberfest.jpg" 
                alt="Oktoberfest event" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{event.strEventName}, {event.strLocation}</h2>   
              <div className="space-y-4 text-gray-600">
                <p>
                 {event.strDescription}
                </p>
              </div>
              
              <VendorModal 
                show={showVendorModal} 
                onClose={() => setShowVendorModal(false)} 
                vendors={vendors} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
  }}

export default EventInformation