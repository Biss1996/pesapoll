import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ children }) => {
  return (
    <>
      <nav className="bg-white shadow-md border-b border-gray-200 px-8 py-4">
        <div className="max-w-screen-xl mx-auto flex items-center justify-between">
          <div>
            <Link to="/" className="text-xl font-bold text-blue-600">Ultimate Events</Link>
          </div>
          <div className="flex space-x-10 text-lg font-medium text-gray-700">
            <Link to="/" className="hover:text-blue-500 transition-colors">Home</Link>
            <Link to="/events" className="hover:text-blue-500 transition-colors">Events</Link>
            <Link to="/add" className="hover:text-blue-500 transition-colors">Add Event</Link>
            <Link to="/manager" className="hover:text-blue-500 transition-colors">Event Manager</Link>
          </div>
        </div>
      </nav>
      <main>{children}</main>
    </>
  );
};

export default Navbar;
