require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');

const app = express();

//// CONNECT TO DB ////
mongoose
  .connect(
    process.env.DBURL,
    { useNewUrlParser: true }
  )
  .then(x => {
    console.log(
      `Connected to Mongo. Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });


//// TEST ENDPOINT ////
app.get('/', function (req, res) {
    res.send('Hello World!');
  });

//// PORT LISTENER ////
app.listen(3000, function () {
    console.log('Server listening on port 3000');
  });