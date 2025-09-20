import { Route, Routes, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Events from './pages/Events';
import AddEvent from './pages/AddEvent';
import EventManager from './pages/EventManager';
import { useEffect, useState } from 'react';
import SingleEvent from './pages/SingleEvent';
import { useAdmin } from './context/AdminContext';
import AdminLogin from './pages/AdminLogin';

function App() {
  const [events, setEvents] = useState([]);
  const { isAdmin } = useAdmin();

  useEffect(() => {
    fetch('https://ultimate-vendors.onrender.com/events')
      .then((res) => res.json())
      .then((data) => setEvents(data))
      .catch(() => toast.error('Failed to fetch events'));
  }, []);

  function addEvent(newEvent) {
    fetch('https://ultimate-vendors.onrender.com/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEvent),
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents([...events, data]);
        toast.success('Event added successfully');
      })
      .catch(() => toast.error('Failed to add event'));
  }

  function updateEvent(updatedEvent) {
    fetch(`https://ultimate-vendors.onrender.com/events/${updatedEvent.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedEvent),
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents(events.map((event) => (event.id === data.id ? data : event)));
        toast.success('Event updated successfully');
      })
      .catch(() => toast.error('Failed to update event'));
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/events" element={<Events events={events} />} />
          <Route path="/event-details" element={<SingleEvent />} />

          {/* Admin-only routes */}
          <Route
            path="/add"
            element={isAdmin ? <AddEvent addEvent={addEvent} /> : <Navigate to="/" replace />}
          />
          <Route
            path="/manager"
            element={isAdmin ? (
              <EventManager events={events} updateEvent={updateEvent} setEvents={setEvents} />
            ) : (
              <Navigate to="/" replace />
            )}
          />
          <Route path="/admin-login" element={<AdminLogin />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
}

export default App;
