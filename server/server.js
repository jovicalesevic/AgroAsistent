require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: process.env.CLIENT_URL || "http://localhost:5174" }));
app.use(express.json());

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI nije definisan!");
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error("JWT_SECRET nije definisan!");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB povezan."))
  .catch((err) => {
    console.error("Greška pri povezivanju sa MongoDB:", err);
    process.exit(1);
  });

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server radi." });
});

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});