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

  //delete account function
  const handleDeleteAccount = async () => {
    const storedUserID = sessionStorage.getItem("userID");
    const storedUserType = sessionStorage.getItem("userType");

    if (storedUserID && storedUserType) {
      if (!window.confirm("Are you sure you want to delete your account?")) {
        return;
      }

      try {
        // Call the backend to delete the account
        const response = await axios.post(
          "http://localhost:5000/api/delete-account",
          {
            userID: storedUserID,
            userType: storedUserType,
          }
        );

        // Check for success response from backend
        if (response.data.success) {
          sessionStorage.clear();

          // Redirect to homepage after account deletion
          window.location.href = "/"; // Redirect to home page (adjust URL as needed)
        } else {
          // Handle failure
          alert(response.data.message); // Show the message returned by the backend
        }
      } catch (error) {
        console.error("Error deleting account:", error);
        alert("There was an error deleting the account.");
      }
    } else {
      alert("User ID or User Type is missing.");
    }
  };

  // Fetch user details function
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
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: error.config,
      });
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

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
                  Personal Details
                </h2>

                <div className="flex gap-8">
                  <div>
                    <div className="w-48 h-48 rounded-lg overflow-hidden">
                      <img
                        src={userDetails.avatar || "/api/placeholder/192/192"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="space-y-8 flex-1 max-w-sm py-2">
                    <div>
                      <p className="text-sm text-gray-400">Name</p>
                      <p className="mt-2">{userName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Phone Number</p>
                      <p className="mt-2">{userDetails.phoneNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Email</p>
                      <p className="mt-2">{userDetails.email}</p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Link to="/updateaccount">
                    <button className="w-24 py-1.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                      Edit
                    </button>
                  </Link>
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
    </>
  );
}
export default MyAccount;
