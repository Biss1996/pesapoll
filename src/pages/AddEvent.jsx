import { useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { useAdmin } from '../context/AdminContext';
import AdminLogin from '../components/AdminLogin';

const AddEvent = ({ addEvent }) => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) return <AdminLogin />;

  const [formData, setFormData] = useState({
    name: '',
    venue: '',
    date: '',
    status: 'Available',
    image: '',
    description: '',
    vendorLink: '',
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
    toast.success('Event added!');
    Swal.fire({
      icon: 'success',
      title: 'Added!',
      text: 'Event added successfully!',
    });

    setFormData({
      name: '',
      venue: '',
      date: '',
      status: 'Available',
      image: '',
      description: '',
      vendorLink: '',
    });
  }

  return (
    <div className="relative bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full min-h-screen">
      <div className="py-8 px-4 mx-auto w-full max-w-screen-xl lg:py-16 text-center relative z-10">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          New Events?
        </h1>
        <p className="mb-8 text-lg text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">
          Fill in the event details accurately.
        </p>

        <div className="py-8 px-4 sm:px-6 lg:px-12 xl:px-20 2xl:px-32 w-full lg:py-16 relative z-10">
          <form
            onSubmit={handleSubmit}
            className="w-full max-w-3xl mx-auto p-4 rounded shadow bg-blue-300"
          >
            <h2 className="text-2xl text-gray-800 text-center font-bold mb-4">
              Add New Event
            </h2>
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
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  const reader = new FileReader();
                  reader.onloadend = () => {
                    setFormData((prev) => ({ ...prev, image: reader.result }));
                  };
                  if (file) reader.readAsDataURL(file);
                }}
                className="border p-2 rounded w-full"
              />
              <textarea
                name="description"
                placeholder="Event Description"
                value={formData.description}
                onChange={handleChange}
                rows={4}
                required
                className="border p-2 rounded w-full"
              />
              <input
                type="url"
                name="vendorLink"
                placeholder="Vendor Application Link (e.g., Jotform)"
                value={formData.vendorLink}
                onChange={handleChange}
                required
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
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 -z-10" />
    </div>
  );
};

export default AddEvent;
