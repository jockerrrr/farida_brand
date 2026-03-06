const settings_db = require("../models/Settings");

const getall = async (req, res) => {
  try {
    const settings = await settings_db.find();
    res.status(200).json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create_setting = async (req, res) => {
  try {
    const new_setting = new settings_db(req.body);
    await new_setting.save();
    res.status(201).json({ message: "settings added" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
const update_setting = async (req, res) => {
  try {
    const settings = await settings_db.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!settings) return res.status(404).json({ message: "settings not found" });
    res.status(200).json({ message: "settings updated", settings });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const del_setting = async (req, res) => {
  try {
    const doc = await settings_db.findByIdAndDelete(req.params.id);
    if (!doc) {
      return res.status(404).json({ message: "settings not found" });
    }
    res.status(200).json({ message: "settings deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const get_byID = async (req, res) => {
  try {
    const settings = await settings_db.findById(req.params.id);
    if (!settings) {
      return res.status(404).json({ message: "settings not found" });
    }
    res.status(200).json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getall, create_setting, update_setting, del_setting, get_byID };
