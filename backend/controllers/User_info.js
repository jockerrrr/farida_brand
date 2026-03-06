const User_info = require("../models/User_info");

const getall = async (req, res) => {
  try {
    const users = await User_info.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const create_user = async (req, res) => {
  try {
    // check if user already exists
    let user = await User_info.findOne({ email: req.body.email });
    
    if (user) {
      // user exists — update their info and return existing user
      Object.assign(user, req.body);
      await user.save();
      return res.status(200).json({ message: "User info updated", user });
    }

    // new user — create them
    const newUser = new User_info(req.body);
    await newUser.save();
    res.status(201).json({ message: "User info saved", user: newUser });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const update_userINFO = async (req, res) => {
  try {
    const updateUSER = await User_info.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updateUSER) return res.status(404).json({ message: "user not found" });
    res.status(200).json({ message: "User info updated", updateUSER });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const delete_user = async (req, res) => {
  try {
    const doc = await User_info.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: "user not found" });
    res.status(200).json({ message: "user deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const get_byID = async (req, res) => {
  try {
    const user = await User_info.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "user not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getall, create_user, update_userINFO, delete_user, get_byID };