import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext'; // adjust path if needed

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAdmin } = useAdmin();

  const linkClass = ({ isActive }) =>
    isActive
      ? 'text-blue-400 font-semibold transition-colors'
      : 'text-white hover:text-blue-300 transition-colors';

  return (
    <nav className="bg-blue-700 dark:bg-gray-900 w-full shadow-md">
      <div className="max-w-screen-xl mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <img src="/logo2.jpg" className="h-12 sm:h-16 w-auto" alt="Logo" />
          <NavLink to="/" className="text-2xl sm:text-3xl font-bold text-white">
            Ultimate Events
          </NavLink>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-8 text-lg font-medium">
          <NavLink to="/" className={linkClass}>Home</NavLink>
          <NavLink to="/events" className={linkClass}>Events</NavLink>
          {isAdmin && <NavLink to="/add" className={linkClass}>Add Event</NavLink>}
          {isAdmin && <NavLink to="/manager" className={linkClass}>Event Manager</NavLink>}
        </div>

        {/* Hamburger Button */}
        <button
          className="md:hidden text-white text-2xl focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
      <div className="md:hidden px-6 pb-4 flex flex-wrap gap-7 text-white text-lg font-medium bg-blue-700">
  <NavLink to="/" className={linkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
  <NavLink to="/events" className={linkClass} onClick={() => setMenuOpen(false)}>Events</NavLink>
  {isAdmin && (
    <NavLink to="/add" className={linkClass} onClick={() => setMenuOpen(false)}>Add Event</NavLink>
  )}
  {isAdmin && (
    <NavLink to="/manager" className={linkClass} onClick={() => setMenuOpen(false)}>Event Manager</NavLink>
  )}
</div>


      )}
    </nav>
  );
};

export default Navbar;
