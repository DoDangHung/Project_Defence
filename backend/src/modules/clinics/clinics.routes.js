import { clinicsController } from './clinics.controller.js';
import { uploadClinicLogo, uploadClinicImage } from '../../config/multer.js';
import express from 'express';
const router = express.Router();
// Tạo clinic với JSON body (không upload)
router.post('/', clinicsController.createClinic);

// Upload logo endpoint
router.post('/upload-logo', (req, res) => {
  console.log('Logo upload endpoint called');
  uploadClinicLogo.single('logo')(req, res, (err) => {
    console.log('Multer processed, req.file:', req.file);
    if (err) {
      console.error('Logo upload error:', err);
      return res.status(400).json({
        success: false,
        message: 'Lỗi upload logo: ' + err.message,
      });
    }
    if (!req.file) {
      console.log('No file in req.file');
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy file logo',
      });
    }
    // Cloudinary returns secure_url in different locations depending on version
    const logoPath = req.file.secure_url || req.file.url || req.file.path;
    console.log('Logo uploaded, URL:', logoPath);
    res.status(200).json({
      success: true,
      logo: logoPath,
    });
  });
});

// Upload images endpoint
router.post('/upload-images', (req, res) => {
  uploadClinicImage.array('images', 10)(req, res, (err) => {
    if (err) {
      console.error('Images upload error:', err);
      return res.status(400).json({
        success: false,
        message: 'Lỗi upload images: ' + err.message,
      });
    }
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không tìm thấy file images',
      });
    }
    // Cloudinary returns secure_url in different locations depending on version
    const imagePaths = req.files.map(file => file.secure_url || file.url || file.path);
    console.log('Images uploaded, URLs:', imagePaths);
    res.status(200).json({
      success: true,
      images: imagePaths,
    });
  });
});

router.get('/statistics', clinicsController.getClinicStatistics);
router.post(
  '/:clinicId/specialties',
  clinicsController.assignSpecialtiesToClinic
);
router.get('/:clinicId/specialties', clinicsController.getClinicSpecialties);
// Đảm bảo route có :id parameter
router.get('/:id/doctors', clinicsController.getClinicDoctors);
router.post('/:clinicId/doctors', clinicsController.assignDoctorsToClinic);
router.get('/nearby', clinicsController.searchClinicsNearby);
router.get('/slug/:slug', clinicsController.getClinicBySlug);
// CRUD operations
router.get('/:id', clinicsController.getClinicById);
router.get('/', clinicsController.getAllClinics);
router.post('/', clinicsController.createClinic);
router.put('/:id', clinicsController.updateClinic);
router.patch('/:id/toggle-status', clinicsController.toggleClinicStatus);
router.delete('/:id', clinicsController.deleteClinic);
// Clinic doctors và appointments
router.get('/:id/doctors', clinicsController.getClinicDoctors);
router.get('/:id/appointments', clinicsController.getClinicAppointments);

// ... các routes khác

export default router;
