require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const CronJob = require("cron").CronJob;
const { ValidationError } = require("express-json-validator-middleware");

// CONTROLLERS
const feed = require("./src/controllers/feed");
const getDayFeeds = require("./src/controllers/getDayFeeds");

// SERVICE
const scrapService = require("./src/services/scrapService");
const startDate = new Date();

//SERVICE JOB EVERY 6 HOURS
const job = new CronJob("0 */6 * * *", () => {
  scrapService.get_pageEP();
  scrapService.get_pageEM();
  let updateDate = new Date();
  console.log("Updating feed at ", updateDate);
});

const app = express();
const port = 3000;

// DATABASE
mongoose
  .connect(process.env.DBURL, { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo. Database name: "${x.connections[0].name}"`
    );
    console.log("Start feed at ", startDate);
    scrapService.get_pageEP();
    scrapService.get_pageEM();
    job.start();
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

// HOME
app.get("/", (req, res) => {
  res.send("Welcome to DailyTrends Service");
});

// ENDPOINTS
app.use("/feed", feed);
app.use("/today", getDayFeeds);

app.use((err, req, res, next) => {
  console.log(res.body);
  if (err instanceof ValidationError) {
    res.sendStatus(400);
  } else {
    res.sendStatus(500);
  }
});

//// PORT LISTENER ////
app.listen(port, () => console.log(`DailyTrends started on PORT ${port}`));
