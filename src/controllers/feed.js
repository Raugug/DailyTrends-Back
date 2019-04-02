const express = require("express");
const router = express.Router();
const Feed = require("../models/feed");
const bodyParser = require("body-parser");
const { Validator } = require("express-json-validator-middleware");

const validator = new Validator({ allErrors: true });
const { validate } = validator;

//VALIDATOR
const feedJsonSchema = {
  type: "object",
  required: ["title", "body"],
  properties: {
    title: {
      type: "string"
    },
    body: {
      type: "string"
    },
    link: {
      type: "string"
    },
    image: {
      imgPath: {
        type: "string"
      },
      imgName: {
        type: "string"
      }
    },
    source: {
      type: "string"
    },
    publisher: {
      type: "string"
    }
  }
};

//CREATE
router.post(
  "/create",
  [bodyParser.json(), validate({ body: feedJsonSchema })],
  (req, res, next) => {
    let { title, body, link, image, source, publisher } = req.body;
    Feed.create({ title, body, link, image, source, publisher })
      .then(res.send("OK"))
      .catch(e => console.log(e));
  }
);

//READ
router.get("/all", (req, res, next) => {
  Feed.find()
    .sort({ date: 1, time: 1 })
    .then(feeds => res.send({ status: "OK", feeds }))
    .catch(e => console.log(e));
});

router.get("/:feedId", (req, res, next) => {
  Feed.findById(req.params.feedId)
    .then(feed => res.send({ status: "OK", feed }))
    .catch(e => console.log(e));
});

//UPDATE
router.put(
  "/edit",
  [bodyParser.json(), validate({ body: feedJsonSchema })],
  (req, res, next) => {
    let { id, title, body, link, image, source, publisher } = req.body;
    Feed.findByIdAndUpdate(
      id,
      { title, body, link, image, source, publisher },
      { new: true }
    )
      .then(feed => {
        res.status(200).json({ status: "OK", feed });
      })
      .catch(e => console.log(e));
  }
);

//DELETE
router.post("/delete/:feedId", (req, res, next) => {
  console.log("ENTRA DELETE");
  const { feedId } = req.params.feedId;
  Feed.findOneAndDelete({ _id: feedId })
    .then(feed => res.send({ status: "OK", feed }))
    .catch(e => console.log(e));
});

module.exports = router;