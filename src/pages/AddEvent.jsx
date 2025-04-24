import { useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

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
    <section className="bg-white dark:bg-gray-900 py-10 bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern.svg')] dark:bg-[url('https://flowbite.s3.amazonaws.com/docs/jumbotron/hero-pattern-dark.svg')]">

    <form
      onSubmit={handleSubmit}
      className="max-w-screen-sm mx-auto p-6 bg-white mt-6 rounded shadow"
    >
      <h2 className="text-xl text-blue-600 text-center font-bold mb-4">Add New Event</h2>
      <div className="grid gap-4">
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
    /</section>
  );
}

export default AddEvent;
