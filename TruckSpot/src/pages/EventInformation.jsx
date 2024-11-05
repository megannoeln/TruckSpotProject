import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useState } from "react";
import { useEffect } from "react";


function EventInformation() {
  const { eventId } = useParams(); 
  const [event, setEvent] = useState(null);
  const [error, setError] = useState(null);

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

    fetchEventDetails();
}, [eventId]);

  useEffect(() => {
    console.log('Events state updated:', event);
  }, [event]);


  if (event) {return (
    <>
    <div className="min-h-screen">
      <Navbar />
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
              
              <button className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors">
                Reserve a spot
              </button>
              
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
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
  }}

export default EventInformation