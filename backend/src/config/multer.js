import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from './cloudinary.js';

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Cloudinary storage for clinic logo
const clinicLogoStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hospital/clinics',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'fill' }],
  },
});

// Cloudinary storage for clinic images
const clinicImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hospital/clinics/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit' }],
  },
});

// Cloudinary upload middleware for clinic logo
export const uploadClinicLogo = multer({
  storage: clinicLogoStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

// Cloudinary upload middleware for clinic images
export const uploadClinicImage = multer({
  storage: clinicImageStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Storage cho specialty icon
export const specialtyIconStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hospital/specialty-icons',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 200, height: 200, crop: 'fill' }],
  },
});

// Storage cho specialty banner image
export const specialtyImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hospital/specialty-images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 600, crop: 'fill' }],
  },
});

export const uploadSpecialtyIcon = multer({
  storage: specialtyIconStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadSpecialtyImage = multer({
  storage: specialtyImageStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

// Avatar storage (local)
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createUploadsDir = (dir) => {
  const fullPath = path.join(__dirname, '../../uploads', dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  return fullPath;
};

const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadsDir = createUploadsDir('avatars');
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `avatar-${uniqueSuffix}${ext}`);
  }
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
