// controllers/userController.js
const User = require("../models/user");

const getuserID = (req) => req.user?.id || req.user?._id || req.userId;

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(getuserID(req)).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateMe = async (req, res) => {
  try {
    const { name, bio, photo } = req.body;
    const updates = {};

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({ message: "Name cannot be empty" });
      }
      updates.name = String(name).trim();
    }
    if (bio !== undefined) updates.bio = String(bio).trim();
    if (photo !== undefined) updates.photo = String(photo).trim();

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const user = await User.findByIdAndUpdate(getuserID(req), updates, {
      new: true,
      runValidators: true,
    }).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user); // this line was missing
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};