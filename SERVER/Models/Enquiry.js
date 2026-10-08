const mongoose = require("mongoose");

const enquiryItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  selection: {
    size: { type: String, default: "" },
    sku: { type: String, required: true },
  },
  quantity: { type: Number, required: true, min: 1 },
  productSnapshot: { title: { type: String, required: true }, image: { type: String, default: "" }, wholesalePrice: { type: Number, required: true } },
}, { _id: true });
const enquirySchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  customerName: { type: String, required: true, trim: true }, businessName: { type: String, trim: true, default: "" },
  phone: { type: String, required: true, trim: true }, email: { type: String, required: true, trim: true, lowercase: true }, city: { type: String, required: true, trim: true },
  message: { type: String, trim: true, maxlength: 2000, default: "" }, items: { type: [enquiryItemSchema], validate: { validator: (items) => Array.isArray(items) && items.length > 0, message: "Enquiry must contain at least one item" } },
  status: { type: String, enum: ["pending", "contacted", "completed", "cancelled"], default: "pending", index: true },
}, { timestamps: true });
enquirySchema.index({ status: 1, createdAt: -1 });
module.exports = mongoose.model("Enquiry", enquirySchema);
