const mongoose = require("mongoose");

const Product_schema = new mongoose.Schema(
  {
    Product_name: {
      type: String,
      trim: true,
      required: true,
      validate: {
        validator: (v) => v.length > 0,
        message: "Product name cannot be empty",
      },
    },
    Price: {
      type: Number,
      required: true,
      validate: {
        validator: (v) => v > 0,
        message: "Price must be greater than 0",
      },
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    images: {
      type: [String],
      required: false,
    },

    stock: {
      type: Number,
      required: false,
      default: 0,
      validate: {
        validator: (v) => v >= 0,
        message: "Stock cannot be negative",
      },
    },
    category: {
      type: String,
      required: false,
    },
    gender: {
      type: String,
      enum: ["men", "women", "unisex", "kids"],
      required: false,
    },
    sizes_available: {
      type: [String],
      required: true,
    },
    size_chart: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "Chart",
      required: false,
      default: [],
    },
    newCollection: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Product", Product_schema);
