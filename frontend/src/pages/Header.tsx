import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../utils/apiClient';
import toast from 'react-hot-toast';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in by verifying the presence of tokens
    const accessToken = localStorage.getItem('accessToken');
    setIsLoggedIn(!!accessToken);
  }, []);

  const handleLogout = async () => {
    try {
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const userId = userData.id;
        console.log("UserId : ",userId);
        localStorage.removeItem('userData');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        const response = await apiClient.post(`/user/logout/${userId}`);
        if(response.status === 200) {
            toast.success('Logged out successfully'); 
            console.log(response.data);
        }
        else{
            toast.error('Something went wrong');
            console.log(response.data);
        }
        setIsLoggedIn(false);
        window.location.href = '/login';
    } catch (error) {
        console.error('Logout failed:', error);
    }
    // Optionally, redirect to the login page
  };

  return (
    <header className="bg-blue-600 text-white p-4 shadow-md">
      <nav className="flex flex-wrap justify-between items-center">
        <div className="text-lg font-bold">
          <Link to="/" className="hover:text-yellow-300 transition duration-300">Campus Connect</Link>
        </div>
        <ul className="flex flex-wrap space-x-4 mt-2 md:mt-0">
          <li>
            <Link to="/" className="hover:text-yellow-300 transition duration-300">Home</Link>
          </li>
          <li>
            <Link to="/register" className="hover:text-yellow-300 transition duration-300">Register</Link>
          </li>
          {!isLoggedIn && (<li>
            <Link to="/login" className="hover:text-yellow-300 transition duration-300">Login</Link>
          </li>)}
          <li>
            <Link to="/profile" className="hover:text-yellow-300 transition duration-300">Profile</Link>
          </li>
          <li>
            <Link to="/event-listing" className="hover:text-yellow-300 transition duration-300">Events</Link>
          </li>
          <li>
            <Link to="/clubs" className="hover:text-yellow-300 transition duration-300">Clubs</Link>
          </li>
          <li>
            <Link to="/clubs/create" className="hover:text-yellow-300 transition duration-300">Create Club</Link>
          </li>
          {isLoggedIn && (
            <li>
              <button onClick={handleLogout} className="hover:text-yellow-300 transition duration-300">
                Logout
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}

export default Header;