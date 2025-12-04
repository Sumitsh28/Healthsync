const express = require("express");
const router = express.Router();
const { OpenAI } = require("openai"); // NEW SDK IMPORT
const User = require("../models/User");
const DailyLog = require("../models/DailyLog");
const { protect } = require("../middleware/authMiddleware");

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// @desc    Chat with AI (Context-Aware)
// @route   POST /api/chat
router.post("/", protect, async (req, res) => {
  const { message } = req.body;

  try {
    // 1. Fetch User Context
    const user = await User.findById(req.user._id).select("-password");
    const recentLogs = await DailyLog.find({ user: req.user._id })
      .sort({ date: -1 })
      .limit(3);

    // 2. Prepare Context
    const healthContext = `
      User Profile: Age ${
        new Date().getFullYear() - new Date(user.profile.dob).getFullYear()
      },
      Sex: ${user.profile.sex},
      Conditions: ${user.profile.conditions.join(", ")};
      Recent Logs: ${JSON.stringify(recentLogs)};
      Wellness Score: ${user.wellnessScore};
    `;

    // 3. Call OpenAI (NEW RESPONSES API)
    const response = await openai.responses.create({
      model: "gpt-4o-mini",
      input: [
        {
          role: "system",
          content: `You are Dr. AI, a helpful medical assistant. 
          Always answer in short (2–3 sentences), friendly, and encouraging tone.
          Use this patient data: ${healthContext}`,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply = response.output_text;

    res.json({ reply });
  } catch (error) {
    console.error("OpenAI Error:", error);
    res
      .status(500)
      .json({ message: "AI is currently overloaded. Try again later." });
  }
});

module.exports = router;
