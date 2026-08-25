const Admin = require('../models/Admin');
const Booking = require('../models/Booking');
const Gallery = require('../models/Gallery');
const { cloudinary } = require('../config/cloudinary');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'sai_villa_secret_key_2026', {
    expiresIn: '7d',
  });
};

// 1. Admin Login
exports.loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required',
      });
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const cleanPassword = String(password).trim();

    const admin = await Admin.findOne({ username: cleanUsername });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(cleanPassword, admin.password);
    } catch {
      isMatch = false;
    }

    if (!isMatch && admin.password === cleanPassword) {
      isMatch = true;
    }

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password',
      });
    }

    return res.status(200).json({
      success: true,
      token: generateToken(admin._id),
      username: admin.username,
    });
  } catch (error) {
    console.error('[Admin Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server login error',
    });
  }
};

// 2. Lock Villa / Manual Slot Reservation
exports.lockVillaDates = async (req, res) => {
  try {
    const { dates, checkIn, checkOut, reason } = req.body;

    if (dates && Array.isArray(dates) && dates.length > 0) {
      const createdLocks = [];

      for (const dateStr of dates) {
        const startDate = new Date(dateStr);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);

        const lockDoc = await Booking.create({
          guestName: 'Host Reserved',
          email: 'admin@saivilla.com',
          phone: '0000000000',
          checkIn: startDate,
          checkOut: endDate,
          totalDays: 1,
          totalPrice: 0,
          totalGuests: 1,
          status: 'locked',
          notes: reason || 'Host Block / Maintenance',
        });
        createdLocks.push(lockDoc);
      }

      return res.status(200).json({
        success: true,
        message: `Successfully locked ${createdLocks.length} date(s)`,
        locks: createdLocks,
      });
    }

    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) || 1;

      const lockDoc = await Booking.create({
        guestName: 'Host Reserved',
        email: 'admin@saivilla.com',
        phone: '0000000000',
        checkIn: start,
        checkOut: end,
        totalDays: diffDays,
        totalPrice: 0,
        totalGuests: 1,
        status: 'locked',
        notes: reason || 'Host Block / Maintenance',
      });

      return res.status(200).json({
        success: true,
        message: 'Dates locked successfully',
        lock: lockDoc,
      });
    }

    return res.status(400).json({
      success: false,
      message: 'Please provide valid dates to lock.',
    });
  } catch (error) {
    console.error('Lock Dates Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to lock dates',
    });
  }
};

// 3. Unlock Single Date Slot
exports.unlockVillaDate = async (req, res) => {
  try {
    const { date } = req.body;

    if (!date) {
      return res.status(400).json({
        success: false,
        message: 'Date is required to unlock.',
      });
    }

    const startOfDay = new Date(`${date}T00:00:00.000Z`);
    const endOfDay = new Date(`${date}T23:59:59.999Z`);

    const result = await Booking.deleteMany({
      status: 'locked',
      $or: [
        {
          checkIn: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
        {
          notes: new RegExp(date, 'i'),
        },
      ],
    });

    console.log(`[Unlock Date]: Deleted ${result.deletedCount} lock document(s) for ${date}`);

    return res.status(200).json({
      success: true,
      message: `Date ${date} has been unlocked successfully.`,
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error('[Unlock Date Error]:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to unlock date',
    });
  }
};

// 4. Upload Image (Hero or Gallery)
exports.uploadGalleryImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const { category, isHero } = req.body;
    const isHeroImage = isHero === 'true' || category === 'Hero';

    // Enforce 5 hero images limit
    if (isHeroImage) {
      const heroCount = await Gallery.countDocuments({
        $or: [{ isHero: true }, { category: 'Hero' }],
      });

      if (heroCount >= 5) {
        return res.status(400).json({
          success: false,
          message: 'Hero section limit reached (Maximum 5 images). Delete one before uploading.',
        });
      }
    }

    let secureUrl = '';
    let publicId = '';

    // Handle buffer stream upload or Multer-Cloudinary direct path
    if (req.file.buffer) {
      const streamUpload = (buffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: isHeroImage ? 'saivilla_hero' : 'saivilla_gallery',
              resource_type: 'image',
            },
            (error, result) => {
              if (result) resolve(result);
              else reject(error);
            }
          );
          stream.end(buffer);
        });
      };

      const uploadResult = await streamUpload(req.file.buffer);
      secureUrl = uploadResult.secure_url;
      publicId = uploadResult.public_id;
    } else {
      secureUrl = req.file.path || req.file.secure_url;
      publicId = req.file.filename || req.file.public_id;
    }

    const selectedCategory = isHeroImage ? 'Hero' : (category || 'Exterior');

    const newPhoto = await Gallery.create({
      title: `${selectedCategory} Showcase`,
      category: selectedCategory,
      isHero: isHeroImage,
      imageUrl: secureUrl,
      publicId: publicId,
    });

    res.status(201).json({
      success: true,
      message: `${isHeroImage ? 'Hero' : 'Gallery'} photo uploaded successfully`,
      photo: newPhoto,
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ success: false, message: error.message || 'Image upload failed' });
  }
};

// 5. Delete Image
exports.deleteGalleryImage = async (req, res) => {
  const { id } = req.params;
  try {
    const photo = await Gallery.findById(id);
    if (!photo) {
      return res.status(404).json({ success: false, message: 'Photo not found' });
    }

    if (photo.publicId) {
      await cloudinary.uploader.destroy(photo.publicId);
    }

    await Gallery.findByIdAndDelete(id);

    res.status(200).json({ success: true, message: 'Image deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Failed to delete photo' });
  }
};

// 6. Fetch All Gallery & Hero Images
exports.getGalleryImages = async (req, res) => {
  try {
    const photos = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, photos });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};