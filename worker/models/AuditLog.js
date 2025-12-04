const mongoose = require("mongoose");

const auditLogSchema = mongoose.Schema(
  {
    action: { type: String, required: true },
    actor: { type: String, required: true },
    target: { type: String },
    details: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);
