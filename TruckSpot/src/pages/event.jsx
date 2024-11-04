import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import SeachBox from '../components/SearchBox/SeachBox'
import SmallCard from '../components/Cards/SmallCard'
import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'


function Event() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/allevents');
        console.log('Events data:', response.data);
        setEvents(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message || 'Error loading events');
      } finally {
      }
    };

    fetchEvents();
  }, []);

  
  useEffect(() => {
    console.log('Events state updated:', events);
  }, [events]);


  return (
    <>
      <Navbar />
      <SeachBox />
      <div className="grid lg:grid-cols-5 md:grid-cols-2 px-40 py-5 gap-8">
        {events.length > 0 ? (
          events.map((event) => (
            <SmallCard 
              key={event.intEventID}
              event={event}
            />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 py-10">
            No events found
          </div>
        )}
      </div>
    </>
  );
}


export default Event