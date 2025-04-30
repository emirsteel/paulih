// backend/routes/upload.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Set storage engine for multer
const storage = multer.diskStorage({
  destination: './uploads/profile-pictures/',
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

// Upload route
const upload = multer({ storage }).single('profileImage');

router.post('/upload-profile-image', (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Upload failed', error: err.message });
    }

    res.json({ profileImageUrl: `/uploads/profile-pictures/${req.file.filename}` });
  });
});

module.exports = router;
