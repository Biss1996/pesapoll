import { useEffect, useState } from "react";

function EventManager() {
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
    fetch(`https://ultimate-events.onrender.com/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedEvent),
    })
      .then((res) => res.json())
      .then((data) => {
        setEvents(events.map((ev) => (ev.id === id ? data : ev)));
        alert("Event updated!");

        console.log("Event updated:", data);
      })
      .catch((err) => console.error("Failed to update event:", err));
  };

  const handleDelete = (id) => {
    fetch(`https://ultimate-events.onrender.com/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setEvents((prev) => prev.filter((ev) => ev.id !== id));
        alert("Event has been deleted")
      })
      .catch((err) => console.error("Failed to delete event:", err));
  };

  return (
    <div className="bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-900 w-full h-full  top-28 left-0 -z-10">
    <div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 z-10 relative">   
    <h1 className="mb-4 text-4xl font-bold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
          Update Your Events
        </h1>
        <p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 lg:px-48 dark:text-gray-200">
        Here you can organize and manage all your events. update event details i.e Name, Venue, Date and keep track of their status.
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
                onChange={(e) => handleChange(event.id, "name", e.target.value)}
              />
              <p className="text-sm text-white-600 mb-2">
                <input
                  className="w-full border-b"
                  value={event.date}
                  onChange={(e) => handleChange(event.id, "date", e.target.value)}
                />
              </p>
              <p className="text-sm text-white-600 mb-2">
                <input
                  className="w-full border-b"
                  value={event.venue}
                  onChange={(e) => handleChange(event.id, "venue", e.target.value)}
                />
              </p>
              <p className="text-sm text-white-600 mb-4">
                <input
                  className="bg-blue-1000 w-full border-b"
                  value={event.status}
                  onChange={(e) => handleChange(event.id, "status", e.target.value)}
                />
              </p>
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
    /</div>
  );
}

export default EventManager;
