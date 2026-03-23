const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.register = async (req, res) => {
  try {
    const { ime, email, password } = req.body;
    if (!ime || !email || !password)
      return res.status(400).json({ error: "ime, email i password su obavezni." });

    const postojeci = await User.findOne({ email: email.toLowerCase().trim() });
    if (postojeci)
      return res.status(400).json({ error: "Korisnik sa ovim emailom već postoji." });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = new User({ ime: ime.trim(), email: email.toLowerCase().trim(), password: hashedPassword });
    await user.save();
    res.status(201).json({ message: "Nalog uspešno kreiran." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri registraciji." });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ error: "email i password su obavezni." });

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user)
      return res.status(401).json({ error: "Pogrešan email ili lozinka." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Pogrešan email ili lozinka." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, user: { id: user._id, ime: user.ime, email: user.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri prijavi." });
  }
};
