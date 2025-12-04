const express = require("express");
const router = express.Router();
const User = require("../models/User");
const DailyLog = require("../models/DailyLog");
const { protect, authorize } = require("../middleware/authMiddleware");

router.use(protect);
router.use(authorize("provider"));

router.get("/patients", async (req, res) => {
  try {
    const patients = await User.find({ role: "patient" })
      .select("-password")
      .sort({ createdAt: -1 });
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/patients/:id", async (req, res) => {
  try {
    const patient = await User.findById(req.params.id).select("-password");
    const logs = await DailyLog.find({ user: req.params.id }).sort({
      date: -1,
    });

    if (!patient) return res.status(404).json({ message: "Patient not found" });

    const auditPayload = JSON.stringify({
      action: "DATA_ACCESS",
      actor: req.user.name,
      target: patient.name,
      details: `Provider ${req.user.email} viewed record of ${patient.email}`,
    });
    await redis.lpush("audit_queue", auditPayload);

    res.json({ patient, logs });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
