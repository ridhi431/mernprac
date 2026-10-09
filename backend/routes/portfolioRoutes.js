// routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();

// CHANGE THIS: path and export name of your auth middleware
const protect = require('../middleware/authMiddleware');

const {
  createPortfolio,
  getMyPortfolios,
  getPortfolioById,
  updatePortfolio,
  deletePortfolio,
  getPublicPortfolio,
} = require('../controllers/portfolioController');

// Public (no login). This MUST come before '/:id',
// otherwise Express treats "public" as an id.
router.get('/public/:slug', getPublicPortfolio);

// Protected (login required)
router.post('/', protect, createPortfolio);
router.get('/', protect, getMyPortfolios);
router.get('/:id', protect, getPortfolioById);
router.put('/:id', protect, updatePortfolio);
router.delete('/:id', protect, deletePortfolio);

module.exports = router;