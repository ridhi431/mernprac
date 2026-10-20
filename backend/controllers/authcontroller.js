const User = require('../models/user');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');





exports.signupUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "User already exists"
            });
        }

        const user = new User({ name, email, password });
        await user.save();

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        return res.status(201).json({
            message: "User created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error creating user",
            error: err.message
        });
    }
};


exports.loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials" });
        }
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });

    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Error logging in user", error: err.message });
    }
};

exports.forgotPassword = async (req, res) => {
  try {
    const email = req.body.email?.trim().toLowerCase();

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const user = await User.findOne({ email });

    const responseMessage =
      'If that email is registered, a reset link has been sent.';

    if (!user) {
      return res.json({ message: responseMessage });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');

    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    user.resetPasswordExpires = Date.now() + 15 * 60 * 1000;
    await user.save();

    const resetUrl =
      `${process.env.FRONTEND_URL}/reset-password/${rawToken}`;

    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM,
        to: [user.email],
        subject: 'Reset your password',
        text: `Open this link within 15 minutes to reset your password: ${resetUrl}`,
      }),
    });

    const emailResult = await emailResponse.json();

    if (!emailResponse.ok) {
      throw new Error(emailResult.message || 'Resend could not send the email');
    }

    return res.json({ message: responseMessage });
  } catch (err) {
    console.error('Forgot password error:', err);
    return res.status(500).json({ message: 'Could not send reset email' });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password || password.length < 8) {
      return res.status(400).json({
        message: 'A valid token and password of at least 8 characters are required',
      });
    }

    const hashedToken = crypto
      .createHash('sha256')
      .update(token)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: 'Reset link is invalid or expired',
      });
    }

    user.password = password;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    return res.json({ message: 'Password reset successfully' });
  } catch (err) {
    console.error('Reset password error:', err);
    return res.status(500).json({ message: 'Could not reset password' });
  }
};