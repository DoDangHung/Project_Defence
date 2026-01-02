import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Storage cho icon
const iconStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'medpro/specialties/icons',
    allowed_formats: ['jpg', 'jpeg', 'png', 'svg', 'webp'],
    transformation: [{ width: 200, height: 200, crop: 'limit' }],
  },
});

// Storage cho image/banner
const imageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'medpro/specialties/images',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 600, crop: 'limit' }],
  },
});

const clinicImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hospital/clinics',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'fill' }],
  },
});

// Storage cho avatar/logo (single image)
const avatarStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hospital/avatars',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    transformation: [{ width: 500, height: 500, crop: 'fill' }],
  },
});

// Storage cho medical records
const medicalRecordStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'hospital/medical-records',
    allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'],
    resource_type: 'auto',
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Chấp nhận images
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer instances
const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
});

const uploadClinicImages = multer({
  storage: clinicImageStorage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

const uploadMedicalRecord = multer({
  storage: medicalRecordStorage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB
  },
});
const uploadIcon = multer({ storage: iconStorage });
const uploadImage = multer({ storage: imageStorage });

// Helper function để xóa ảnh từ Cloudinary
const deleteImage = async (imageUrl) => {
  try {
    if (!imageUrl) return;

    // Extract public_id from URL
    const urlParts = imageUrl.split('/');
    const fileWithExt = urlParts[urlParts.length - 1];
    const publicId = `medpro/specialties/${urlParts[urlParts.length - 2]}/${
      fileWithExt.split('.')[0]
    }`;

    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error deleting image from Cloudinary:', error);
  }
};

// ES module exports
export {
  uploadIcon,
  uploadImage,
  deleteImage,
  uploadAvatar,
  uploadClinicImages,
  uploadMedicalRecord,
};
export default cloudinary;
