const admin_db = require("../models/Admin");
const bcrypt = require("bcrypt");
const jwt=require("jsonwebtoken")

const getall = async (req, res) => {
  try {
    const admin = await admin_db.find();
    res.status(200).json(admin);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const add_Admin = async (req, res) => {
  try {
    const new_admin = new admin_db(req.body);
    await new_admin.save();
    res.status(201).json({ message: "admin added" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const update_admin = async (req, res) => {
  try {
    const admin = await admin_db.findById(req.params.id);
    if (!admin) return res.status(404).json({ message: "admin not found" });

    Object.assign(admin, req.body);
    await admin.save(); // this triggers the pre('save') hook

    res.status(200).json({ message: "admin updated", admin });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const del_admin = async (req, res) => {
  try {
    const doc = await admin_db.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "admin not found" });
    }
    res.status(200).json({ message: "admin deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const get_byID = async (req, res) => {
  try {
    const admin = await admin_db.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ message: "admin not found" });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await admin_db.findOne({ email });
    if (!admin) {
      return res.status(400).json({ msg: " invalid admin email" });
    }
    const ismatched = await bcrypt.compare(password, admin.password);
    if (!ismatched) {
      return res.status(400).json({ msg: " incorrect password" });
    }
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // true in production
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getall, add_Admin, update_admin, del_admin, get_byID ,login};
