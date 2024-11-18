import React from 'react'
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/Sidebar/SideBar'
import { Link } from 'react-router-dom'
function UpdateAccount() {
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
                <form action="">
                    {/* Profile Photo Section */}
                    <div className="flex items-start gap-8">
                        <div>
                            <div className=" w-50 aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden">
                                 (
                                <img
                                    // src={logoPreview}
                                    alt="Event Logo Preview"
                                    className="w-50 aspect-square object-cover"
                                />
                                ) : (
                                <div className="w-50 aspect-square flex items-center justify-center">
                                    <span className="text-gray-500">No picture selected</span>
                                </div>
                                )
                            </div>
                            <input
                                type="file"
                                accept="image/*"
                                // onChange={handleLogoChange}
                                className="file-input file-input-bordered w-65"
                            />
                            
                        </div>
                        <div className="mb-10">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">First Name</p>
                                <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Last Name</p>
                                <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                                <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Email</p>
                                <input type="text" placeholder="Type here" className="input input-bordered w-full max-w-xs" />
                            </div>
                        </div>
                    </div>
                <div className="space-y-6 mt-3">
                    
                    <button className="w-32 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">Submit</button>
                </div>
            </form>
            </div>
                    </div>
                </div>
        </div>
</>
  )
}

export default UpdateAccount