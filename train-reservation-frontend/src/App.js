// File: App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [rows, setSeats] = useState([]);
  const [numSeats, setNumSeats] = useState(1);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchSeats();
  }, []);

  const fetchSeats = async () => {
    try {
      const response = await axios.get('https://ticket-reservation-repo-server.vercel.app/seats');
      setSeats(response.data);
    } catch (error) {
      console.error('Error fetching seats:', error);
    }
  };

  const bookSeats = async () => {
    try {
      const response = await axios.post('https://ticket-reservation-repo-server.vercel.app/book', { numSeats });
      setMessage(`Booked seats: ${response.data.bookedSeats.map(seat => `${seat.row_num}-${seat.seat_num}`).join(', ')}`);
      fetchSeats();
    } catch (error) {
      setMessage(error.response.data.error || 'Error booking seats');
    }
  };

  return (
    <div className="App">
      <h1>Train Seat Reservation</h1>
      <div>
        <input
          type="number"
          min="1"
          max="7"
          value={numSeats}
          onChange={(e) => setNumSeats(parseInt(e.target.value))}
        />
        <button onClick={bookSeats}>Book Seats</button>
      </div>
      <p>{message}</p>
      <div className='outer_box'>
        {rows.map((row)=>
      <div className="seat-layout">
        {row.map((seat) => 
        (
          
          <div
            key={`${seat.row_num}-${seat.seat_num}`}
            className={`seat ${seat.isBooked ? 'booked' : 'available'}`}
          >
            {seat.row_num}-{seat.seat_num}
          </div>
          
          

       ))}
      </div>
         ) }
      </div>
    </div>
  );

  

}

export default App;

// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import './App.css';

// function App() {
//   const [seats, setSeats] = useState([]);
//   const [numSeats, setNumSeats] = useState(1);
//   const [message, setMessage] = useState('');
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetchSeats();
//   }, []);

//   const fetchSeats = async () => {
//     try {
//       setIsLoading(true);
//       const response = await axios.get('https://ticket-reservation-repo-server.vercel.app/seats');
//       setSeats(response.data);
//       setError(null);
//     } catch (error) {
//       console.error('Error fetching seats:', error);
//       setError('Failed to load seats. Please try again later.');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const bookSeats = async () => {
//     try {
//       const response = await axios.post('https://ticket-reservation-repo-server.vercel.app/book', { numSeats });
//       setMessage(`Booked seats: ${response.data.bookedSeats.map(seat => `${seat.row_num}-${seat.seat_num}`).join(', ')}`);
//       fetchSeats();
//     } catch (error) {
//       setMessage(error.response?.data?.error || 'Error booking seats');
//     }
//   };

//   const renderSeat = (seat) => {
//     if (!seat) return null;
//     return (
//       <div
//         key={`${seat.row_num}-${seat.seat_num}`}
//         className={`seat ${seat.isBooked ? 'booked' : 'available'}`}
//       >
//         {seat.row_num}-{seat.seat_num}
//       </div>
//     );
//   };

//   const renderSeats = (seatsData) => {
//     if (Array.isArray(seatsData)) {
//       const rows = [];
//       for (let i = 0; i < seatsData.length; i += 7) {
//         rows.push(seatsData.slice(i, i + 7));
//       }
//       return rows.map((row, index) => (
//         <div key={index} className="seat-layout">
//           {row.map(seat => renderSeat(seat))}
//         </div>
//       ));
//     } else if (typeof seatsData === 'object') {
//       return Object.entries(seatsData).map(([key, value]) => {
//         if (Array.isArray(value)) {
//           const rows = [];
//           for (let i = 0; i < value.length; i += 7) {
//             rows.push(value.slice(i, i + 7));
//           }
//           return rows.map((row, index) => (
//             <div key={`${key}-${index}`} className="seat-layout">
//               {row.map(seat => renderSeat(seat))}
//             </div>
//           ));
//         } else {
//           return (
//             <div key={key} className="seat-layout">
//               {renderSeat(value)}
//             </div>
//           );
//         }
//       });
//     }
//     return null;
//   };

//   if (isLoading) {
//     return <div className="App">Loading...</div>;
//   }

//   if (error) {
//     return <div className="App">Error: {error}</div>;
//   }

//   return (
//     <div className="App">
//       <h1>Train Seat Reservation</h1>
//       <div>
//         <input
//           type="number"
//           min="1"
//           max="7"
//           value={numSeats}
//           onChange={(e) => setNumSeats(parseInt(e.target.value))}
//         />
//         <button onClick={bookSeats}>Book Seats</button>
//       </div>
//       <p>{message}</p>
//       <div className='outer_box'>
//         {renderSeats(seats)}
//       </div>
//     </div>
//   );
// }

// export default App;