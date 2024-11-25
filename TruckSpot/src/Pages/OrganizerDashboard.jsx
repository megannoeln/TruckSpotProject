import React from 'react';
import Navbar from '../components/Navbar/Navbar';
import SideBar from '../components/Sidebar/SideBar';

function OrganizerDashboard() {
    const stats = {
        totalEvents: 25,
        upcomingEvents: 8,
        pastEvents: 15,
        avgAttendance: 150,
      };
     
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
                
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm">Total Events</h3>
                    <p className="text-2xl font-semibold">{stats.totalEvents}</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm">Upcoming Events</h3>
                    <p className="text-2xl font-semibold">{stats.upcomingEvents}</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm">Past Events</h3>
                    <p className="text-2xl font-semibold">{stats.pastEvents}</p>
                  </div>
                  <div className="bg-white p-6 rounded-lg shadow-sm">
                    <h3 className="text-gray-500 text-sm">Average Attendance</h3>
                    <p className="text-2xl font-semibold">{stats.avgAttendance}</p>
                  </div>
                </div>
     
                {/* Recent Events */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                  <h2 className="text-xl font-semibold mb-4">Recent Events</h2>
                  <table className="min-w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500">Event Name</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500">Date</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500">Location</th>
                        <th className="px-6 py-3 text-left text-sm font-semibold text-gray-500">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {/* Add event rows here */}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      );
}

export default OrganizerDashboard