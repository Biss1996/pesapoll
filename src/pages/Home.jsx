import React from "react";

function Home() {
  return (
    <div className="bg-white dark:bg-gray-900 py-10 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
        <h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Welcome to Ultimate Events!
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">
          Your go-to platform for organizing, tracking, and showcasing events effortlessly. Whether you're planning a meetup, concert, or conference, manage every detail in one place with ease and style.
        </p>
        <a
          href="/events"
          className="inline-flex justify-between items-center py-1 px-1 pe-4 mb-7 text-xl text-gray-100 bg-blue-100 rounded-full dark:bg-blue-900 dark:text-blue-300 hover:bg-gray-100 dark:hover:bg-blue-800"
        >
          <span className="text-xs bg-blue-600 rounded-full text-white px-4 py-1.5 me-3">New</span>
          <span className="text-l text-gray-100 font-medium">Check out our new trending events!</span>
          <svg
            className="w-2.5 h-2.5 ms-2 rtl:rotate-180"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 6 10"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m1 9 4-4-4-4"
            />
          </svg>
        </a>
      </div>
      <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full absolute top-0 left-0 z-0"></div>
    </div>
  );
}

export default Home;
