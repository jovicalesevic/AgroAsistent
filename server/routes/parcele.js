const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getParcele, importParcele, updateParcela } = require("../controllers/parceleController");

router.get("/", protect, getParcele);
router.post("/import", protect, importParcele);
router.put("/:id", protect, updateParcela);

module.exports = router;

