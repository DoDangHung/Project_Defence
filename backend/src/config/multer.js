import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

// Storage cho avatar
export const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hospital/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'fill' }],
  },
});

// Storage cho clinic logo
export const logoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hospital/clinic-logos',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 300, height: 300, crop: 'fill' }],
  },
});

// Storage cho clinic images
export const clinicImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hospital/clinic-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'fill' }],
  },
});

const fileFilter = (req, file, cb) => {
  console.log('File mimetype:', file.mimetype);
  console.log('File originalname:', file.originalname);

  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

export const uploadLogo = multer({
  storage: logoStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadClinicImages = multer({
  storage: clinicImageStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});
