const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      default: function () {
        return this.category || 'Sai Villa Photo';
      },
    },
    category: {
      type: String,
      required: true,
      enum: ['Hero', 'Exterior', 'Living Area', 'Pool & Deck', 'Bedrooms', 'Dining & Kitchen', 'Garden'],
      default: 'Exterior',
    },
    isHero: {
      type: Boolean,
      default: false,
    },
    imageUrl: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
    collection: 'galleries',
  }
);

module.exports = mongoose.model('Gallery', gallerySchema);