

// import React from 'react';
// import { useNavigate } from 'react-router-dom';

// const EventCard = ({ event }) => {
//   const navigate = useNavigate();

//   const handleClick = () => {
//     navigate('/event-details', { state: { event } });
//   };

//   return (
//     <div
//       onClick={handleClick}
//       className="bg-card shadow-md pt-0 rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer hover:scale-105 duration-300"
//     >
//       <img
//         src={event.image || 'https://via.placeholder.com/300x200?text=No+Image'}
//         alt={event.name}
//         className="w-full max-h-[500px] object-contain"
//       />
//       <div className="p-4">
//         <h1 className="text-lg text-card-foreground font-bold mb-2">{event.name}</h1>
//         <h2 className="text-lg text-card-foreground font-semibold mb-2">{event.venue}</h2>
//         <p className="text-sm text-muted-foreground mb-1">{event.date}</p>
//         <span
//           className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
//             event.status === 'Cancelled'
//               ? 'bg-destructive text-destructive-foreground'
//               : event.status === 'Available'
//               ? 'bg-primary text-primary-foreground'
//               : event.status === 'Sold Out'
//               ? 'bg-secondary text-secondary-foreground'
//               : 'bg-muted text-muted-foreground'
//           }`}
//         >
//           {event.status}
//         </span>
//       </div>
//     </div>
//   );
// };

// export default EventCard;


import React from 'react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/event-details', { state: { event } });
  };

  return (
    <div
      onClick={handleClick}
      className="flex items-center bg-card shadow-md rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow cursor-pointer hover:scale-[1.02] duration-300"
    >
      <img
        src={event.image || 'https://via.placeholder.com/300x200?text=No+Image'}
        alt={event.name}
        className="w-32 sm:w-40 md:w-48 h-32 object-cover"
      />
      <div className="p-4 flex-1">
        <h1 className="text-lg text-card-foreground font-bold mb-1">{event.name}</h1>
        <h2 className="text-md text-card-foreground font-semibold mb-1">{event.venue}</h2>
        <p className="text-sm text-muted-foreground mb-1">{event.date}</p>
        <span
          className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${
            event.status === 'Cancelled'
              ? 'bg-destructive text-destructive-foreground'
              : event.status === 'Available'
              ? 'bg-primary text-primary-foreground'
              : event.status === 'Sold Out'
              ? 'bg-secondary text-secondary-foreground'
              : 'bg-muted text-muted-foreground'
          }`}
        >
          {event.status}
        </span>
      </div>
    </div>
  );
};

export default EventCard;
