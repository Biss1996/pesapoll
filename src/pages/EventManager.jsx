import { useEffect, useState } from "react";
import { useAdmin } from '../context/AdminContext';
import AdminLogin from '../components/AdminLogin';

const EventManager = () => {
  const { isAdmin } = useAdmin();

  if (!isAdmin) return <AdminLogin />;

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("https://ultimate-events.onrender.com/events")
      .then((res) => res.json())
      .then(setEvents)
      .catch((err) => console.error("Error fetching events:", err));
  }, []);

  const handleChange = (id, field, value) => {
    setEvents((prevEvents) =>
      prevEvents.map((ev) =>
        ev.id === id ? { ...ev, [field]: value } : ev
      )
    );
  };

  const handleSave = (id) => {
    const updatedEvent = events.find((ev) => ev.id === id);

    fetch(`https://ultimate-events.onrender.com/events/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedEvent),
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents((prev) =>
          prev.map((ev) => (ev.id === id ? data : ev))
        );
        alert("Event updated!");
      })
      .catch((err) => console.error("Failed to update event:", err));
  };

  const handleDelete = (id) => {
    fetch(`https://ultimate-events.onrender.com/events/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
        alert("Event has been deleted");
      })
      .catch((err) => console.error("Failed to delete event:", err));
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full top-28 left-0 -z-10">
      <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">
        <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-white">
          Update Your Events
        </h1>
        <p className="mb-8 text-lg text-gray-500 dark:text-gray-200">
          Edit your events and click save to apply changes.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.map((event) => (
            <div
              key={event.id}
              className="bg-white border rounded-xl shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
            >
              <img
                src={event.image}
                alt={event.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <input
                  className="w-full text-xl font-semibold mb-2 border-b"
                  value={event.name}
                  onChange={(e) =>
                    handleChange(event.id, "name", e.target.value)
                  }
                />
                <input
                  type="file"
                  accept="image/*"
                  className="w-full text-sm mb-2"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    const reader = new FileReader();
                    if (file) {
                      reader.onloadend = () => {
                        handleChange(event.id, "image", reader.result);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />
                <input
                  className="w-full border-b mb-2"
                  value={event.date}
                  onChange={(e) =>
                    handleChange(event.id, "date", e.target.value)
                  }
                />
                <input
                  className="w-full border-b mb-2"
                  value={event.venue}
                  onChange={(e) =>
                    handleChange(event.id, "venue", e.target.value)
                  }
                />
                <input
                  className="w-full border-b mb-2"
                  type="url"
                  placeholder="Vendor Application Link"
                  value={event.vendorLink || ''}
                  onChange={(e) =>
                    handleChange(event.id, 'vendorLink', e.target.value)
                  }
                />
                <input
                  className="w-full border-b mb-2"
                  value={event.status}
                  onChange={(e) =>
                    handleChange(event.id, "status", e.target.value)
                  }
                />
                <textarea
                  className="w-full border p-2 rounded mb-4"
                  rows={3}
                  value={event.description || ''}
                  placeholder="Event description"
                  onChange={(e) =>
                    handleChange(event.id, "description", e.target.value)
                  }
                />
                <div className="flex justify-between">
                  <button
                    onClick={() => handleSave(event.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => handleDelete(event.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventManager;
