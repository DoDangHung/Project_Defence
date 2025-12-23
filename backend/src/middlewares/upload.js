import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => ({
    folder: 'hospital/users', // 📂 folder trên cloudinary
    resource_type: 'image',
    public_id: `user_${req.params.id}_${Date.now()}`,
    allowed_formats: ['jpg', 'jpeg', 'png'],
  }),
});

export const uploadAvatar = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2MB
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      cb(new Error('Only image files are allowed'), false);
    } else {
      cb(null, true);
    }
  },
});
