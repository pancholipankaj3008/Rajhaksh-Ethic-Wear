const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
      default: "",
    },

    category: {
      type: String,
      required: true,
      trim: true,
    },

    // Common product images
    images: {
      type: [String],
      default: [],
    },

    wholesalePrice: {
      type: Number,
      required: true,
      min: 0,
    },

    sizes: {
      type: [String],
      default: [],
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
