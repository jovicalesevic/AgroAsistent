const mongoose = require("mongoose");

const beleskaSchema = new mongoose.Schema({
  vlasnik_id: {
    type: String,
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

beleskaSchema.index({ vlasnik_id: 1 });

module.exports = mongoose.model("Beleska", beleskaSchema);
