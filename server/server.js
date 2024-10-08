// File: server.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'train_reservation'
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');
});



// API endpoint to get all seats
app.get('/api/seats', (req, res) => {
  db.query('SELECT * FROM seats', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching seats' });
      return;
    }
    final=[]
    for(i =1;i<=12;i++){
      row=[]
      if(i==12){
        row.push(...results)
        final.push(row)
        break
      }
      for(j=0;j<7;j++){ 
        row.push(results.shift())
      }
      final.push(row)
      
    }
    console.log(final)
    res.json(final);
   
  });
});

// API endpoint to book seats
app.post('/api/book', (req, res) => 
  {
  const { numSeats } = req.body;
 
  if (numSeats < 1 || numSeats > 7) {
    res.status(400).json({ error: 'Invalid number of seats' });
    return;
  }

  db.query('SELECT * FROM seats WHERE isBooked = 0 ORDER BY row_num, seat_num', (err, availableSeats) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching available seats' });
      return;
    }
    
    const bookedSeats = [];
    let remainingSeats = numSeats;
    //availableSeats will contain array of objects these objects are rows in table "seats" every row which satisfy condition isBooked=false is returned as an object 
    for (let i = 0; i < availableSeats.length && remainingSeats > 0; i++) 
      {
      const currentRow = availableSeats[i].row_num;
      //objects in availableSeats(array) will be iteratively passed through the filter function only objects whose row num is satisfied will be stored in array  
      const seatsInCurrentRow = availableSeats.filter(seat => seat.row_num === currentRow );

      if (seatsInCurrentRow.length >= remainingSeats) {
        bookedSeats.push(...seatsInCurrentRow.slice(0, remainingSeats));
        remainingSeats = 0;
      } 
      
    }

    if (remainingSeats > 0 && availableSeats.length!=0) {
      res.status(400).json({ error: 'required number of seats are not available in same row,but you can book seperately if required' });
      return;
    }
    else if (remainingSeats > 0 && availableSeats.length===0) {
      res.status(400).json({ error: 'sorry!! all seats are booked' });
      return;
    }

    const updatePromises = bookedSeats.map(seat =>
      new Promise((resolve, reject) => {
        db.query('UPDATE seats SET isBooked = 1 WHERE id = ?', [seat.id], (err) => {
          if (err) reject(err);
          else resolve();
        });
      })
    );

    Promise.all(updatePromises)
      .then(() => {
        res.json({ bookedSeats });
      })
      .catch(() => {
        res.status(500).json({ error: 'Error booking seats' });
      });
  });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  
});



app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Welcome To MERN Stack Tutorial');
  });