const mongoose = require("mongoose");

const user_scheme = new mongoose.Schema({
  Firstname: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v) => v.length > 0,
      message: "First name cannot be empty",
    },
  },
  Lastname: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v) => v.length > 0,
      message: "Last name cannot be empty",
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: "Please enter a valid email address",
    },
  },
  Address: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v) => v.length > 0,
      message: "Address cannot be empty",
    },
  },
  city: {
    type: String,
    required: true,
    trim: true,
    validate: {
      validator: (v) => v.length > 0,
      message: "City cannot be empty",
    },
  },
  Phone: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^(\+20|0020|0)?1[0125]\d{8}$/.test(v),
      message: "Please enter a valid Egyptian phone number (e.g. 01012345678)",
    },
  },
  Apartment_suite_etc: {
    type: String,
    required: false,
    trim: true,
  },
  save_info: {
    type: Boolean,
    default: false,
  },
},
{ timestamps: true }
);

module.exports = mongoose.model("User", user_scheme);