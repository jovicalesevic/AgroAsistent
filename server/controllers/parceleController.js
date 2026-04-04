const Parcela = require("../models/Parcela");

const MAX_PARCELA_PO_ZAHTEVU = 500;

exports.getParcele = async (req, res) => {
  try {
    const parcele = await Parcela.find({ vlasnik_id: req.user.id });
    res.json(parcele);
  } catch (err) {
    res.status(500).json({ error: "Greška pri dohvatanju parcela." });
  }
};

exports.importParcele = async (req, res) => {
  try {
    const parcele = req.body;
    if (!Array.isArray(parcele))
      return res.status(400).json({ error: "Očekivan je niz objekata parcela." });
    if (parcele.length > MAX_PARCELA_PO_ZAHTEVU) {
      return res.status(400).json({
        error: `Maksimalno ${MAX_PARCELA_PO_ZAHTEVU} parcela po zahtevu.`
      });
    }
    const parceleSaVlasnikom = parcele.map(p => ({ ...p, vlasnik_id: req.user.id }));
    const result = await Parcela.insertMany(parceleSaVlasnikom);
    res.status(201).json({ message: "Parcele uspešno uvezene.", count: result.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri uvozu parcela." });
  }
};

exports.updateParcela = async (req, res) => {
  try {
    const parcela = await Parcela.findOneAndUpdate(
      { _id: req.params.id, vlasnik_id: req.user.id },
      { naziv_parcele: req.body.naziv_parcele || "" },
      { new: true }
    );
    if (!parcela)
      return res.status(404).json({ error: "Parcela nije pronađena." });
    res.json(parcela);
  } catch (err) {
    res.status(500).json({ error: "Greška pri ažuriranju parcele." });
  }
};

exports.deleteAllParcele = async (req, res) => {
  try {
    await Parcela.deleteMany({ vlasnik_id: req.user.id })
    res.json({ message: "Sve parcele obrisane." })
  } catch (err) {
    res.status(500).json({ error: "Greška pri brisanju parcela." })
  }
};
