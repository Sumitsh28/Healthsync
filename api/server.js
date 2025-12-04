require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const connectDB = require("./config/db");
const redis = require("./config/redis");
const authRoutes = require("./routes/authRoutes");

const app = express();

connectDB();

app.use(helmet());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/patient", require("./routes/patientRoutes"));
app.use("/api/provider", require("./routes/providerRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));

app.get("/", (req, res) => {
  res.send("Health Sync API is running...");
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
