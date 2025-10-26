const express = require("express");
const router = express.Router();
const Student = require("../models/Student");
const protect = require("../middleware/authMiddleware");

// GET current student
router.get("/me", protect, async (req, res) => {
    try {
        res.json(req.student);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
