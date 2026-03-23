const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
const {
  getBeleske,
  createBeleska,
  deleteBeleska,
  deleteAllBeleske,
  toggleBeleska
} = require("../controllers/beleskeController");

router.get("/", protect, getBeleske);
router.post("/", protect, createBeleska);
router.delete("/", protect, deleteAllBeleske);
router.delete("/:id", protect, deleteBeleska);
router.put("/:id/toggle", protect, toggleBeleska);

module.exports = router;
