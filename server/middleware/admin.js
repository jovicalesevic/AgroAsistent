const { getAuth } = require("@clerk/express");
const { clerkClient } = require("@clerk/express");

async function adminOnly(req, res, next) {
  try {
    const { userId } = getAuth(req);
    if (!userId) {
      return res.status(401).json({ error: "Niste prijavljeni." });
    }
    const user = await clerkClient.users.getUser(userId);
    const role = user.publicMetadata?.role;
    if (role !== "admin") {
      return res.status(403).json({ error: "Nemate pristup." });
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Greška pri proveri pristupa." });
  }
}

module.exports = { adminOnly };

