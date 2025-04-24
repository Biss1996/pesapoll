import React from 'react';

const EventCard = ({ event }) => {
  return (
    <div className="bg-white shadow-md pt-0 rounded-lg overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow">
      <img
        src={event.image || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={event.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h1 className="text-lg text-black font-bold mb-2">{event.name}</h1>
        <h2 className="text-lg text-black font-semibold mb-2">{event.venue}</h2>
        <p className="text-sm text-gray-500 mb-1">{event.date}</p>
        <p className="text-sm text-gray-600">{event.description}</p>
        <p className={`mt-2 text-lg font-medium ${event.status === 'Cancelled' ? 'bg-red-500 text-white-100' : event.status === 'Available' ? 'bg-blue-500 text-white-600' : event.status === 'Sold Out' ? 'text-red-600 bg-orange-200' : 'text-yellow-600'}`}>
          {event.status}
        </p>
      </div>
    </div>
  );
};

export default EventCard;
