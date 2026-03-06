const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Admin_schema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    lowercase: true,
    validate: {
      validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
      message: (props) => `${props.value} is not a valid email address!`,
    },
  },
  password: {
    type: String,
    required: true,
    match: [
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Password must be at least 8 characters long and contain at least one letter and one number",
    ],
  },
  Phone_number: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^(\+20|0020|0)?1[0125]\d{8}$/.test(v),
      message: "Please enter a valid Egyptian phone number (e.g. 01012345678)",
    },
  },
}, { timestamps: true });

Admin_schema.pre("save", async function (next) {
  if (!this.isModified("password")) return next(); // only hash if password changed
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("Admin", Admin_schema);