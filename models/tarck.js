const mongoose = require("mongoose");

const trackSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  trackName: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  goal: {
    type: String,
    required: true,
  },
  comments: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now(),
  },
  data: {
    type: Object,
  },
});

const Track = mongoose.model("Track", trackSchema);

module.exports = Track;
