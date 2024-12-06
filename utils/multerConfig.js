const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinaryConfig'); // Adjust path if needed

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'profile_images', // Folder name in Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'],
  },
});

// Configure Multer
const upload = multer({ storage: storage });

module.exports = upload;
