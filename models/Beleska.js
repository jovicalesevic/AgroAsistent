const mongoose = require("mongoose");

const beleskaSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Beleska", beleskaSchema);
