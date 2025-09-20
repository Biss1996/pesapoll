import React, { useState } from 'react';

const Footer = () => {
  const [showAbout, setShowAbout] = useState(false);

  const toggleAbout = () => {
    setShowAbout(!showAbout);
  };

  return (
    <>
      {showAbout && (
        <div className="w-full max-w-screen-xl mx-auto p-6 mt-6 bg-white dark:bg-gray-800 rounded-lg shadow-inner text-gray-700 dark:text-gray-300 space-y-4 transition-all duration-500">
          <h3 className="text-lg font-bold">About Us</h3>
          <p>
            Hello! <strong>Ultimate Events</strong> is a professional platform where we provide interesting and valuable content focused on <strong>Events and Ticketing</strong>.
            We are committed to delivering high-quality, reliable, and insightful information. Our goal is to turn our passion for Events and Ticketing into a thriving online resource.
          </p>
         <p>Your go-to platform for everything related to trending events, event management and ticketing!
We are passionate about connecting people through well-organized events and easy-to-access tickets. Our mission is to deliver reliable, high-quality, and user-friendly services that make finding and managing events simple and enjoyable.

At Ultimate Events, we are committed to growing into a trusted hub for event lovers and organizers alike. We’ll continue to bring you valuable tools, updates, and resources. Thank you for supporting our journey — your trust and encouragement inspire us every day!

       
</p>
          <p>
            Visit us at:
            <a
              href="https://my-ultimate-events.vercel.app/"
              className="text-blue-500 hover:underline ml-1"
              target="_blank"
              rel="noopener noreferrer"
            >
              https://my-ultimate-events.vercel.app/
            </a>
          </p>
          <p>
            Contact:
            <a
              href="mailto:ultimateevents232@gmail.com"
              className="text-blue-500 hover:underline ml-1"
            >
              ultimateevents232@gmail.com
            </a>
          </p>
          <p className="font-semibold">Thank you for visiting Ultimate Events!</p>
        </div>
      )}

      {/* FOOTER */}
      <footer className="bg-white rounded-lg shadow-sm dark:bg-gray-900 m-1">
        <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
          <div className="sm:flex sm:items-center sm:justify-between">
            <a href="https://ultimate-events.onrender.com/" className="flex items-center mb-4 sm:mb-0 space-x-3 rtl:space-x-reverse">
              <img src="/logo1.jpg" className="h-8" alt="Logo" />
              <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Ultimate Events</span>
            </a>
            <ul className="flex flex-wrap items-center mb-6 text-sm font-medium text-gray-500 sm:mb-0 dark:text-gray-400">
              <li>
                <button onClick={toggleAbout} className="hover:underline text-blue-600 me-4 md:me-6 focus:outline-none">
                  About us
                </button>
              </li>
              <li>
                <a href="https://www.termsfeed.com/live/adde254b-c78f-4077-819a-12c301043226" className="hover:underline me-4 md:me-6">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline me-4 md:me-6">
                  Licensing
                </a>
              </li>
              <li>
                <a href="#" className="hover:underline">
                  Contact us
                </a>
              </li>
            </ul>
          </div>

          <hr className="my-6 border-gray-200 sm:mx-auto dark:border-gray-700 lg:my-8" />
          <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
            © 2025 <a href="https://ultimate-events.onrender.com/" className="hover:underline">Ultimate Events™</a>. All Rights Reserved.
          </span>
        </div>
      </footer>
    </>
  );
};

export default Footer;
