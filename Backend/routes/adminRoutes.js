const express = require('express');
const router = express.Router();
const {
  loginAdmin,
  lockVillaDates,
  unlockVillaDate,
  uploadGalleryImage,
  deleteGalleryImage,
  getGalleryImages,
} = require('../controllers/adminController');
const { protectAdmin } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');

// Authentication
router.post('/login', loginAdmin);

// Availability & Date Locking
router.post('/lock-dates', protectAdmin, lockVillaDates);
router.post('/unlock-date', protectAdmin, unlockVillaDate);

// Media Management (Hero & Gallery)
router.get('/gallery', getGalleryImages);
router.post('/gallery/upload', protectAdmin, upload.single('image'), uploadGalleryImage);
router.delete('/gallery/:id', protectAdmin, deleteGalleryImage);

module.exports = router;