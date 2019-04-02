require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const {
  Validator,
  ValidationError
} = require("express-json-validator-middleware");
const scrapeIt = require("scrape-it");

// CONTROLLERS
const getDayFeeds = require("./src/controllers/getDayFeeds");
const feed = require("./src/controllers/feed");

// SERVICES
const scrapService = require("./src/services/scrapService");
const scrap = new scrapService();
//scrap.get_pageEP();
//scrap.get_pageEM();

const app = express();

// DATABASE
mongoose
  .connect(process.env.DBURL, { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo. Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

//// TEST ENDPOINT ////
app.get("/", function(req, res) {
  res.send("Hello World!");
});

//ENDPOINTS
app.use("/feed", feed);
//app.use("/today", getDayFeeds);

app.use(function(err, req, res, next) {
  console.log(res.body);
  if (err instanceof ValidationError) {
    res.sendStatus(400);
  } else {
    res.sendStatus(500);
  }
});

//// PORT LISTENER ////
app.listen(3000, function() {
  console.log("Server listening on port 3000");
});
