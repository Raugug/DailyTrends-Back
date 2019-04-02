const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const feedSchema = new Schema(
  {
    title: String,
    body: String,
    link: String,
    image: {
      imgPath: String,
      imgName: String
    },
    source: String,
    publisher: {
      type: String,
      enum: ["EL MUNDO", "EL PAÍS"]
    }
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" }
  }
);

const Feed = mongoose.model("Feed", feedSchema);
module.exports = Feed;
