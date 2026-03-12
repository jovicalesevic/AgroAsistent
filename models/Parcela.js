const mongoose = require("mongoose");

const parcelaSchema = new mongoose.Schema({
  vlasnik_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: false
  },
  katastarska_opstina: {
    type: String,
    required: true
  },
  broj_parcele: {
    type: String,
    required: true
  },
  naziv_parcele: {
    type: String,
    default: ""
  },
  povrsina_ha: {
    type: Number,
    required: true
  },
  kultura: {
    type: String
  },
  aktivna_obrada: {
    type: Boolean,
    default: true
  }
});

module.exports = mongoose.model("Parcela", parcelaSchema);
