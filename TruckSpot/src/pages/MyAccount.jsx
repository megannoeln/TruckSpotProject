import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar/Navbar";
import SideBar from "../components/Sidebar/SideBar";
import { Link } from "react-router-dom";
import axios from "axios";

function MyAccount() {
  const [userName, setUserName] = useState("");
  const [userDetails, setUserDetails] = useState({
    accountType: "",
    businessName: "Chipotle", // example value, assuming fetched from another API or hardcoded
    foodType: "Mexican", // example value
    phoneNumber: "",
    email: "",
  });

  // Fetch user details function
  const fetchUserDetails = async () => {
    console.log("1. Function started");

    const storedUserType = sessionStorage.getItem("userType");
    const storedUserID = sessionStorage.getItem("userID");

    console.log("2. Session values:", { storedUserType, storedUserID });

    try {
      console.log("3. Before API call");
      const response = await axios.get(
        "http://localhost:5000/api/user-details",
        {
          params: {
            userID: storedUserID,
            userType: storedUserType,
          },
        }
      );
      console.log("4. API Response:", response.data);

      if (response.data.success) {
        setUserName(response.data.userName);
        setUserDetails({
          accountType: storedUserType === "1" ? "Vendor" : "Organizer",
          phoneNumber: response.data.phoneNumber,
          email: response.data.email,
          businessName: userDetails.businessName,
          foodType: userDetails.foodType,
        });
        console.log("5. User details set", { userDetails });
      }
    } catch (error) {
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });
    }

    console.log("Out of try catch block");
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4 py-8 gap-40">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <div className="col-span-12 md:col-span-3">
            <SideBar />
          </div>
          {/* Main Content */}
          <div className="col-span-12 md:col-span-9">
            <div className=" rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-6">Personal Details</h2>

              {/* Profile Photo Section */}
              <div className="flex items-start gap-8">
                <div>
                  <div className="w-48 aspect-square bg-gray-200 rounded-lg mb-2 overflow-hidden">
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
                    <p className="font-medium mb-5">{userName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">
                      Type of Account
                    </p>
                    <p className="font-medium mb-5">
                      {userDetails.accountType}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Business Name</p>
                    <p className="font-medium mb-5">
                      {userDetails.businessName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Type of Food</p>
                    <p className="font-medium mb-1">{userDetails.foodType}</p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                <h2 className="text-xl font-semibold pt-4 mb-6">
                  Contact Details
                </h2>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Phone Number</p>
                  <p className="font-medium mb-2">{userDetails.phoneNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-1">Email</p>
                  <p className="font-medium mb-2">{userDetails.email}</p>
                </div>
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
  );
}

export default MyAccount;
