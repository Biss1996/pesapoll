import React from "react";
import { useNavigate } from "react-router-dom"; 

function Home() {
  const navigate = useNavigate(); 

  const handleNavigate = () => {
    navigate("/events"); 
  };

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full min-h-screen pt-0 pb-0">
      <div className="py-8 pt-0 px-4 mx-auto max-w-screen-xl text-center lg:py-16 relative z-10">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Welcome to
        </h1>
        <img src="/banner2.png"  alt="banner" className="pl-0 pr-0"/>

        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">
We have lot's of new trending events that you can't afford to miss</p>
        <button
          onClick={handleNavigate} 
          className="inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-xl text-gray-100 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 hover:bg-gray-100 dark:hover:bg-blue-800"
        >
          <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 me-3">New</span>
          <span className="text-l text-gray-100 font-medium">Check out our new trending events!</span>
        </button>
      </div>
      <div className="absolute top-0 left-0 w-full h-full z-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900"></div>
    </div>
  );
}

export default Home;
