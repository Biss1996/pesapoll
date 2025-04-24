import { Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Events from './pages/Events';
import AddEvent from './pages/AddEvent';
import EventManager from './pages/EventManager';
import { useEffect, useState } from 'react';

function App() {
  const [events, setEvents] = useState([]);

  // Fetch events from db.json
  useEffect(() => {
    fetch('http://localhost:3001/events')
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => toast.error('Failed to fetch events'));
  }, []);

  // Add event to db.json
  function addEvent(newEvent) {
    fetch('http://localhost:3001/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newEvent),
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents([...events, data]);
        toast.success('Event added successfully');
      })
      .catch(() => toast.error('Failed to add event'));
  }

  // Update event in db.json
  function updateEvent(updatedEvent) {
    fetch(`http://localhost:3001/events/${updatedEvent.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedEvent),
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents(events.map(event => event.id === data.id ? data : event));
        toast.success('Event updated successfully');
      })
      .catch(() => toast.error('Failed to update event'));
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Navbar><Home /></Navbar>} />
        <Route path="/events" element={<Navbar><Events events={events} /></Navbar>} />
        <Route path="/add" element={<Navbar><AddEvent addEvent={addEvent} /></Navbar>} />
        <Route path="/manager" element={<Navbar><EventManager events={events} updateEvent={updateEvent} setEvents={setEvents} /></Navbar>} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
