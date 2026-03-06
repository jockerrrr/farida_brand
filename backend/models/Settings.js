const mongoose = require("mongoose");

const settings_schema = mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  value: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model("Settings", settings_schema);