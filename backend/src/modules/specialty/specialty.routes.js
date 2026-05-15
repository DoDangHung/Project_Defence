import specialtyController from './specialty.controller.js';
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Upload path: backend/uploads/specialties (same as app.js static serve)
const uploadsDir = path.resolve(__dirname, '../../uploads/specialties');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const router = express.Router();

// Configure multer for local storage (for testing)
// In production, you can switch to Cloudinary
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, `specialty-${uniqueSuffix}${ext}`);
  }
});

const fileFilter = (req, file, cb) => {
  const allowedMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Chỉ chấp nhận file ảnh (jpg, png, gif, webp)'), false);
  }
};

const uploadIcon = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

const uploadImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB
});

// Public routes
router.get('/', specialtyController.getAllSpecialties);
router.get('/popular', specialtyController.getPopularSpecialties);
router.get('/category/:categorySlug', specialtyController.getSpecialtiesByCategory);

// IMPORTANT: Chi tiết phải đặt TRƯỚC /slug/:slug để tránh bị match nhầm
router.get('/slug/:slug/detail', specialtyController.getSpecialtyDetail);
router.get('/slug/:slug', specialtyController.getSpecialtyBySlug);
router.get('/clinic/:clinicId', specialtyController.getSpecialtiesByClinic);
router.get('/clinic/slug/:clinicSlug', specialtyController.getSpecialtiesByClinicSlug);
router.get('/:id', specialtyController.getSpecialtyById);

// Upload icon endpoint
router.post('/upload-icon', (req, res) => {
  uploadIcon.single('icon')(req, res, (err) => {
    if (err) {
      console.error('Icon upload error:', err);
      return res.status(400).json({
        success: false,
        message: 'Lỗi upload icon: ' + err.message,
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy file icon',
      });
    }
    
    // Return the file path that will be served statically
    const iconPath = `/uploads/specialties/${req.file.filename}`;
    res.status(200).json({
      success: true,
      icon: iconPath,
    });
  });
});

// Upload image endpoint
router.post('/upload-image', (req, res) => {
  uploadImage.single('image')(req, res, (err) => {
    if (err) {
      console.error('Image upload error:', err);
      return res.status(400).json({
        success: false,
        message: 'Lỗi upload image: ' + err.message,
      });
    }
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy file image',
      });
    }
    
    // Return the file path that will be served statically
    const imagePath = `/uploads/specialties/${req.file.filename}`;
    res.status(200).json({
      success: true,
      image: imagePath,
    });
  });
});

// Protected routes
// router.use(authenticate);
// router.use(authorize(['admin']));

router.post('/', specialtyController.createSpecialty);
router.put('/:id', specialtyController.updateSpecialty);
router.delete('/:id', specialtyController.deleteSpecialty);
router.patch('/:id/priority', specialtyController.updatePriority);
router.patch('/:id/toggle-active', specialtyController.toggleActive);

export default router;
