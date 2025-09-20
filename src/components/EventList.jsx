//All events
function EventList({ events }) {
    const statusStyles = {
      Available: 'text-green-600 bg-green-100',
      'Sold Out': 'text-red-700 bg-yellow-100',
      Cancelled: 'text-red-600 bg-red-100',
    };
  
    return (
      <div className="grid gap-6 max-w-3xl mx-auto">
        {events.map((event) => (
          <div key={event.id} className="flex bg-white rounded-xl shadow border overflow-hidden">
            <img src={event.image} alt={event.name} className="w-32 h-32 object-cover" />
            <div className="flex-1 p-4 flex justify-between items-center">
              <div>
                <h2 className="text-xl text-gray-800 font-semibold">{event.name}</h2>
                <p className="text-sm text-gray-500">{event.date}</p>
                <p className="text-sm text-gray-500">{event.venue}</p>
              </div>
              <span className={`text-sm px-3 py-1 rounded-full font-medium ${statusStyles[event.status] || 'bg-gray-100 text-gray-700'}`}>
                {event.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }
  
  export default EventList;