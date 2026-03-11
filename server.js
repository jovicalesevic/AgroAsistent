require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const Beleska = require("./models/Beleska");
const Parcela = require("./models/Parcela");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

if (process.env.MONGO_URI) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB povezan."))
    .catch((err) => console.error("Greška pri povezivanju sa MongoDB:", err));
} else {
  console.warn("MONGO_URI nije definisan u .env – dodaj ga za konekciju ka bazi.");
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

app.get("/api/location", async (req, res) => {
  try {
    const { latitude, longitude } = req.query;
    if (!latitude || !longitude) {
      return res.status(400).json({ error: "latitude i longitude su obavezni." });
    }
    const url =
      "https://geocoding-api.open-meteo.com/v1/reverse?latitude=" +
      latitude +
      "&longitude=" +
      longitude +
      "&language=sr&format=json";
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri dohvatanju lokacije." });
  }
});

// REST API za beleške
app.get("/api/beleske", async (req, res) => {
  try {
    const beleske = await Beleska.find().sort({ dateTime: -1 });
    res.json(beleske);
  } catch (err) {
    res.status(500).json({ error: "Greška pri dohvatanju beleški." });
  }
});

app.post("/api/beleske", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Tekst beleške je obavezan." });
    }
    const beleska = new Beleska({ text: text.trim() });
    await beleska.save();
    res.status(201).json(beleska);
  } catch (err) {
    res.status(500).json({ error: "Greška pri čuvanju beleške." });
  }
});

app.delete("/api/beleske", async (req, res) => {
  try {
    await Beleska.deleteMany({});
    res.json({ message: "Sve beleške obrisane." });
  } catch (err) {
    res.status(500).json({ error: "Greška pri brisanju beleški." });
  }
});

app.put("/api/beleske/:id/toggle", async (req, res) => {
  try {
    const { id } = req.params;
    const beleska = await Beleska.findById(id);
    if (!beleska) {
      return res.status(404).json({ error: "Beleška nije pronađena." });
    }
    beleska.zavrseno = !beleska.zavrseno;
    await beleska.save();
    res.json(beleska);
  } catch (err) {
    res.status(500).json({ error: "Greška pri ažuriranju beleške." });
  }
});

app.delete("/api/beleske/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const beleska = await Beleska.findByIdAndDelete(id);
    if (!beleska) {
      return res.status(404).json({ error: "Beleška nije pronađena." });
    }
    res.json({ message: "Beleška obrisana." });
  } catch (err) {
    res.status(500).json({ error: "Greška pri brisanju beleške." });
  }
});

// REST API za parcele
app.get("/api/parcels", async (req, res) => {
  try {
    const parcele = await Parcela.find();
    res.json(parcele);
  } catch (err) {
    res.status(500).json({ error: "Greška pri dohvatanju parcela." });
  }
});

app.post("/api/parcels/import", async (req, res) => {
  try {
    const parcele = req.body;
    if (!Array.isArray(parcele)) {
      return res.status(400).json({ error: "Očekivan je niz objekata parcela." });
    }
    const result = await Parcela.insertMany(parcele);
    res.status(201).json({ message: "Parcele uspešno uvezene.", count: result.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri uvozu parcela." });
  }
});

app.put("/api/parcels/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { naziv_parcele } = req.body;
    const parcela = await Parcela.findByIdAndUpdate(id, { naziv_parcele: naziv_parcele || "" }, { new: true });
    if (!parcela) {
      return res.status(404).json({ error: "Parcela nije pronađena." });
    }
    res.json(parcela);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri ažuriranju parcele." });
  }
});

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});
