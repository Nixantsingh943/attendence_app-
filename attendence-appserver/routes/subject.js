const express = require("express");
const router = express.Router();
const Subject = require("../models/Subject");
const protect = require("../middleware/authMiddleware");


// ✅ Get subjects for logged in student only
router.get("/", protect, async (req, res) => {
    try {
        const subjects = await Subject.find({ student: req.student._id });
        res.json(subjects);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch subjects" });
    }
});

// ✅ Create subject for logged in student
router.post("/", protect, async (req, res) => {
    try {
        const { name, type } = req.body;

        if (!name) return res.status(400).json({ message: "Name is required" });

        const subject = await Subject.create({
            name,
            type,
            student: req.student._id
        });

        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ message: "Failed to create subject" });
    }
});
// DELETE a subject by ID
router.delete("/:id", protect, async (req, res) => {
    try {
        const subject = await Subject.findById(req.params.id);
        if (!subject) {
            return res.status(404).json({ message: "Subject not found" });
        }

        await subject.deleteOne(); // delete the document
        res.json({ message: "Subject deleted successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});


module.exports = router;
