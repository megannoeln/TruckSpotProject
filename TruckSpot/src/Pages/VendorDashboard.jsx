import React from "react";
import Navbar from "../components/Navbar/Navbar";
import SideBar from "../components/Sidebar/SideBar";
import DashboardCard from "../components/DashboardCard/DashboardCard";
import { useState, useEffect } from "react";
import axios from "axios";

function VendorDashboard() {
  const [stats, setStats] = useState({
    pastEvents: 0,
    futureEvents: 0,
    totalEvents: 0,
    mostProfitable: { name: "", revenue: 0 },
    averageRevenue: 0,
  });

  const upcomingEvents = [
    {
      intEventID: 1,
      strEventName: "Summer Food Festival",
      VendorCount: 12,
      TotalRevenue: 15000,
      dtDateOfEvent: "2024-06-15T14:00:00",
    },
    {
      intEventID: 2,
      strEventName: "Taste of Asia",
      VendorCount: 8,
      TotalRevenue: 8500,
      dtDateOfEvent: "2024-05-20T11:00:00",
    },
    {
      intEventID: 3,
      strEventName: "Street Food Market",
      VendorCount: 15,
      TotalRevenue: 12000,
      dtDateOfEvent: "2024-07-01T12:00:00",
    },
    {
      intEventID: 4,
      strEventName: "BBQ & Craft Beer Fest",
      VendorCount: 10,
      TotalRevenue: 9000,
      dtDateOfEvent: "2024-08-12T15:00:00",
    },
    {
      intEventID: 5,
      strEventName: "International Food Fair",
      VendorCount: 20,
      TotalRevenue: 25000,
      dtDateOfEvent: "2024-09-05T13:00:00",
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      const userId = sessionStorage.getItem("userID");
      try {
        const response = await axios.get(
          `http://localhost:5000/api/vendor/stats/${userId}`
        );
        setStats(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };

    fetchStats();
  }, []);

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      const userId = sessionStorage.getItem("userID");
      try {
        const response = await axios.get(
          `http://localhost:5000/api/vendor/upcoming-events/${userId}`
        );
        setUpcomingEvents(response.data);
      } catch (error) {
        console.error("Error:", error);
      }
    };
    fetchUpcomingEvents();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-12 gap-8">
          <div className="col-span-12 md:col-span-3">
            <SideBar />
          </div>

          <div className="col-span-12 md:col-span-9">
            <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-5">
              <DashboardCard
                title="Total Events Attended"
                data={stats.totalEvents}
              />
              <DashboardCard
                title="Upcoming Events"
                data={stats.futureEvents}
              />
              <DashboardCard title="Past Events" data={stats.pastEvents} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
              <DashboardCard
                title="Most Profitable Event"
                data={stats.mostProfitable}
                isCurrency={true}
              />
              <DashboardCard
                title="Average Revenue"
                data={`$${parseFloat(stats.averageRevenue).toFixed(2)}`}
                isCurrency={false}
              />
            </div>

            <div className="bg-white rounded-lg shadow">
              <h3 className="p-4 text-lg font-semibold border-b">
                Upcoming Events
              </h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Event Name
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Vendor Count
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Total Revenue
                      </th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {upcomingEvents.map((event) => (
                      <tr key={event.intEventID}>
                        <td className="px-6 py-4 text-sm">
                          {event.strEventName}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {event.VendorCount}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          ${event.TotalRevenue.toLocaleString()}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {new Date(event.dtDateOfEvent).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default VendorDashboard;
