import React from "react";
import Navbar from "../components/Navbar/Navbar";
import SeachBox from "../components/SearchBox/SeachBox";
import axios from "axios";
import BigCard from "../components/Cards/BigCard";
import MediumCard from "../components/Cards/MediumCard";
import { useState } from "react";
import { useEffect } from "react";
function home() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/events");
        setEvents(response.data);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message || "Error fetching events");
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {}, [events]);

  return (
    <>
      <Navbar />
      <SeachBox />
      <div className="grid lg:grid-cols-2 md:grid-cols-2 px-40 py-5 gap-8">
        {/* Big card takes 2 columns */}
        {events.length > 0 && (
          <div className="col-span-2">
            <BigCard
              title={events[0].strEventName}
              description={events[0].strDescription}
              // image={events[0].EventImage}
              eventId={events[0].intEventID}
              date={events[0].dtDateOfEvent}
            />
          </div>
        )}
        {/* Each medium card takes 1 column */}
        {events.length > 0 && (
          <div>
            <MediumCard
              title={events[1].strEventName}
              description={events[1].strDescription}
              // image={events[0].EventImage}
              eventId={events[1].intEventID}
              date={events[1].dtDateOfEvent}
            />
          </div>
        )}
        {events.length > 0 && (
          <div>
            <MediumCard
              title={events[2].strEventName}
              description={events[2].strDescription}
              // image={events[0].EventImage}
              eventId={events[2].intEventID}
              date={events[2].dtDateOfEvent}
            />
          </div>
        )}
      </div>
    </>
  );
}

export default home;
