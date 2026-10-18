// controllers/userController.js
const User = require("../models/user");
const bcrypt = require("bcryptjs");

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


exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        message: "Both passwords are required",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be at least 8 characters",
      });
    }

    const user = await User.findById(getuserID(req));

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    // Current password verify karo
    const isMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Current password is incorrect",
      });
    }

    // New password hash karke save karo
    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (err) {
    console.error("Change password error:", err);

    return res.status(500).json({
      message: "Failed to change password",
    });
  }
};
