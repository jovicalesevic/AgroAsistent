const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { adminOnly } = require("../middleware/admin");
const {
  getAktivniOglas,
  getAllOglasi,
  createOglas,
  updateOglas,
  deleteOglas,
  toggleOglas
} = require("../controllers/oglasiController");

router.get("/aktivni", getAktivniOglas);
router.get("/", protect, adminOnly, getAllOglasi);
router.post("/", protect, adminOnly, createOglas);
router.put("/:id", protect, adminOnly, updateOglas);
router.delete("/:id", protect, adminOnly, deleteOglas);
router.put("/:id/toggle", protect, adminOnly, toggleOglas);

module.exports = router;

