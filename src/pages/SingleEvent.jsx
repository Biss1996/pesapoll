import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SingleEvent = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const event = state?.event;

  if (!event) {
    return (
      <div className="p-6 min-h-screen flex flex-col justify-center items-center bg-gray-100 text-center">
        <h2 className="text-2xl font-bold text-red-600">No event data provided.</h2>
        <button
          onClick={() => navigate(-1)}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 dark:from-gray-900 dark:to-black px-4 py-10">
      <div className="max-w-5xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden grid lg:grid-cols-2">
        <div className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-full overflow-hidden">
          <img
            src={event.image || 'https://via.placeholder.com/800x400?text=No+Image'}
            alt={event.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {event.name}
            </h1>
            <p className="text-sm sm:text-base text-gray-500 dark:text-gray-400 mb-1">
              📅 {event.date}
            </p>
            <p className="text-base sm:text-lg font-medium text-gray-700 dark:text-gray-300 mb-3">
              📍 {event.venue}
            </p>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-200 mb-6 leading-relaxed">
              {event.description || 'No description provided.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <span
              className={`inline-block px-4 py-1 rounded-full text-sm font-semibold ${
                event.status === 'Cancelled'
                  ? 'bg-red-600 text-white'
                  : event.status === 'Available'
                  ? 'bg-green-600 text-white'
                  : event.status === 'Sold Out'
                  ? 'bg-yellow-400 text-black'
                  : 'bg-gray-300 text-black'
              }`}
            >
              {event.status}
            </span>

            {event.vendorLink && (
              <a
                href={event.vendorLink}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-green-600 transition text-sm sm:text-base"
              >
                Apply as a Vendor
              </a>
            )}
          </div>

          <div className="mt-10">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition text-sm sm:text-base"
            >
              ⬅ Back to Events
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleEvent;
