const express = require("express");
const router = express.Router();
const Attendance = require("../models/Attendance");
const Subject = require("../models/Subject");
const protect = require("../middleware/authMiddleware");

// Mark Attendance
router.post("/mark", protect, async (req, res) => {
    const { subjectId, type = "Class", date = new Date(), status = "Present" } = req.body;

    if (!subjectId) {
        return res.status(400).json({ message: "Subject ID is required" });
    }

    try {
        // Check if subject exists
        const subject = await Subject.findById(subjectId);
        if (!subject) return res.status(404).json({ message: "Subject not found" });

        // Check if attendance already exists for this student, subject, and date
        const existing = await Attendance.findOne({
            student: req.student._id,
            subject: subjectId,
            date: new Date(date).toISOString().slice(0, 10), // Compare only date part
        });

        if (existing) {
            return res.status(400).json({ message: "Attendance already marked for this subject/date" });
        }

        // Create attendance record
        const attendance = await Attendance.create({
            student: req.student._id,
            subject: subjectId,
            type,
            date: new Date(date),
            status,
        });

        res.status(201).json({ message: "Attendance marked successfully", attendance });
    } catch (err) {
        console.error("Error marking attendance:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get all attendance for student
router.get("/", protect, async (req, res) => {
    try {
        const records = await Attendance.find({ student: req.student._id })
            .populate("subject", "name type")
            .sort({ date: -1 });
        res.json(records);
    } catch (err) {
        console.error("Error fetching attendance:", err);
        res.status(500).json({ message: "Server error" });
    }
});

// Get stats per subject
router.get("/stats", protect, async (req, res) => {
    try {
        const records = await Attendance.find({ student: req.student._id }).populate("subject", "name");
        const stats = {};

        records.forEach(r => {
            const subj = r.subject.name;
            if (!stats[subj]) stats[subj] = { Present: 0, Absent: 0 };
            stats[subj][r.status] += 1;
        });

        res.json(stats);
    } catch (err) {
        console.error("Error fetching stats:", err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
