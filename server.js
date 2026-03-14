require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "agroasistent_tajna_sifra_123";

const { protect } = require("./middleware/auth");
const Beleska = require("./models/Beleska");
const Oglas = require("./models/Oglas");
const Parcela = require("./models/Parcela");
const User = require("./models/User");

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

// Autentifikacija
app.post("/api/auth/register", async (req, res) => {
  try {
    const { ime, email, password } = req.body;
    if (!ime || !email || !password) {
      return res.status(400).json({ error: "ime, email i password su obavezni." });
    }
    const postojecikorisnik = await User.findOne({ email });
    if (postojecikorisnik) {
      return res.status(400).json({ error: "Korisnik sa ovim emailom već postoji." });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ ime, email, password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Nalog uspešno kreiran." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri registraciji." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "email i password su obavezni." });
    }
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "Pogrešan email ili lozinka." });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: "Pogrešan email ili lozinka." });
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET);
    res.json({
      token,
      user: {
        id: user._id,
        ime: user.ime,
        email: user.email
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri prijavi." });
  }
});

app.get("/api/oglasi/aktivni", async (req, res) => {
  try {
    const now = new Date();
    const oglasi = await Oglas.find({
      aktivan: true,
      $and: [
        { $or: [{ vaziOd: { $exists: false } }, { vaziOd: null }, { vaziOd: { $lte: now } }] },
        { $or: [{ vaziDo: { $exists: false } }, { vaziDo: null }, { vaziDo: { $gte: now } }] }
      ]
    });
    if (oglasi.length === 0) {
      return res.json(null);
    }
    const nasumican = oglasi[Math.floor(Math.random() * oglasi.length)];
    res.json(nasumican);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri dohvatanju oglasa." });
  }
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

// REST API za beleške (zaštićeno)
app.get("/api/beleske", protect, async (req, res) => {
  try {
    const beleske = await Beleska.find({ vlasnik_id: req.user.id }).sort({ dateTime: -1 });
    res.json(beleske);
  } catch (err) {
    res.status(500).json({ error: "Greška pri dohvatanju beleški." });
  }
});

app.post("/api/beleske", protect, async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Tekst beleške je obavezan." });
    }
    const beleska = new Beleska({ text: text.trim(), vlasnik_id: req.user.id });
    await beleska.save();
    res.status(201).json(beleska);
  } catch (err) {
    res.status(500).json({ error: "Greška pri čuvanju beleške." });
  }
});

app.delete("/api/beleske", protect, async (req, res) => {
  try {
    await Beleska.deleteMany({ vlasnik_id: req.user.id });
    res.json({ message: "Sve beleške obrisane." });
  } catch (err) {
    res.status(500).json({ error: "Greška pri brisanju beleški." });
  }
});

app.put("/api/beleske/:id/toggle", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const beleska = await Beleska.findOne({ _id: id, vlasnik_id: req.user.id });
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

app.delete("/api/beleske/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const beleska = await Beleska.findOneAndDelete({ _id: id, vlasnik_id: req.user.id });
    if (!beleska) {
      return res.status(404).json({ error: "Beleška nije pronađena." });
    }
    res.json({ message: "Beleška obrisana." });
  } catch (err) {
    res.status(500).json({ error: "Greška pri brisanju beleške." });
  }
});

// REST API za parcele (zaštićeno)
app.get("/api/parcels", protect, async (req, res) => {
  try {
    const parcele = await Parcela.find({ vlasnik_id: req.user.id });
    res.json(parcele);
  } catch (err) {
    res.status(500).json({ error: "Greška pri dohvatanju parcela." });
  }
});

app.post("/api/parcels/import", protect, async (req, res) => {
  try {
    const parcele = req.body;
    if (!Array.isArray(parcele)) {
      return res.status(400).json({ error: "Očekivan je niz objekata parcela." });
    }
    const vlasnikId = req.user.id;
    const parceleSaVlasnikom = parcele.map((p) => ({
      ...p,
      vlasnik_id: vlasnikId
    }));
    const result = await Parcela.insertMany(parceleSaVlasnikom);
    return res.status(201).json({ message: "Parcele uspešno uvezene.", count: result.length });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message || "Greška pri uvozu parcela." });
  }
});

app.put("/api/parcels/:id", protect, async (req, res) => {
  try {
    const { id } = req.params;
    const { naziv_parcele } = req.body;
    const parcela = await Parcela.findOneAndUpdate(
      { _id: id, vlasnik_id: req.user.id },
      { naziv_parcele: naziv_parcele || "" },
      { new: true }
    );
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
