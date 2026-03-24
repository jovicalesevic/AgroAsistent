const { clerkMiddleware, getAuth } = require("@clerk/express");

function protect(req, res, next) {
  const { userId } = getAuth(req);
  if (!userId) {
    return res.status(401).json({ error: "Niste prijavljeni." });
  }
  req.user = { id: userId };
  next();
}

module.exports = { protect, clerkMiddleware };