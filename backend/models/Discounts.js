const mongoose = require("mongoose");

const discount_schema = mongoose.Schema({
  code: {
    type: String,
    trim: true,
    required: true,
    unique: true,
    uppercase: true,
  },
  percentage: {
    type: Number,
    required: true,
    min: [0, "Discount cannot be negative"],
    max: [100, "Discount cannot exceed 100%"],
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, { timestamps: true });

module.exports = mongoose.model("Discount", discount_schema);