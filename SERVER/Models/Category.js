const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  slug: { type: String, required: true, trim: true, unique: true, index: true },
  description: { type: String, trim: true, default: "" },
  image: { type: String, default: "" },
  isActive: { type: Boolean, default: true, index: true },
}, { timestamps: true });

module.exports = mongoose.model("Category", categorySchema);
