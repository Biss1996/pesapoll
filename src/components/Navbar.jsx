import React from 'react';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-blue-600 font-semibold transition-colors'
      : 'text-gray-700 hover:text-blue-500 transition-colors';

  return (
    <nav className="bg-blue-700 shadow-sm dark:bg-gray-900 w-full m-1 z-50">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-6 py-4">
      <img src="/logo2.jpg" className="h-20" alt="Logo" />
        <NavLink to="/" className="text-5xl font-bold text-white">Ultimate Events</NavLink>
        <div className="flex space-x-10 text-blue text-white text-xl font-medium">
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
