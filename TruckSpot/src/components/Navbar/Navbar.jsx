import React from 'react'
import { Link, useNavigate  } from 'react-router-dom'
import { useState } from "react";
import { useEffect } from "react";
import axios from 'axios';

function Navbar() {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userID, setUserID] = useState(null);
  const [userName, setUserName] = useState('');

  const fetchUserDetails = async () => {
    console.log('1. Function started');
    
    const storedUserType = sessionStorage.getItem('userType');
    const storedUserID = sessionStorage.getItem('userID');
    
    console.log('2. Session values:', { storedUserType, storedUserID });
    
    try {
      console.log('3. Before API call');
      const response = await axios.get('http://localhost:5000/api/user-details', {
        params: {
          userID: storedUserID,
          userType: storedUserType
        }
      });
      console.log('4. API Response:', response.data);

      if (response.data.success) {
        setUserName(response.data.userName);
        console.log('4.5 Show respon userName', response.data.userName);
        console.log('5. Username set', {userName} , '.');
      }
    } catch (error) {
      console.error("Error details:", {
            message: error.message,
            response: error.response?.data,
            status: error.response?.status,
            config: error.config});
    }

    console.log('Out of try catch block');

  };

  useEffect(() => {
    // Check session storage for user data
    const storedUserType = sessionStorage.getItem('userType');
    const storedUserID = sessionStorage.getItem('userID');

    if (storedUserType && storedUserID) {
      setIsLoggedIn(true);
      setUserType(storedUserType);
      setUserID(storedUserID);
      // Fetch user details when session exists
      fetchUserDetails();
      console.log('Is Logged In set to:', storedUserType);
      console.log('Is Logged In set to:', storedUserID);
      
      console.log('Is Logged In set to:', true);

    } else {
      console.log('No session data found');
    }

  }, []);

  const handleLogout = () => {
    // Clear session storage
    sessionStorage.removeItem('userType');
    sessionStorage.removeItem('userID');

     // Reset states
     setIsLoggedIn(false);
     setUserType(null);
     setUserID(null);
    navigate('/login');
  };


  return (
    <>
    <nav className="navbar bg-base-250">
  <div className="navbar-start">
    
    <button 
          onClick={() => window.location.href = '/home'} 
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
      <li><Link to='/home'>Home</Link></li>
      <li><Link to='/event'>Event</Link></li>

      {/* Show Create Event only for organizers (userType === '2') */}
          {isLoggedIn && userType === '2' && (
            <li><Link to='/create-event'>Create Event</Link></li>
          )}
          
          {/* Show My Reservation only for vendors (userType === '1') */}
          {isLoggedIn && userType === '1' && (
            <li><Link to='/reservation'>My Reservation</Link></li>
      )}
      <li><Link to='#'>Contact Support</Link></li>
    </ul>
  </div>
  <div className="navbar-end">
    <div className="dropdown dropdown-end">
      <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
      <div class="relative w-10 h-10 overflow-hidden bg-gray-100 rounded-full dark:bg-gray-600">
    <svg class="absolute w-12 h-12 text-gray-400 -left-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg>
</div>
      </div>
      <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        {isLoggedIn ? (
              <>
                <h1 className="text-lg text-gray-200 px-3 py-2 bold">
                    {userName || 'User'}
                </h1>
                <li><Link to="/myaccount">My Account</Link></li>
                {userType === '1' && (
                  <li><Link to="/reservation">My Reservations</Link></li>
                )}
                {userType === '2' && (
                  <li><Link to="/my-events">My Events</Link></li>
                )}
                <li>
                  <button onClick={handleLogout} className="text-red-500 hover:text-red-700">Logout</button>
                </li>
              </>
            ) : (
              <>
                <li><Link to="/login">Login</Link></li>
                <li><Link to='/signup'>Sign Up</Link></li>
              </>
            )}
          </ul>
    </div>
  </div>
  
    </nav>
</>
  )
}

export default Navbar