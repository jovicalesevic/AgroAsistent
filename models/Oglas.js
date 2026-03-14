const mongoose = require("mongoose");

const oglasSchema = new mongoose.Schema({
  naslov: {
    type: String
  },
  sadrzaj: {
    type: String
  },
  tip: {
    type: String,
    enum: ["tekst", "slika", "video"]
  },
  mediaUrl: {
    type: String
  },
  link: {
    type: String
  },
  vaziOd: {
    type: Date
  },
  vaziDo: {
    type: Date
  },
  aktivan: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Oglas", oglasSchema);
