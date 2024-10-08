// File: server.js
const express = require('express');
const cors = require('cors');
const db=require('./db');

const app = express();
app.use(cors());
app.use(express.json());

// const db = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'train_reservation'
// });



// db.connect((err) => {
//   if (err) {
//     console.error('Error connecting to database:', err);
//     return;
//   }
//   console.log('Connected to database');
// });



// API endpoint to get all seats
app.get('/seats', (req, res) => {
  console.log("before")
  db.query('SELECT * FROM seats order by id', (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching seats' });
      return;
    }
    final=[]
    for(i =1;i<=12;i++){
      row=[]
      if(i==12){
        row.push(...results.rows)
        final.push(row)
        break
      }
      for(j=0;j<7;j++){ 
        temp=results.rows.shift()
        row.push(temp)
      }
      final.push(row)
      
    }
    console.log("hiiiia123")
    
    res.json(final);
    console.log("response is",final)
   
  });
});

// API endpoint to book seats
app.post('/book', (req, res) => 
  {
  const { numSeats } = req.body;
 
  if (numSeats < 1 || numSeats > 7) {
    res.status(400).json({ error: 'Invalid number of seats' });
    return;
  }

  db.query('SELECT * FROM seats WHERE isBooked = FALSE ORDER BY row_num, seat_num;', (err, availableSeats) => {
    if (err) {
      res.status(500).json({ error: 'Error fetching available seats' });
      return;
    }
    console.log("available seats are",availableSeats)
    console.log(availableSeats.rowCount)
    const bookedSeats = [];
    let remainingSeats = numSeats;
    
    //availableSeats will contain array of objects these objects are rows in table "seats" every row which satisfy condition isBooked=false is returned as an object 
    for (let i = 0; i < availableSeats.rowCount && remainingSeats > 0; i++) 
      {
      const currentRow = availableSeats.rows[i].row_num;
      console.log("inside for loop",currentRow)
      //objects in availableSeats(array) will be iteratively passed through the filter function only objects whose row num is satisfied will be stored in array  
      const seatsInCurrentRow = availableSeats.rows.filter(seat => seat.row_num === currentRow );
      console.log(seatsInCurrentRow)
      if (seatsInCurrentRow.length >= remainingSeats) {
        bookedSeats.push(...seatsInCurrentRow.slice(0, remainingSeats));
        remainingSeats = 0;
      } 
      
    }
    console.log(bookedSeats)
    console.log(remainingSeats)

    if (remainingSeats > 0 && availableSeats.rowCount!=0) {
      res.status(400).json({ error: 'required number of seats are not available in same row,but you can book seperately if required' });
      return;
    }
    if (remainingSeats > 0 && availableSeats.rowCount===0) {
      res.status(400).json({ error: 'sorry!! all seats are booked' });
      return;
    }

    const updatePromises = bookedSeats.map(seat =>
      new Promise((resolve, reject) => {
        console.log(`UPDATE seats SET isBooked = true WHERE id =${seat.id}`)
        db.query(`UPDATE seats SET isBooked = true WHERE id =(${seat.id})`,  (err) => {
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log("hiii")
});



app.get('/', (request, response) => {
    console.log(request);
    return response.status(234).send('Welcome To MERN Stack Tutorial');
    
  });


  module.exports = app;