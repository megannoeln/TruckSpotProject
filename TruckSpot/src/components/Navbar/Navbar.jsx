import React from 'react'
import { Link, useNavigate  } from 'react-router-dom'
import { useState } from "react";
import { useEffect } from "react";

function Navbar() {

  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userType, setUserType] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Check user authentication status
    const userData = localStorage.getItem('userData');
    if (userData) {
      const parsedData = JSON.parse(userData);
      setIsLoggedIn(true);
      setUserType(parsedData.accountType);
      setUserName(`${parsedData.strFirstName} ${parsedData.strLastName}`);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    setUserType(null);
    navigate('/login');
  };
  return (
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

      {/* Show Create Event only for organizers */}
      {isLoggedIn && userType === 'organizer' && (
            <li><Link to='/create-event'>Create Event</Link></li>
          )}
          
          {/* Show My Reservation only for vendors */}
          {isLoggedIn && userType === 'vendor' && (
            <li><Link to='/reservation'>My Reservation</Link></li>
          )}


      <li><Link to='/reservation'>My Reservation</Link></li>
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
                <li className="text-sm text-gray-500 px-4 py-2 border-b">
                  Signed in as<br />
                  <span className="font-medium text-gray-800">{userName}</span>
                </li>
                <li><Link to="/myaccount">My Account</Link></li>
                {userType === 'vendor' && (
                  <li><Link to="/reservation">My Reservations</Link></li>
                )}
                {userType === 'organizer' && (
                  <li><Link to="/my-events">My Events</Link></li>
                )}
                <li className="border-t">
                  <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
                    Logout
                  </button>
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


  )
}

export default Navbar