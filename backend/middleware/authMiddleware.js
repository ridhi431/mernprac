// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  const header = req.headers.authorization;

  // Expect: "Bearer <token>"
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }

  const token = header.split(' ')[1];

  try {
    // CHANGE THIS if your env variable has a different name
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // CHANGE THIS if your token payload uses a different key (userId, _id, ...)
    req.user = { id: decoded.userId };

    next();
  } catch (err) {
      console.log('JWT error:', err.message);
    return res.status(401).json({ message: 'Not authorized, token invalid or expired' });
  }
};

module.exports = protect;