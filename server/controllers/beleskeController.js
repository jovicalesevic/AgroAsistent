const Beleska = require("../models/Beleska");

exports.getBeleske = async (req, res) => {
  try {
    const beleske = await Beleska.find({ vlasnik_id: req.user.id }).sort({ dateTime: -1 });
    res.json(beleske);
  } catch (err) {
    res.status(500).json({ error: "Greška pri dohvatanju beleški." });
  }
};

exports.createBeleska = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim())
      return res.status(400).json({ error: "Tekst beleške je obavezan." });
    const beleska = new Beleska({ text: text.trim(), vlasnik_id: req.user.id });
    await beleska.save();
    res.status(201).json(beleska);
  } catch (err) {
    res.status(500).json({ error: "Greška pri čuvanju beleške." });
  }
};

exports.deleteBeleska = async (req, res) => {
  try {
    const beleska = await Beleska.findOneAndDelete({ _id: req.params.id, vlasnik_id: req.user.id });
    if (!beleska)
      return res.status(404).json({ error: "Beleška nije pronađena." });
    res.json({ message: "Beleška obrisana." });
  } catch (err) {
    res.status(500).json({ error: "Greška pri brisanju beleške." });
  }
};

exports.deleteAllBeleske = async (req, res) => {
  try {
    await Beleska.deleteMany({ vlasnik_id: req.user.id });
    res.json({ message: "Sve beleške obrisane." });
  } catch (err) {
    res.status(500).json({ error: "Greška pri brisanju beleški." });
  }
};

exports.toggleBeleska = async (req, res) => {
  try {
    const beleska = await Beleska.findOne({ _id: req.params.id, vlasnik_id: req.user.id });
    if (!beleska)
      return res.status(404).json({ error: "Beleška nije pronađena." });
    beleska.zavrseno = !beleska.zavrseno;
    await beleska.save();
    res.json(beleska);
  } catch (err) {
    res.status(500).json({ error: "Greška pri ažuriranju beleške." });
  }
};
