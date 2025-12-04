const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["patient", "provider"],
      default: "patient",
    },
    consentGiven: { type: Boolean, default: false },

    profile: {
      sex: String,
      dob: Date,
      height: Number,
      weight: Number,
      activityLevel: String,
      smoking: String,
      alcohol: String,
      allergies: [String],
      medications: [String],
      conditions: [String],
    },
    wellnessScore: { type: Number, default: 0 },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
