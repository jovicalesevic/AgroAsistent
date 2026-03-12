const mongoose = require("mongoose");

const beleskaSchema = new mongoose.Schema({
  vlasnik_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
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
