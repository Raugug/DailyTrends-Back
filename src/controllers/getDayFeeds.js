const express = require("express");
const router = express.Router();
const Feed = require("../models/feed");
const moment = require("moment");

//READ
router.get("/", (req, res, next) => {
  let today = moment().startOf("day");
  console.log(today);
  Feed.find({ created_at: { $gte: today } })
    .sort({ created_at: -1 })
    .then(feeds => res.send({ status: "OK", feeds }))
    .catch(e => console.log(e));
});

module.exports = router;
