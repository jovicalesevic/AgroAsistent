const mongoose = require("mongoose");

const beleskaSchema = new mongoose.Schema({
  text: {
    type: String,
    required: true
  },
  dateTime: {
    type: Date,
    default: Date.now
  },
  zavrseno: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model("Beleska", beleskaSchema);
