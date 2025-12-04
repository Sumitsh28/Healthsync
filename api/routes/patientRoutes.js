const express = require("express");
const router = express.Router();
const DailyLog = require("../models/DailyLog");
const { protect, authorize } = require("../middleware/authMiddleware");
const redis = require("../config/redis");

router.post("/log", protect, authorize("patient"), async (req, res) => {
  const { date, steps, sleepHours, mood } = req.body;

  try {
    const log = await DailyLog.findOneAndUpdate(
      { user: req.user._id, date },
      { $set: { steps, sleepHours, mood } },
      { new: true, upsert: true }
    );

    const payload = JSON.stringify({ userId: req.user._id, steps, sleepHours });
    await redis.lpush("compliance_queue", payload);
    res.json(log);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/history", protect, async (req, res) => {
  try {
    const logs = await DailyLog.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(7);
    res.json(logs.reverse());
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
