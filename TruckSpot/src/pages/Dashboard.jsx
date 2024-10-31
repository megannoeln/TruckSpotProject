import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/Sidebar/SideBar'

function Dashboard() {
  return (
    <>
        <Navbar/>
            <div className="container mx-auto px-4 py-8 gap-40">
                <div className="grid grid-cols-12 gap-8">
                {/* Sidebar */}
                    <div className="col-span-12 md:col-span-3">
                        <SideBar/>
                    </div>
                        Dashboard
                    </div>
            </div>
    </>
  )
}

export default Dashboard