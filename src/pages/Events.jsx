import { useState } from 'react';
import EventCard from '../components/EventCard';

function Events({ events }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredEvents = events.filter(({ name, status }) => {
    const matchesStatus = filter === 'All' || status === filter;
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 px-4 py-4">
      <div className="max-w-screen-xl mx-auto py-4 px-2 sm:px-4">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-3">
          Upcoming Events!...
        </h1>
        <h2 className="text-base sm:text-lg md:text-xl italic text-center text-gray-700 dark:text-gray-300 mb-5">
          From electrifying concerts to inspiring workshops, our upcoming events are packed with unforgettable experiences. Let the adventure begin!
        </h2>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center sm:gap-4 mb-6">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="w-full sm:w-2/3 md:w-1/2 px-4 py-2 border border-gray-300 rounded text-sm"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full sm:w-1/3 md:w-1/4 px-4 py-2 border border-gray-300 rounded text-sm"
          >
            <option value="All">All</option>
            <option value="Available">Available</option>
            <option value="Sold Out">Sold Out</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="flex flex-col gap-4">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500 mt-4">No matching events found.</p>
        )}
      </div>
    </div>
  );
}

export default Events;
