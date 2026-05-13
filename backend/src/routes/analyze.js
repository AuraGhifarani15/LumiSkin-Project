const express = require("express");
const router = express.Router();
const {
  analyze,
  getHistory,
  getHistoryDetail,
} = require("../controllers/predicController");
const { authenticate } = require("../middleware/auth");
const upload = require("../middleware/upload");

// POST /analyze  (bisa tanpa login untuk coba, dengan login untuk simpan riwayat)
// Mendukung: multipart/form-data (file) atau JSON (base64)
router.post(
  "/",
  (req, res, next) => {
    // Coba authenticate tapi tidak wajib
    const authHeader = req.headers.authorization;
    if (authHeader) {
      return authenticate(req, res, next);
    }
    next();
  },
  upload.single("image"),
  analyze,
);

// GET /analyze/history  (wajib login)
router.get("/history", authenticate, getHistory);

// GET /analyze/history/:id  (wajib login)
router.get("/history/:id", authenticate, getHistoryDetail);

module.exports = router;
