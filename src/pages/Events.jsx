// pages/Events.jsx
import { useState } from 'react';
import EventList from '../components/EventList';

function Events({ events }) {
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');

  const filteredEvents = events.filter(({ name, status }) => {
    const matchesStatus = filter === 'All' || status === filter;
    const matchesSearch = name.toLowerCase().includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="p-6 bg-white dark:bg-gray-900 py-10 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">
      <h1 className="text-2xl font-bold mb-4 text-center">Upcoming Events</h1>

      <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
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
        
        <EventList events={filteredEvents} />
        
      ) : (
        <p className="text-center text-gray-500">No matching events found.</p>
      )}
    </div>
    
  );
}

export default Events;
