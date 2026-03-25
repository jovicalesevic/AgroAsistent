require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { clerkMiddleware } = require("./middleware/auth");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: [
    "http://localhost:5173",
    "http://localhost:5174",
    process.env.CLIENT_URL
  ].filter(Boolean)
}));

app.use(express.json());
app.use(clerkMiddleware());

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI nije definisan!");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB povezan."))
  .catch((err) => {
    console.error("Greška pri povezivanju sa MongoDB:", err);
    process.exit(1);
  });

app.use("/api/auth", require("./routes/auth"));
app.use("/api/beleske", require("./routes/beleske"));
app.use("/api/parcels", require("./routes/parcele"));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server radi." });
});

app.listen(PORT, () => {
  console.log(`Server radi na http://localhost:${PORT}`);
});


