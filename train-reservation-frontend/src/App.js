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

  // return (
  //   <div className="App">
  //     <h1>Train Seat Reservation</h1>
  //     <div>
  //       <input
  //         type="number"
  //         min="1"
  //         max="7"
  //         value={numSeats}
  //         onChange={(e) => setNumSeats(parseInt(e.target.value))}
  //       />
  //       <button onClick={bookSeats}>Book Seats</button>
  //     </div>
  //     <p>{message}</p>
  //     <div className='outer_box'>
  //       {rows.map((row)=>
  //     <div className="seat-layout">
  //       {row.map((seat) => 
  //       (
          
  //         <div
  //           key={`${seat.row_num}-${seat.seat_num}`}
  //           className={`seat ${seat.isBooked ? 'booked' : 'available'}`}
  //         >
  //           {seat.row_num}-{seat.seat_num}
  //         </div>
          
          

  //      ))}
  //     </div>
  //        ) }
  //     </div>
  //   </div>
  // );

  return (
    
  <div className="App">
    <div><h1>hiii</h1></div> 
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
        
      <div className="seat-layout">
        {rows.map((seat) => 
        (
          
          <div
            key={`${seat.row_num}-${seat.seat_num}`}
            className={`seat ${seat.isBooked ? 'booked' : 'available'}`}
          >
            {seat.row_num}-{seat.seat_num}
          </div>
          
          

       ))}
      </div>
         
      </div>
    </div>
  );

}

export default App;