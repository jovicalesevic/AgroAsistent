const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "agroasistent_tajna_sifra_123";

function protect(req, res, next) {
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Niste prijavljeni." });
  }
  const token = authHeader.replace("Bearer ", "");
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Nevalidan ili istekao token." });
  }
}

module.exports = { protect };
