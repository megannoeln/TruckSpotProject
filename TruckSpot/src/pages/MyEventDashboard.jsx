import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/Sidebar/SideBar'
import { Link } from 'react-router-dom'

function MyEventDashboard() {
  return (
    <>
        <Navbar/>
            <div className="container mx-auto px-4 py-8 gap-40">
                <div className="grid grid-cols-12 gap-8">
                {/* Sidebar */}
                    <div className="col-span-12 md:col-span-3">
                        <SideBar/>
                    </div>
                        Event Dashboard

                        <Link to='/addevent'><button className="w-32 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">Add an event</button></Link>
                    </div>
            </div>
    </>
  )
}

export default MyEventDashboard