import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";

function Navbar() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userID, setUserID] = useState(null);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");

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
        console.log(response.data);
        setUserName(response.data.userName);
        setUserAvatar(response.data.avatar);
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
    const storedUserType = sessionStorage.getItem("userType");
    const storedUserID = sessionStorage.getItem("userID");

    if (storedUserType && storedUserID) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
      setUserID(storedUserID);

      fetchUserDetails();
    } else {
      console.log("No session data found");
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.removeItem("userType");
    sessionStorage.removeItem("userID");

    setIsLoggedIn(false);
    setUserType(null);
    setUserID(null);
    navigate("/login");
  };

  return (
    <>
      <nav className="navbar bg-base-250">
        <div className="navbar-start">
          <button
            onClick={() => (window.location.href = "/home")}
            className="btn btn-ghost normal-case px-2 hover:bg-base-200 "
          >
            <img
              src="./src/assets/logo.jpg"
              alt="Logo"
              className="h-12 w-auto object-contain"
            />
          </button>
        </div>
        <div className="navbar-center hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link to="/home">Home</Link>
            </li>
            <li>
              <Link to="/event">Events</Link>
            </li>

            {/* Show Create Event only for organizers (userType === '2') */}
            {isLoggedIn && userType === "2" && (
              <li>
                <Link to="/myevent">My Events</Link>
              </li>
            )}

            {/* Show My Reservation only for vendors (userType === '1') */}
            {isLoggedIn && userType === "1" && (
              <li>
                <Link to="/reservation">My Reservations</Link>
              </li>
            )}
          </ul>
        </div>
        <div className="navbar-end">
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={userAvatar}
                  alt="user avatar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              {isLoggedIn ? (
                <>
                  <h1 className="text-lg text-gray-200 px-3 py-2 bold">
                    {userName || "User"}
                  </h1>
                  <li>
                    <Link to="/myaccount">My Account</Link>
                  </li>
                  <li>
                    <button
                      onClick={handleLogout}
                      className="text-red-500 hover:text-red-700"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login">Login</Link>
                  </li>
                  <li>
                    <Link to="/signup">Sign Up</Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
}

export default Navbar;
