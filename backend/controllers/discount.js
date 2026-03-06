const disc_db = require("../models/Discounts");

const getall = async (req, res) => {
  try {
    const discount = await disc_db.find();
    res.status(200).json(discount);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const add_disc = async (req, res) => {
  try {
    const newdisc = new disc_db(req.body);
    await newdisc.save();
    res.status(201).json({ message: "discount added" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const update_disc = async (req, res) => {
  try {
    const discount = await disc_db.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!discount) return res.status(404).json({ message: "discount not found" });
    res.status(200).json({ message: "discount updated", discount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const delete_discount = async (req, res) => {
  try {
    const doc = await disc_db.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "discount not found" });
    }
    res.status(200).json({ message: "discount deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const get_byID = async (req, res) => {
  try {
    const discount = await disc_db.findById(req.params.id);
    if (!discount) {
      return res.status(404).json({ message: "discount not found" });
    }
    res.status(200).json(discount);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getall, add_disc, update_disc, delete_discount, get_byID };
