// controllers/portfolioController.js
const Portfolio = require('../models/portfolio');
const jwt = require('jsonwebtoken');

/* ---------- helpers ---------- */

// Change this one line if your auth middleware stores the id differently
const getUserId = (req) => req.user?.id || req.user?._id || req.userId;

const makeSlug = (name) => {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base || 'portfolio'}-${suffix}`;
};

// Only these fields can be set by the client (the user and slug never come from the body)
const pickFields = (body) => {
  const clean = (arr = [], key) =>
    (Array.isArray(arr) ? arr : []).filter((item) => item?.[key]?.trim());

  return {
    theme: body.theme,
    isPublic: body.isPublic,
    basic: body.basic,
    contact: body.contact,
    skills: Array.isArray(body.skills) ? body.skills : [],
    projects: clean(body.projects, 'title'),
    experience: (Array.isArray(body.experience) ? body.experience : []).filter(
      (e) => e?.company?.trim() || e?.role?.trim()
    ),
    education: clean(body.education, 'institute'),
  };
};

const validate = (fields) => {
  if (!fields.basic?.name?.trim() || !fields.basic?.title?.trim()) {
    return 'Name and title are required';
  }
  if (!fields.contact?.email?.trim()) {
    return 'Email is required';
  }
  return null;
};

/* ---------- controllers ---------- */

// POST /api/portfolios
exports.createPortfolio = async (req, res) => {
  try {
    const fields = pickFields(req.body);
    const error = validate(fields);
    if (error) return res.status(400).json({ message: error });

    const portfolio = await Portfolio.create({
      ...fields,
      user: getUserId(req),
      slug: makeSlug(fields.basic.name),
    });

    res.status(201).json(portfolio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to create portfolio' });
  }
};

// GET /api/portfolios  (only the logged-in user's portfolios)
exports.getMyPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ user: getUserId(req) }).sort({ updatedAt: -1 });
    res.json(portfolios);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch portfolios' });
  }
};

// GET /api/portfolios/:id  (owner only, used for editing)
exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ _id: req.params.id, user: getUserId(req) });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.json(portfolio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch portfolio' });
  }
};

// PUT /api/portfolios/:id
exports.updatePortfolio = async (req, res) => {
  try {
    const fields = pickFields(req.body);
    const error = validate(fields);
    if (error) return res.status(400).json({ message: error });

    const portfolio = await Portfolio.findOneAndUpdate(
      { _id: req.params.id, user: getUserId(req) },
      fields,
      { new: true, runValidators: true }
    );
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    res.json(portfolio);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to update portfolio' });
  }
};

// DELETE /api/portfolios/:id
exports.deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOneAndDelete({
      _id: req.params.id,
      user: getUserId(req),
    });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    res.json({ message: 'Portfolio deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to delete portfolio' });
  }
};

// GET /api/portfolios/public/:slug  (accessible by public if isPublic: true, or by owner if private)
exports.getPublicPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findOne({ slug: req.params.slug });
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    let isOwner = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded.userId || decoded.id || decoded._id;
        if (userId && portfolio.user && portfolio.user.toString() === userId.toString()) {
          isOwner = true;
        }
      } catch (e) {
        // Token invalid or expired, continue as guest
      }
    }

    // If private and not owner, restrict access
    if (!portfolio.isPublic && !isOwner) {
      return res.status(403).json({
        message: 'This portfolio is private. Only the creator can view it.',
      });
    }

    const data = portfolio.toObject();
    delete data.user;
    res.json({ ...data, isOwner });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch portfolio' });
  }
};