const Oglas = require("../models/Oglas");

const OGLAS_POLJA = [
  "naslov",
  "sadrzaj",
  "tip",
  "mediaUrl",
  "link",
  "vaziOd",
  "vaziDo",
  "aktivan"
];

function teloOglasa(body) {
  const out = {};
  for (const k of OGLAS_POLJA) {
    if (body[k] !== undefined) out[k] = body[k];
  }
  return out;
}

exports.getAktivniOglas = async (req, res) => {
  try {
    const now = new Date();
    const oglasi = await Oglas.find({
      aktivan: true,
      $and: [
        { $or: [{ vaziOd: { $exists: false } }, { vaziOd: null }, { vaziOd: { $lte: now } }] },
        { $or: [{ vaziDo: { $exists: false } }, { vaziDo: null }, { vaziDo: { $gte: now } }] }
      ]
    });
    if (oglasi.length === 0) return res.json(null);
    const nasumican = oglasi[Math.floor(Math.random() * oglasi.length)];
    res.json(nasumican);
  } catch (err) {
    res.status(500).json({ error: "Greška pri dohvatanju oglasa." });
  }
};

exports.getAllOglasi = async (req, res) => {
  try {
    const oglasi = await Oglas.find().sort({ createdAt: -1 });
    res.json(oglasi);
  } catch (err) {
    res.status(500).json({ error: "Greška pri dohvatanju oglasa." });
  }
};

exports.createOglas = async (req, res) => {
  try {
    const oglas = new Oglas(teloOglasa(req.body));
    await oglas.save();
    res.status(201).json(oglas);
  } catch (err) {
    res.status(500).json({ error: "Greška pri kreiranju oglasa." });
  }
};

exports.updateOglas = async (req, res) => {
  try {
    const oglas = await Oglas.findByIdAndUpdate(req.params.id, teloOglasa(req.body), {
      new: true
    });
    if (!oglas) return res.status(404).json({ error: "Oglas nije pronađen." });
    res.json(oglas);
  } catch (err) {
    res.status(500).json({ error: "Greška pri ažuriranju oglasa." });
  }
};

exports.deleteOglas = async (req, res) => {
  try {
    const oglas = await Oglas.findByIdAndDelete(req.params.id);
    if (!oglas) return res.status(404).json({ error: "Oglas nije pronađen." });
    res.json({ message: "Oglas obrisan." });
  } catch (err) {
    res.status(500).json({ error: "Greška pri brisanju oglasa." });
  }
};

exports.toggleOglas = async (req, res) => {
  try {
    const oglas = await Oglas.findById(req.params.id);
    if (!oglas) return res.status(404).json({ error: "Oglas nije pronađen." });
    oglas.aktivan = !oglas.aktivan;
    await oglas.save();
    res.json(oglas);
  } catch (err) {
    res.status(500).json({ error: "Greška pri toglovanju oglasa." });
  }
};

