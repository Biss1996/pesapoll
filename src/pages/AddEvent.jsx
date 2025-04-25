import { useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import App from '../App';

function AddEvent({ addEvent }) {
  const [formData, setFormData] = useState({
    name: '',
    venue: '',
    date: '',
    status: 'Available',
    image: '',
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    const newEvent = {
      ...formData,
      id: crypto.randomUUID(),
    };

    addEvent(newEvent);
    toast.success('Event added locally!');
    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: 'event added sucessfully!.',
    });

    setFormData({
      name: '',
      venue: '',
      date: '',
      status: 'Available',
      image: '',
    });
  }

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full min-h-screen">
      <div className="py-8 px-4 mx-auto w-full max-w-screen-xl lg:py-16 text-center relative z-10">
        <h1 className="mb-4 text-4xl font-bold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          New Events?
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">
        To add a new event, please complete the form below with accurate details. Make sure to include the event name, venue, date, current status, and an image URL. This information will help users discover and stay updated on upcoming events.
        </p>
      <div className="py-8 px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-32 w-full lg:py-16 relative z-10">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-3xl mx-auto pt-0 p-2 mt-6 rounded shadow"
        >
          <h2 className="text-2xl text-gray-200 text-center font-bold mb-4">Add New Event</h2>
          <div className="grid gap-4 bg-blue-300">
            <input
              type="text"
              name="name"
              placeholder="Event Name"
              value={formData.name}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="text"
              name="venue"
              placeholder="Venue"
              value={formData.venue}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="border p-2 rounded w-full"
            />
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            >
              <option value="Available">Available</option>
              <option value="Sold Out">Sold Out</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <input
              type="text"
              name="image"
              placeholder="Image URL or Path"
              value={formData.image}
              onChange={handleChange}
              className="border p-2 rounded w-full"
            />
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Add Event
            </button>
          </div>
        </form>
      </div>
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
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 -z-10" />
    </div>
  );
}
  export default AddEvent;