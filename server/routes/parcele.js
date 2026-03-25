const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const { getParcele, importParcele, updateParcela, deleteAllParcele } = require("../controllers/parceleController");

router.get("/", protect, getParcele);
router.post("/import", protect, importParcele);
router.put("/:id", protect, updateParcela);
router.delete("/", protect, deleteAllParcele);

module.exports = router;
