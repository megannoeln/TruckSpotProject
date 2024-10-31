import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/Sidebar/SideBar'
import { Link } from 'react-router-dom'

function MyAccount() {
  return (
    <>
        <Navbar/>
            <div className="container mx-auto px-4 py-8 gap-40">
                <div className="grid grid-cols-12 gap-8">
                {/* Sidebar */}
                    <div className="col-span-12 md:col-span-3">
                        <SideBar/>
                    </div>
                {/* Main Content */}
                <div className="col-span-12 md:col-span-9">
                    <div className=" rounded-lg shadow-sm p-6">
                    <h2 className="text-xl font-semibold mb-6">Personal Details</h2>
    
                    {/* Profile Photo Section */}
                    <div className="flex items-start gap-8">
                        <div>
                            <div className="w-48 h-64 bg-gray-200 rounded-lg mb-2 overflow-hidden">
                            <img 
                                src="/placeholder-profile.jpg" 
                                alt="Profile" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div className="mb-15">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Name</p>
                            <p className="font-medium mb-5">Michael Rohan</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Type of Account</p>
                            <p className="font-medium mb-5">Vendor</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Business Name</p>
                            <p className="font-medium mb-5">Chipotle</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Type of Food</p>
                            <p className="font-medium mb-1">Mexican</p>
                        </div>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="space-y-6">
                    <h2 className="text-xl font-semibold pt-4 mb-6">Contact Details</h2>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                        <p className="font-medium mb-2">09034867656</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-500 mb-1">Email</p>
                        <p className="font-medium mb-2">tomilolo@me.com</p>
                    </div>
                    <Link to='/updateaccount'><button className="w-32 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">Edit</button></Link>
                </div>
                </div>
                        </div>
                    </div>
            </div>
    </>
  )
}

export default MyAccount