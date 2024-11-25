import React, { useState, useEffect } from "react";
import Navbar from '../components/Navbar/Navbar'
import SideBar from '../components/Sidebar/SideBar'
import { Link } from 'react-router-dom'
import axios from "axios";

function Trucks() {

  const [truckDetails,setTruckDetails] = useState({
    truckName : "",
    cusineType : "",
    operatingLicense : ""
  });

  const fetchTruckDetails = async () => {
    const storeUserID = sessionStorage.getItem("userID");
    try{
      const response = await axios.get(
        "http://localhost:5000/api/truck-details",
        {
          params: {
            userID: storeUserID,
          }
        }
      );
      if (response.data.success){
        setTruckDetails({
          truckName : response.data.truckName,
          cusineType: response.data.custineType,
          operatingLicense : response.data.operatingLicense
        });
      }
    } catch (error)
    {
      console.error("Error details:" , {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      })
    }
  }

  useEffect(() => {
    fetchTruckDetails();
  }, []);

  return (
    <>
        <Navbar/>
            <div className="container mx-auto px-4 py-8 gap-40">
                <div className="grid grid-cols-12 gap-8">
                {/* Sidebar */}
                    <div className="col-span-12 md:col-span-3">
                        <SideBar/>
                    </div>
                    <div className="col-span-12 md:col-span-9">
            <div className=" rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">My Truck</h2>
              <div className="flex items-start gap-8">
                        <div>
                            <div className="w-full aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden">
                                 (
                                <img
                                    // src={logoPreview}
                                    alt="Event Logo Preview"
                                    className="w-80 aspect-square object-cover"
                                />
                                ) : (
                                <div className="w-70 aspect-square object-cover">
                                    <span className="text-gray-500">No picture selected</span>
                                </div>
                                )
                            </div>    
                        </div>
                <div className="mb-15">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Name</p>
                    <p className="font-medium mb-5">{truckDetails.truckName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Cusine Type</p>
                    <p className="font-medium mb-5">{truckDetails.cusineType}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Operating License</p>
                    <p className="font-medium mb-5">{truckDetails.operatingLicense}</p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                
                <Link to="/updateaccount">
                  <button className="w-32 bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors">
                    Edit
                  </button>
                </Link>
              </div>
            </div>
          </div>
                    </div>
            </div>
    </>
  )
}

export default Trucks