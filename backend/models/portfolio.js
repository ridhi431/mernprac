// models/portfoliodone.js
const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema(
  {
    // Which user owns this portfolio
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },

    // Used in the public link: /p/aarav-sharma-x7k2
    slug: { type: String, required: true, unique: true, index: true },

    theme: { type: String, default: 'light' },
    isPublic: { type: Boolean, default: true },

    basic: {
      name: { type: String, required: true, trim: true },
      title: { type: String, required: true, trim: true },
      bio: { type: String, default: '', trim: true },
      photo: { type: String, default: '', trim: true },
    },

    contact: {
      email: { type: String, required: true, trim: true, lowercase: true },
      github: { type: String, default: '', trim: true },
      linkedin: { type: String, default: '', trim: true },
    },

    skills: { type: [String], default: [] },

    projects: [
      {
        title: { type: String, default: '', trim: true },
        description: { type: String, default: '', trim: true },
        link: { type: String, default: '', trim: true },
      },
    ],

    experience: [
      {
        company: { type: String, default: '', trim: true },
        role: { type: String, default: '', trim: true },
        duration: { type: String, default: '', trim: true },
        description: { type: String, default: '', trim: true },
      },
    ],

    education: [
      {
        institute: { type: String, default: '', trim: true },
        degree: { type: String, default: '', trim: true },
        year: { type: String, default: '', trim: true },
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Portfolio', portfolioSchema);