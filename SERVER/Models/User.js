const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ["customer", "admin"], default: "customer", index: true },
  phone: { type: String, trim: true, default: "" },
  isBlocked: { type: Boolean, default: false },
  resetPasswordToken: { type: String, select: false },
  resetPasswordExpire: { type: Date, select: false },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
