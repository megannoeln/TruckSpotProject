import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import SideBar from "../components/Sidebar/SideBar";
import { Link } from "react-router-dom";
import axios from "axios";

function MyAccount() {
  const [userName, setUserName] = useState("");
  const [userDetails, setUserDetails] = useState({
    accountType: "",
    phoneNumber: "",
    email: "",
    avatar: "",
  });
  const [truckDetails, setTruckDetails] = useState(null);

  const handleDeleteAccount = async () => {
    const storedUserID = sessionStorage.getItem("userID");
    const storedUserType = sessionStorage.getItem("userType");

    if (!window.confirm("Are you sure you want to delete your account?")) {
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/delete-account",
        {
          userID: storedUserID,
          userType: storedUserType,
        }
      );

      if (response.data.success) {
        sessionStorage.clear();
        window.location.href = "/";
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("There was an error deleting the account.");
    }
  };

  const fetchUserDetails = async () => {
    const storedUserType = sessionStorage.getItem("userType");
    const storedUserID = sessionStorage.getItem("userID");
    try {
      const response = await axios.get(
        "http://localhost:5000/api/user-details",
        {
          params: {
            userID: storedUserID,
            userType: storedUserType,
          },
        }
      );

      if (response.data.success) {
        setUserName(response.data.userName);
        setUserDetails({
          accountType: storedUserType === "1" ? "Vendor" : "Organizer",
          phoneNumber: response.data.phoneNumber,
          email: response.data.email,
          avatar: response.data.avatar,
        });
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
    }
  };

  const fetchTruckDetails = async () => {
    const storedUserID = sessionStorage.getItem("userID");
    const storedUserType = sessionStorage.getItem("userType");

    if (storedUserType === "1") {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/truck-details",
          {
            params: {
              userID: storedUserID,
            },
          }
        );
        if (response.data.success && response.data.truckName) {
          setTruckDetails({
            truckName: response.data.truckName,
            cusineType: response.data.custineType,
            strOperatingLicense: response.data.strOperatingLicense,
          });
        } else {
          setTruckDetails(null);
        }
      } catch (error) {
        console.error("Error fetching truck details:", error);
        setTruckDetails(null);
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchTruckDetails();
  }, []);

  const isVendor = userDetails.accountType === "Vendor";

  return (
    <>
      <Navbar />
      <div className="min-h-screen text-gray-300">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-3">
              <SideBar />
            </div>
            <div className="col-span-12 md:col-span-9">
              <div className="space-y-8">
                <h2 className="text-xl font-semibold text-gray-100">
                  Account Information
                </h2>

                <div className="flex gap-8">
                  {/* Avatar on the left */}
                  <div className="flex-shrink-0">
                    <div className="w-48 h-48 rounded-lg overflow-hidden">
                      <img
                        src={userDetails.avatar || "/api/placeholder/192/192"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  {/* Details container */}
                  <div className="flex-1">
                    <div className="grid grid-cols-2 gap-8">
                      {/* Personal Details */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-gray-100">
                          Personal Details
                        </h3>
                        <div>
                          <p className="text-sm text-gray-400">Name</p>
                          <p className="mt-1">{userName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Phone Number</p>
                          <p className="mt-1">{userDetails.phoneNumber}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-400">Email</p>
                          <p className="mt-1">{userDetails.email}</p>
                        </div>
                      </div>

                      {/* Truck Details - Only shown for vendors */}
                      {isVendor && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-gray-100">
                            Truck Details
                          </h3>
                          {truckDetails ? (
                            <>
                              <div>
                                <p className="text-sm text-gray-400">
                                  Truck Name
                                </p>
                                <p className="mt-1">{truckDetails.truckName}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">
                                  Cuisine Type
                                </p>
                                <p className="mt-1">
                                  {truckDetails.cusineType}
                                </p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-400">
                                  Operating License
                                </p>
                                <p className="mt-1">
                                  {truckDetails.strOperatingLicense}
                                </p>
                              </div>
                            </>
                          ) : (
                            <div className="space-y-4">
                              <p className="text-gray-400">
                                No truck data available for this vendor.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 mt-8">
                      <Link to="/updateaccount">
                        <button className="w-24 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                          Edit Profile
                        </button>
                      </Link>
                      {isVendor && (
                        <Link to={truckDetails ? "/updatetruck" : "/addtruck"}>
                          <button className="w-24 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                            {truckDetails ? "Edit Truck" : "Add Truck"}
                          </button>
                        </Link>
                      )}
                      <button
                        onClick={handleDeleteAccount}
                        className="w-32 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyAccount;
