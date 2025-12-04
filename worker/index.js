require("dotenv").config();
const mongoose = require("mongoose");
const Redis = require("ioredis");
const User = require("./models/User");
const AuditLog = require("./models/AuditLog");

// 1. Connections
const redis = new Redis(process.env.REDIS_URI);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Worker: DB Connected"))
  .catch((err) => console.error(err));

// 2. Processor: Calculate Wellness Score
const processCompliance = async (data) => {
  const { userId, steps, sleepHours } = JSON.parse(data);
  console.log(`[Job] Calculating score for ${userId}`);

  // Logic:
  // - Steps Goal: 10,000 (60% weight)
  // - Sleep Goal: 7 hours (40% weight)

  const stepsScore = Math.min((steps / 10000) * 60, 60);
  const sleepScore = Math.min((sleepHours / 7) * 40, 40);
  const totalScore = Math.round(stepsScore + sleepScore);

  await User.findByIdAndUpdate(userId, { wellnessScore: totalScore });
  console.log(`[Success] Updated Score: ${totalScore}`);
};

// 3. Processor: Write Security Log
const processAudit = async (data) => {
  const { action, actor, target, details } = JSON.parse(data);
  console.log(`[Audit] ${action} by ${actor}`);

  await AuditLog.create({ action, actor, target, details });
};

// 4. Main Event Loop
const main = async () => {
  console.log("Worker: Listening for jobs...");

  while (true) {
    try {
      // BRPOP blocks connection until data is available in either queue
      // Timeout 0 means wait forever
      const [queue, message] = await redis.brpop(
        "compliance_queue",
        "audit_queue",
        0
      );

      if (queue === "compliance_queue") {
        await processCompliance(message);
      } else if (queue === "audit_queue") {
        await processAudit(message);
      }
    } catch (error) {
      console.error("Worker Error:", error);
      // Wait 1 sec before restarting loop to prevent crash loops
      await new Promise((r) => setTimeout(r, 1000));
    }
  }
};

main();
