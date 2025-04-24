import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-blue-600 font-semibold transition-colors'
      : 'text-gray-700 hover:text-blue-500 transition-colors';

  return (
    <nav className="bg-white shadow-md border-b border-gray-200 px-8 py-4">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between">
        <NavLink to="/" className="text-xl font-bold text-blue-600">Ultimate Events</NavLink>
        <div className="flex space-x-10 text-lg font-medium">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/events" className={linkClass}>Events</NavLink>
          <NavLink to="/add" className={linkClass}>Add Event</NavLink>
          <NavLink to="/manager" className={linkClass}>Event Manager</NavLink>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
