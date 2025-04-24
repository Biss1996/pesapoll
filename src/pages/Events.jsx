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
    <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full min-h-screen pt-0 pb-0">
      <div className="py-8 pt-0 px-4 mx-auto max-w-screen-xl text-center lg:py-16">
        <h1 className="text-4xl mt-0 font-bold mb-4 text-center">Upcoming Events!...</h1>
        <h2 className= "text-2xl mt-0 font-italic mb-4 text-center">From electrifying concerts to inspiring workshops, our upcoming events are packed with unforgettable experiences. Let the adventure begin!</h2>

        <div className="flex flex-col md:flex-row justify-center gap-4 mb-0">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events..."
            className="px-4 py-2 border rounded w-full md:w-1/2"
          />
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-4 py-2 border rounded w-full md:w-1/4"
          >
            <option value="All">All</option>
            <option value="Available">Available</option>
            <option value="Sold Out">Sold Out</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
            {filteredEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">No matching events found.</p>
        )}
      </div>
    </div>
  );
}

export default Events;
