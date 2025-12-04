const mongoose = require("mongoose");

const dailyLogSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: String, required: true }, // Format: YYYY-MM-DD to simplify querying
    steps: { type: Number, default: 0 },
    sleepHours: { type: Number, default: 0 },
    mood: { type: String, enum: ["Happy", "Neutral", "Sad", ""], default: "" },
  },
  { timestamps: true }
);

dailyLogSchema.index({ user: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailyLog", dailyLogSchema);
